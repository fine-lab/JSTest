let AbstractTrigger = require("AbstractTrigger");
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
const getAccbookCode = (orgName, accbookList) => {
  for (var i in accbookList) {
    if (accbookList[i].name == orgName) {
      return accbookList[i].code;
    }
  }
  return "";
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let urlStr = DOMAIN + "/yonbip/digitalModel/merchant/detail";
    let queryVouchersUrl = DOMAIN + "/yonbip/fi/ficloud/openapi/voucher/queryVouchers";
    let getAccBookUrl = DOMAIN + "/yonbip/fi/fipub/basedoc/querybd/accbook";
    let updateDefinesUrl = DOMAIN + "/yonbip/sd/api/updateDefinesInfo"; //更新自定义项数据
    let LogToDB = true;
    let appObj = JSON.parse(AppContext());
    let tid = appObj.currentUser.tenantId;
    let usrName = appObj.currentUser.name;
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let queryDelLogRes = ObjectStore.queryByYonQL(
      "select * from GT3734AT5.GT3734AT5.SysCustDelLog where IsExecuted=0 and (BillType is null or BillType='客户档案') order by DelTime limit 10",
      "developplatform"
    );
    for (var i in queryDelLogRes) {
      let dataObj = queryDelLogRes[i];
      let DelContent = dataObj.DelContent;
      let delContentObj = JSON.parse(DelContent);
      for (var j in delContentObj) {
        let id = delContentObj[j].id;
        let extendCustomer = delContentObj[j].extendCustomer;
        let extendCustomerId = delContentObj[j].extendCustomerId;
        let extendZuZhiLeiBie = delContentObj[j].extendZuZhiLeiBie;
        let gsURI = "GT3734AT5.GT3734AT5.GongSi";
        let gsSuffix = "";
        let billNo = "3199a3d6";
        if (extendZuZhiLeiBie == 1) {
          //建机
          gsSuffix = "_JJ";
          billNo = "b979b0e9";
        } else if (extendZuZhiLeiBie == 2) {
          //环保
          gsSuffix = "_HB";
          billNo = "7b52cdac";
        } else if (extendZuZhiLeiBie == 3) {
          //游乐
          gsSuffix = "_YL";
          billNo = "04a3e644";
        }
        gsURI = gsURI + gsSuffix;
        //客户档案是否有该客户，无则清除关联记录
        let merchantResp = openLinker("GET", urlStr + "?id=" + id, APPCODE, JSON.stringify({ id: id }));
        let merchantRespObj = JSON.parse(merchantResp);
        if (merchantRespObj.code != 200) {
          let queryCustRes = ObjectStore.queryByYonQL("select id from " + gsURI + " where merchant='" + id + "'", "developplatform");
          for (var k in queryCustRes) {
            ObjectStore.updateById(gsURI, { id: queryCustRes[k].id, merchant: "", isRelated: false, relateArchTime: "" }, billNo);
          }
        }
        ObjectStore.updateById("GT3734AT5.GT3734AT5.SysCustDelLog", { id: dataObj.id, IsExecuted: true, ExeTime: getNowDate() }, "409fad62");
      }
    }
    //处理凭证
    queryDelLogRes = ObjectStore.queryByYonQL("select * from GT3734AT5.GT3734AT5.SysCustDelLog where IsExecuted=0 and BillType='凭证' order by DelTime limit 5", "developplatform");
    for (var i in queryDelLogRes) {
      let dataObj = queryDelLogRes[i];
      let DelContent = dataObj.DelContent;
      let delContentList = JSON.parse(DelContent);
      let accbookList = [];
      for (var j in delContentList) {
        let delContentObj = delContentList[j];
        let id = delContentObj.id;
        let billCode = delContentObj.billcode;
        let orderBillId = delContentObj.orderBillId;
        let orderBillCode = delContentObj.orderBillCode;
        let accbook = delContentObj.accbook;
        let feeType = delContentObj.feeType;
        let accbookCode = "";
        let redVoucher = !includes(orderBillCode, "XSDD"); //销售订单以XSDD打头
        //查询凭证是否删除
        for (var k in accbookList) {
          let accbookObj = accbookList[k];
          if (accbookObj.accbook == accbook) {
            accbookCode = accbookObj.accbookCode;
            break;
          }
        }
        if (accbookCode == "") {
          //通过接口获取账簿
          let accbookRes = openLinker("POST", getAccBookUrl, APPCODE, JSON.stringify({ fields: ["id", "code", "name", "accentity"] }));
          let accbookObjs = JSON.parse(accbookRes);
          if (accbookObjs.code != 200) {
            return { rst: false, data: {}, msg: "生成凭证失败,获取账簿出错:" + accbookObjs.message };
          }
          let accbookArry = accbookObjs.data;
          openLinker("POST", logToDBUrl, APPCODE, JSON.stringify({ LogToDB: LogToDB, logModule: 9, description: "caabook", reqt: JSON.stringify(accbookArry), resp: accbook, usrName: usrName }));
          accbookCode = getAccbookCode(accbook, accbookArry);
          accbookList.push({ accbook: accbook, accbookCode: accbookCode });
        }
        let voucherRes = openLinker(
          "POST",
          queryVouchersUrl,
          APPCODE,
          JSON.stringify({ accbookCode: accbookCode, billcodeMin: billCode, billcodeMax: billCode, pager: { pageIndex: 1, pageSize: 20 } })
        );
        openLinker(
          "POST",
          logToDBUrl,
          APPCODE,
          JSON.stringify({
            LogToDB: LogToDB,
            logModule: 9,
            description: "凭证列表",
            reqt: JSON.stringify({ accbookCode: accbookCode, billcodeMin: billCode, billcodeMax: billCode, pager: { pageIndex: 1, pageSize: 20 } }),
            resp: voucherRes,
            usrName: usrName
          })
        );
        let voucherResObjs = JSON.parse(voucherRes);
        if (voucherResObjs.code != 200) {
          return { rst: false, msg: "查询出错" };
        }
        if (voucherResObjs.data.recordCount == 0) {
          //已删除--清理订单关联信息
          if (redVoucher) {
            //红字订单
            let updateRedVBillObj = { id: orderBillId, redVoucherId: "", redVoucherCode: "", feeRedVoucherId: "", feeRedVoucherCode: "" };
            let updateRedVBillRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.RedSaleOrderBill", updateRedVBillObj, "1e5389cb");
          } else {
            //销售订单 //回写凭证号
            let body = { billnum: "voucher_order", datas: [] };
            if (feeType) {
              body.datas = [
                {
                  id: orderBillId,
                  code: orderBillCode,
                  definesInfo: [
                    {
                      define54: "",
                      isHead: true,
                      isFree: true
                    },
                    {
                      define53: "",
                      isHead: true,
                      isFree: true
                    }
                  ]
                }
              ];
            } else {
              body.datas = [
                {
                  id: orderBillId,
                  code: orderBillCode,
                  definesInfo: [
                    {
                      define58: "",
                      isHead: true,
                      isFree: true
                    },
                    {
                      define57: "",
                      isHead: true,
                      isFree: true
                    }
                  ]
                }
              ];
            }
            let apiRes = openLinker("POST", updateDefinesUrl, APPCODE, JSON.stringify(body));
          }
        } else {
          //未删除--不用处理
        }
        ObjectStore.updateById("GT3734AT5.GT3734AT5.SysCustDelLog", { id: dataObj.id, IsExecuted: true, ExeTime: getNowDate() }, "409fad62");
      }
    }
    return { rst: true, msg: "success" };
  }
}
exports({ entryPoint: MyTrigger });