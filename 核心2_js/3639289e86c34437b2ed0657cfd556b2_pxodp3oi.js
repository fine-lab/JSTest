let AbstractAPIHandler = require("AbstractAPIHandler");
const getU8Domain = (keyParams) => {
  let U8DOMAIN = "https://www.example.com/";
  return U8DOMAIN + keyParams;
};
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
const getPeriodObj = (periodList, periodCode) => {
  for (var i in periodList) {
    let periodObj = periodList[i];
    if (periodObj.code == periodCode) {
      return periodObj;
    }
  }
  return periodList[0];
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let LogToDB = true;
    let publicFlag = "【记】";
    var obj = JSON.parse(AppContext());
    var tid = obj.currentUser.tenantId;
    let voucherIds = request.voucherIds;
    let voucherIdList = voucherIds.split(",");
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let periodResp = openLinker("POST", DOMAIN + "/yonbip/fi/fipub/basedoc/querybd/accperiod", "AT1703B12408A00002", null);
    let periodMap = new Map();
    let periodRespObj = JSON.parse(periodResp);
    let periodObjs = periodRespObj.data;
    for (var j in periodObjs) {
      let periodObj = periodObjs[j];
      periodMap.set(periodObj.code, periodObj);
    }
    let successCount = 0;
    for (var i in voucherIdList) {
      let ids = voucherIdList[i];
      let paramArray = ids.split("**");
      let voucherId = paramArray[0];
      let id = paramArray[1];
      let voucherCode = paramArray[2];
      let accBookCode = paramArray[3];
      let periodUnion = paramArray[4];
      let voucherSql =
        "select id,org,billCode,ts,voucherKind,modifier,totalCreditGlobal,billNo,signer,otpSign,totalDebitGroup,signTime," +
        "totalDebitOrg,makeTime,accBook,accBook.code,auditTime,periodUnion,srcSystem,flag,creationTime,displayName,tallyTime,qtyAdjust," +
        "description,srcSystemName,totalCreditOrg,groupypd,creator,voucherType,auditor,auditTime,maker,totalDebitGlobal,tallyMan,voucherStatus,attachedBill,totalCreditGroup " +
        " from egl.voucher.VoucherBO where id='" +
        voucherId +
        "'";
      let voucherRst = ObjectStore.queryByYonQL(voucherSql, "yonbip-fi-egl");
      if (voucherRst.length == 0) {
        //凭证被删除了--不存在了
        ObjectStore.updateById(
          "AT1703B12408A00002.AT1703B12408A00002.voucherSync",
          { id: id, voucherStatus: "05", locked: true, voucherVisible: false, description: "该凭证已被删除，查不到" },
          "ybf4caba5e"
        );
        continue;
      }
      let voucherDB = voucherRst[0];
      voucherCode = voucherDB.billCode;
      periodUnion = voucherDB.periodUnion;
      let periodId = getPeriodObj(periodObjs, voucherDB.periodUnion).id;
      let vDescription = "";
      let isPubliced = true; //需要传递到U8
      let queryVoucherUrl = DOMAIN + "/yonbip/fi/ficloud/openapi/voucher/queryVouchers";
      let bodyParams = { accbookCode: voucherDB.accBook_code, billcodeMin: voucherDB.billCode, billcodeMax: voucherDB.billCode, periodStart: voucherDB.periodUnion, periodEnd: voucherDB.periodUnion };
      let apiResponse = openLinker("POST", queryVoucherUrl, "GT3734AT5", JSON.stringify(bodyParams));
      let respObj = JSON.parse(apiResponse);
      if (respObj.code != 200 || respObj.data.recordCount == 0) {
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: true, logModule: 99, description: "异常-镜像YS-接口获取凭证信息", reqt: JSON.stringify(bodyParams), resp: apiResponse })
        );
      } else {
        let voucherDBObj = null;
        for (var k = 0; k < respObj.data.recordList.length; k++) {
          voucherDBObj = respObj.data.recordList[k];
          if (voucherDBObj.header.id == voucherId) {
            break;
          }
        }
        if (voucherDBObj == null) {
          return { rst: false, msg: "数据异常-在总账中没找到该凭证:voucherId=" + voucherId };
        }
        if (includes(apiResponse, publicFlag) || includes(apiResponse, "该账户凭证传U8")) {
          isPubliced = true; //传U8--包含该标识
          let vBodyObj = voucherDBObj.body;
          if (vBodyObj.length > 0) {
            let vItemObj = vBodyObj[0];
            vDescription = vDescription == "" && vItemObj.description ? vItemObj.description : vDescription;
          }
        } else {
          //不包含标识则需要检测银行账户决定是否传递
          isPubliced = false;
          let vBodyObj = voucherDBObj.body;
          for (var i in vBodyObj) {
            let vItemObj = vBodyObj[i];
            let iid = vItemObj.id; //分录ID
            vDescription = vDescription == "" && vItemObj.description ? vItemObj.description : vDescription;
            let iclientauxiliaryObj = vItemObj.clientauxiliary; //辅助核算项
            if (iclientauxiliaryObj != null) {
              for (var k in iclientauxiliaryObj) {
                let clientauxiliaryObj = iclientauxiliaryObj[k];
                if (clientauxiliaryObj.code == "0012") {
                  //银行账户-self_define11
                  let bankAccountName = clientauxiliaryObj.data.name; //银行账户名称
                  let bankAccountRst = ObjectStore.queryByYonQL("select * from bd.enterprise.OrgFinBankacctVO where name='" + bankAccountName + "'", "ucfbasedoc");
                  if (bankAccountRst.length > 0) {
                    let bankAccountDesc = bankAccountRst[0].description;
                    if (bankAccountDesc != undefined && bankAccountDesc != null && (includes(bankAccountDesc, "传U8") || includes(bankAccountDesc, publicFlag))) {
                      isPubliced = true; //传U8
                    }
                  } //TODO 查询账户是否对公属性
                  break;
                } else {
                  continue;
                }
              }
            }
          }
        } //判断公私凭证 let isPubliced=true;
      }
      let paramsBody = {
        id: id,
        voucherCode: voucherDB.billCode + "",
        voucherIdx: voucherDB.billCode,
        voucherKind: voucherDB.voucherKind,
        billNo: voucherDB.billNo,
        signer: voucherDB.signer,
        otpSign: voucherDB.otpSign,
        signTime: voucherDB.signTime,
        makeTime: voucherDB.makeTime,
        accBook: voucherDB.accBook,
        auditTime: voucherDB.auditTime,
        periodUnion: periodId,
        creationTime: voucherDB.creationTime,
        displayName: voucherDB.displayName,
        srcSystemName: voucherDB.srcSystemName,
        org: voucherDB.org,
        voucherType: voucherDB.voucherType,
        auditor: voucherDB.auditor,
        maker: voucherDB.maker,
        totalDebitGroup: voucherDB.totalDebitGroup,
        totalDebitOrg: voucherDB.totalDebitOrg,
        totalDebitGlobal: voucherDB.totalDebitGlobal,
        totalCreditGlobal: voucherDB.totalCreditGlobal,
        totalCreditGroup: voucherDB.totalCreditGroup,
        attachedBill: voucherDB.attachedBill,
        voucherStatus: voucherDB.voucherStatus,
        locked: false,
        description: vDescription,
        isPubliced: isPubliced,
        voucherDetails: apiResponse
      };
      ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", paramsBody, "ybf4caba5e");
      successCount++;
    }
    return { rst: true, voucherIds: voucherIdList, successCount: successCount, failCount: voucherIdList.length - successCount };
  }
}
exports({ entryPoint: MyAPIHandler });