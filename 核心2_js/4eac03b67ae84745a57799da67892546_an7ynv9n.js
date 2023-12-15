let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取token
    let func1 = extrequire("GT80750AT4.backDefaultGroup.getToKen");
    var paramToken = {};
    let resToken = func1.execute(paramToken);
    var token = resToken.access_token;
    //查询日志信息
    let logurl = "https://www.example.com/";
    let logRes = postman("post", logurl + token, null, JSON.stringify({ id: "" }));
    let logs = JSON.parse(logRes).data.res;
    let params = [];
    let ids = [];
    for (let i = 0; i < logs.length; i++) {
      let body = { pageIndex: 0, pageSize: 50, isSum: false, simpleVOs: [{ field: "code", op: "eq", value1: logs[i].SalesOrderNo }] };
      let qryUrl = "https://www.example.com/";
      var orders = postman("POST", qryUrl + token, null, JSON.stringify(body));
      if (JSON.parse(orders) !== null && JSON.parse(orders).data !== null && JSON.parse(orders).data.recordList !== null) {
        let recordList = JSON.parse(orders).data.recordList;
        if (recordList.length > 0) {
          let id = recordList[0].id;
          let state = recordList[0].nextStatus;
          let status = recordList[0].status;
          let createTime = recordList[0].createTime;
          if (state == "CONFIRMORDER") {
            //付款状态为未付款
            if ((status = 0)) {
              //单据状态, 0:开立、3:审核中、1:已审核、2:已关闭、
              params.push({ code: logs[i].SalesOrderNo, id: id, status: 0 });
            }
          }
        }
      }
      ids.push({ id: logs[i].id });
    }
    if (params.length > 0) {
      //销售订单驳回接口调用
      let opposeUrl = "https://www.example.com/";
      let data = { data: params };
      var oppores = postman("POST", opposeUrl + token, null, JSON.stringify(data));
    }
    if (ids.length > 0) {
      let ModifylogUrl = "https://www.example.com/";
      let items = { items: ids };
      var Modifylog = postman("POST", ModifylogUrl + token, null, JSON.stringify(items));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });