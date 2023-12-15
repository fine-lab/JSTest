let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取token
    let func1 = extrequire("GT80750AT4.backDefaultGroup.getToKen");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    let params = {};
    let body = { pageIndex: 0, pageSize: 200, isSum: true, nextStatusName: "CONFIRMORDER", simpleVOs: [{ field: "status", op: "eq", value1: "0" }] };
    let qryUrl = "https://www.example.com/";
    var orders = postman("POST", qryUrl + token, null, JSON.stringify(body));
    if (JSON.parse(orders) !== null && JSON.parse(orders).data !== null && JSON.parse(orders).data.recordList !== null) {
      let recordList = JSON.parse(orders).data.recordList;
      for (let i = 0; i < recordList.length; i++) {
        if (recordList.length > 0) {
          let id = recordList[i].id;
          let code = recordList[i].code;
          let payStatusCode = recordList[i].payStatusCode;
          let status = recordList[i].status;
          let createTime = recordList[i].createTime;
          let body = { code: code };
          let loginterfaceUrl = "https://www.example.com/";
          var logres = postman("POST", loginterfaceUrl + token, null, JSON.stringify(body));
          if (logres.res === null || logres.res === undefined) {
            params = { code: code, id: id, status1: status, createTime: createTime };
            if (payStatusCode == "NOTPAYMENT" && status == 0) {
              //订单状态
              let url = "https://www.example.com/";
              var strResponse = postman("POST", url + token, "", JSON.stringify(params));
            }
          }
        }
      }
    }
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });