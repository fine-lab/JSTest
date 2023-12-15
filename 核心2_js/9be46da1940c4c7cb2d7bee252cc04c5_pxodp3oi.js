let AbstractTrigger = require("AbstractTrigger");
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
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let publicFlag = "【记】";
    let LogToDB = true;
    let TEST = true; //非测试时限制已审核单据
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    //科目表查询
    let baseDataType = "会计期间-copy voucher";
    let commUrl = DOMAIN + "/yonbip/fi/fipub/basedoc/querybd/accperiod";
    let commResp = openLinker("POST", commUrl, "AT1703B12408A00002", null);
    let periodMap = new Map();
    let commRespObj = JSON.parse(commResp);
    let periodObjs = commRespObj.data;
    for (var j in periodObjs) {
      let periodObj = periodObjs[j];
      periodMap.set(periodObj.code, periodObj);
    }
    let queryConditions = " where voucherStatus in('03','04','05') ";
    let voucherSyncRst = ObjectStore.queryByYonQL(
      "select voucherPubts,voucherId,pageNum,conditionTime from AT1703B12408A00002.AT1703B12408A00002.voucherSync order by voucherPubts desc,idx desc limit 1",
      "developplatform"
    );
    let pageNum = 1;
    let pageSize = 20;
    let lastVoucherPubts = "2023-01-01 00:00:00";
    let lastVoucherId = "";
    if (voucherSyncRst.length > 0) {
      pageNum = voucherSyncRst[0].pageNum;
      lastVoucherPubts = voucherSyncRst[0].voucherPubts;
      lastVoucherId = voucherSyncRst[0].voucherId;
      if (!pageNum) {
        pageNum = 1;
      }
    } else {
    }
    queryConditions = queryConditions + " and ts>='" + lastVoucherPubts + "' ";
    let vouchercountRst = ObjectStore.queryByYonQL("select count(1) as count from egl.voucher.VoucherBO " + queryConditions, "yonbip-fi-egl");
    let voucherCount = vouchercountRst[0].count;
    if (voucherCount / pageSize + 1 == pageNum && voucherCount % pageSize == 0) {
      pageNum = voucherCount / pageSize;
    }
    let voucherSql =
      "select id,org,billCode,ts,voucherKind,modifier,totalCreditGlobal,billNo,signer,otpSign,totalDebitGroup,signTime," +
      "totalDebitOrg,makeTime,accBook,accBook.code,auditTime,periodUnion,srcSystem,flag,creationTime,displayName,tallyTime,qtyAdjust," +
      "description,srcSystemName,totalCreditOrg,groupypd,creator,voucherType,auditor,auditTime,maker,totalDebitGlobal,tallyMan,voucherStatus,attachedBill,totalCreditGroup " +
      " from egl.voucher.VoucherBO " +
      queryConditions +
      " order by ts asc,id asc limit " +
      pageNum +
      "," +
      pageSize;
    let voucherRst = ObjectStore.queryByYonQL(voucherSql, "yonbip-fi-egl");
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
      null,
      JSON.stringify({
        LogToDB: true,
        logModule: 99,
        description: "DB查询凭证-copy voucher:SumCount=" + voucherCount + ";voucherRst.length=" + voucherRst.length,
        reqt: voucherSql,
        resp: JSON.stringify(voucherRst)
      })
    );
    let sameTsflag = false;
    if (voucherRst.length > 0) {
      let newTs = voucherRst[voucherRst.length - 1].ts;
      if (newTs == lastVoucherPubts) {
        sameTsflag = true;
        if (voucherRst.length == pageSize && voucherCount > pageNum * pageSize) {
          pageNum = pageNum + 1;
        } else {
        }
      } else {
        pageNum = 1;
        sameTsflag = false;
      }
    }
    for (var i in voucherRst) {
      let voucherObj = voucherRst[i];
      if (lastVoucherId == voucherObj.id) {
      }
      if (voucherObj.periodUnion <= "2023-02") {
      }
      let vSyncCRst = ObjectStore.queryByYonQL("select id,syncRst,auditTime,locked from AT1703B12408A00002.AT1703B12408A00002.voucherSync where voucherId='" + voucherObj.id + "'", "developplatform");
      if (vSyncCRst.length > 0) {
        //修改
        let vSyncCRstObj = vSyncCRst[0];
        if (vSyncCRstObj.syncRst != undefined && vSyncCRstObj.syncRst == 1) {
          //已同步就不要修改了
          if (sameTsflag) {
            ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", { id: vSyncCRst[0].id, pageNum: pageNum }, "ybf4caba5e");
          }
          continue;
        }
      }
      let periodId = getPeriodObj(periodObjs, voucherObj.periodUnion).id; //periodMap.get(voucherObj.periodUnion).id;
      let isPubliced = true; //需要传递到U8
      let voucherDetails = ""; //凭证详情
      let queryVoucherUrl = DOMAIN + "/yonbip/fi/ficloud/openapi/voucher/queryVouchers";
      let bodyParams = {
        accbookCode: voucherObj.accBook_code,
        billcodeMin: voucherObj.billCode,
        billcodeMax: voucherObj.billCode,
        periodStart: voucherObj.periodUnion,
        periodEnd: voucherObj.periodUnion
      };
      let apiResponse = openLinker("POST", queryVoucherUrl, "GT3734AT5", JSON.stringify(bodyParams));
      let vDescription = "";
      let respObj = JSON.parse(apiResponse);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
        null,
        JSON.stringify({ LogToDB: LogToDB, logModule: 99, description: "镜像YS-接口获取凭证信息", reqt: JSON.stringify(bodyParams), resp: apiResponse })
      );
      if (respObj.code != 200 || respObj.data.recordCount == 0) {
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
          null,
          JSON.stringify({ LogToDB: true, logModule: 99, description: "异常-镜像YS-接口获取凭证信息", reqt: JSON.stringify(bodyParams), resp: apiResponse })
        );
      } else {
        voucherDetails = apiResponse; //publicFlag
        if (includes(voucherDetails, publicFlag) || includes(voucherDetails, "该账户凭证传U8")) {
          isPubliced = true; //传U8--包含该标识
          let voucherDBObj = respObj.data.recordList[0];
          let vBodyObj = voucherDBObj.body;
          if (vBodyObj.length > 0) {
            let vItemObj = vBodyObj[0];
            vDescription = vDescription == "" && vItemObj.description ? vItemObj.description : vDescription;
          }
        } else {
          //不包含标识则需要检测银行账户决定是否传递
          let voucherDBObj = respObj.data.recordList[0];
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
                  extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
                    null,
                    JSON.stringify({ LogToDB: true, logModule: 99, description: "获取银行账号信息", reqt: bankAccountName, resp: JSON.stringify(bankAccountRst) })
                  );
                  if (bankAccountRst.length > 0) {
                    let bankAccountDesc = bankAccountRst[0].description;
                    if (bankAccountDesc == undefined || bankAccountDesc == null || (!includes(bankAccountDesc, "传U8") && !includes(bankAccountDesc, publicFlag))) {
                      isPubliced = false; //不用传U8
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
      if (vSyncCRst.length > 0) {
        //修改
        let paramsBody = {
          id: vSyncCRst[0].id,
          voucherId: voucherObj.id,
          voucherCode: voucherObj.billCode + "",
          voucherKind: voucherObj.voucherKind,
          billNo: voucherObj.billNo,
          signer: voucherObj.signer,
          otpSign: voucherObj.otpSign,
          signTime: voucherObj.signTime,
          makeTime: voucherObj.makeTime,
          accBook: voucherObj.accBook,
          auditTime: voucherObj.auditTime,
          periodUnion: periodId,
          creationTime: voucherObj.creationTime,
          displayName: voucherObj.displayName,
          description: vDescription,
          srcSystemName: voucherObj.srcSystemName,
          org: voucherObj.org,
          voucherType: voucherObj.voucherType,
          auditor: voucherObj.auditor,
          maker: voucherObj.maker,
          totalDebitGroup: voucherObj.totalDebitGroup,
          totalDebitOrg: voucherObj.totalDebitOrg,
          totalDebitGlobal: voucherObj.totalDebitGlobal,
          totalCreditGlobal: voucherObj.totalCreditGlobal,
          totalCreditGroup: voucherObj.totalCreditGroup,
          attachedBill: voucherObj.attachedBill,
          voucherPubts: voucherObj.ts,
          voucherStatus: voucherObj.voucherStatus,
          pageNum: pageNum,
          conditionTime: lastVoucherPubts,
          voucherCount: i + "/本次" + voucherRst.length + "/总" + voucherCount,
          idx: new Date().getTime() + "",
          locked: false,
          isPubliced: isPubliced,
          voucherDetails: voucherDetails
        };
        if (vSyncCRst[0].locked == 1 && voucherObj.auditTime != vSyncCRst[0].auditTime) {
          //只有锁定且审核时间不同的凭证才可以修改--其他就不用改了
          ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", paramsBody, "ybf4caba5e");
        } else {
          if (sameTsflag) {
            ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", { id: vSyncCRst[0].id, pageNum: pageNum }, "ybf4caba5e");
          }
        }
      } else {
        //新增
        let paramsBody = {
          voucherId: voucherObj.id,
          voucherCode: voucherObj.billCode + "",
          voucherKind: voucherObj.voucherKind,
          billNo: voucherObj.billNo,
          signer: voucherObj.signer,
          otpSign: voucherObj.otpSign,
          signTime: voucherObj.signTime,
          makeTime: voucherObj.makeTime,
          accBook: voucherObj.accBook,
          auditTime: voucherObj.auditTime,
          periodUnion: periodId,
          creationTime: voucherObj.creationTime,
          displayName: voucherObj.displayName,
          description: vDescription,
          srcSystemName: voucherObj.srcSystemName,
          org: voucherObj.org,
          voucherType: voucherObj.voucherType,
          auditor: voucherObj.auditor,
          maker: voucherObj.maker,
          totalDebitGroup: voucherObj.totalDebitGroup,
          totalDebitOrg: voucherObj.totalDebitOrg,
          totalDebitGlobal: voucherObj.totalDebitGlobal,
          totalCreditGlobal: voucherObj.totalCreditGlobal,
          totalCreditGroup: voucherObj.totalCreditGroup,
          attachedBill: voucherObj.attachedBill,
          voucherPubts: voucherObj.ts,
          voucherStatus: voucherObj.voucherStatus,
          pageNum: pageNum,
          conditionTime: lastVoucherPubts,
          voucherCount: i + "/本次" + voucherRst.length + "/总" + voucherCount,
          idx: new Date().getTime() + "",
          syncRst: false,
          locked: false,
          voucherVisible: voucherObj.periodUnion > "2023-02",
          isPubliced: isPubliced,
          voucherDetails: voucherDetails
        };
        ObjectStore.insert("AT1703B12408A00002.AT1703B12408A00002.voucherSync", paramsBody, "ybf4caba5e");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });