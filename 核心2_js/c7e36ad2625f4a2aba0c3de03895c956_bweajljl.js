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
    let func1 = extrequire("GT15699AT1.backDefaultGroup.getUrlHead");
    let res = func1.execute(null, null);
    let url = res.urlHead + "/yonbip/fi/paybill/list/v2";
    let apiResponse = openLinker("POST", url, "GT15699AT1", JSON.stringify(body));
    let paybillRes = JSON.parse(apiResponse);
    let zbyHkBody = new Array();
    let logBodyList = new Array();
    if (paybillRes.code == "200") {
      let recordList = paybillRes.data.recordList;
      if (recordList.length > 0) {
        for (var i = 0; i < recordList.length; i++) {
          let record = recordList[i];
          let detailUrl = res.urlHead + "/yonbip/fi/paybill/detail?id=" + record.id;
          let detailResponse = openLinker("GET", detailUrl, "GT15699AT1", null);
          let paybilldetailRes = JSON.parse(detailResponse);
          let paybillData = paybilldetailRes.data;
          let payBillb = paybillData.PayBillb;
          if (payBillb.length > 0) {
            for (var j = 0; j < payBillb.length; j++) {
              let bill = payBillb[j];
              let orderno = bill.orderno;
              let incomeCodeList = split(orderno, "_", 0);
              incomeCodeList = JSON.parse(incomeCodeList);
              let body = {
                incomeCode: incomeCodeList[0],
                payBackCode: paybillData.code,
                code: paybillData.code + "_" + j,
                amount: -bill.oriSum,
                orgCode: paybillData.accentity_code,
                orgName: paybillData.accentity_name,
                createAt: paybillData.auditTime,
                payBankCode: "",
                payBankName: "",
                payBankAcc: paybillData.enterprisebankaccount_code,
                payBankAccName: paybillData.enterprisebankaccount_name
              };
              let logBody = {
                data_code: paybillData.code,
                dateTime: getTime(new Date()),
                result: 0,
                fail_message: ""
              };
              logBodyList.push(logBody);
              zbyHkBody.push(body);
            }
          }
        }
        //生成智保云回款参数
        let funcToken = extrequire("GT15699AT1.backDefaultGroup.getTokenZby");
        let resToken = funcToken.execute(null, null);
        resToken = JSON.parse(resToken.apiResponse);
        let zbyUrl = "https://www.example.com/";
        var header = { "Content-Type": "application/json;charset=UTF-8", Authorization: "Bearer " + resToken.access_token };
        let paybacksRes = postman("post", zbyUrl, JSON.stringify(header), JSON.stringify(zbyHkBody));
        let payback = JSON.parse(paybacksRes);
        let funcinsertLog = extrequire("GT15699AT1.backDefaultGroup.insertLog");
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