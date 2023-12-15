let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询YS客户退款数据
    function getTime(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
      var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      var todayDate = year + "-" + month + "-" + day + " " + "00:00:00";
      return todayDate;
    }
    let beginTime = param != undefined && param.end != undefined ? param.end : getTime(new Date());
    let endTime = param != undefined && param.begin != undefined ? param.begin : getTime(new Date(new Date().setDate(new Date().getDate() - 1)));
    let body = {
      pageIndex: "1",
      pageSize: "100",
      auditstatus: "1",
      simpleVOs: [
        {
          logicOp: "and",
          conditions: [
            {
              field: "auditTime",
              op: "between",
              value1: endTime,
              value2: beginTime
            }
          ]
        }
      ]
    };
    let func1 = extrequire("AT175542E21C400007.backDefaultGroup.getUrlHead");
    let res = func1.execute(null, null);
    let url = res.urlHead + "/yonbip/EFI/arRefund/list";
    let apiResponse = openLinker("POST", url, "AT175542E21C400007", JSON.stringify(body));
    let paybillRes = JSON.parse(apiResponse);
    let zbyHkBody = new Array();
    let logBodyList = new Array();
    if (paybillRes.code == "200") {
      let recordList = paybillRes.data.recordList;
      if (recordList.length > 0) {
        for (var i = 0; i < recordList.length; i++) {
          let record = recordList[i];
          let detailUrl = res.urlHead + "/yonbip/EFI/arRefund/detail?id=" + record.id;
          let detailResponse = openLinker("GET", detailUrl, "AT175542E21C400007", null);
          let paybilldetailRes = JSON.parse(detailResponse);
          let paybillData = paybilldetailRes.data;
          let bodyItems = paybilldetailRes.data.bodyItem;
          if (bodyItems.length > 0) {
            let logBody = {
              data_code: paybillData.code,
              dateTime: getTime(new Date()),
              result: 0,
              fail_message: ""
            };
            logBodyList.push(logBody);
            for (var k = 0; k < bodyItems.length; k++) {
              let orderno = bodyItems[k].orderNo;
              let body = {
                incomeCode: orderno,
                payBackCode: paybillData.code,
                code: paybillData.code,
                amount: -bodyItems[k].oriTaxIncludedAmount,
                orgCode: bodyItems[k].orgCode,
                orgName: bodyItems[k].orgName,
                createAt: paybillData.createTime,
                payBankCode: "",
                payBankName: "",
                payBankAcc: bodyItems[k].enterpriseCashAccount,
                payBankAccName: bodyItems[k].enterpriseCashAccountName
              };
              zbyHkBody.push(body);
            }
          }
        }
        //生成智保云回款参数
        let funcToken = extrequire("AT175542E21C400007.backDefaultGroup.getTokenZby");
        let resToken = funcToken.execute(null, null);
        resToken = JSON.parse(resToken.apiResponse);
        let zbyUrl = "https://www.example.com/";
        var header = { "Content-Type": "application/json;charset=UTF-8", Authorization: "Bearer " + resToken.access_token };
        let paybacksRes = postman("post", zbyUrl, JSON.stringify(header), JSON.stringify(zbyHkBody));
        let payback = JSON.parse(paybacksRes);
        let funcinsertLog = extrequire("AT175542E21C400007.backDefaultGroup.insertLog");
        if (payback.code == "200") {
          if (logBodyList.length > 0) {
            for (var j = 0; j < logBodyList.length; j++) {
              let logBody = logBodyList[j];
              logBody.result = "1";
              funcinsertLog.execute(null, logBody);
            }
          }
        } else {
          if (logBodyList.length > 0) {
            for (var j = 0; j < logBodyList.length; j++) {
              let logBody = logBodyList[j];
              logBody.result = "0";
              logBody.fail_message = payback.message;
              funcinsertLog.execute(null, logBody);
            }
          }
        }
      }
    } else {
      throw new Error(paybillRes.message);
    }
  }
}
exports({ entryPoint: MyTrigger });