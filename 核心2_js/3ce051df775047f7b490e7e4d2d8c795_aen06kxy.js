let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId; //获取当前的租户
    var userids = obj.currentUser.id; //获取当前的操作人
    //获token
    let func1 = extrequire("IDX_02.myConfig.getTokenApi");
    let resToken = func1.execute();
    var hostUrl = "https://www.example.com/";
    var token = "yourtokenHere";
    token = resToken.access_token;
    if (param !== null) {
      var actioncode = param.action;
      var orderids = "";
      var transtype = "";
      if (param.data !== null && param.data.length > 0) {
        for (var i = param.data.length - 1; i >= 0; i--) {
          orderids = param.data[i].id + "|" + param.data[i].busType + ",";
        }
        orderids = orderids.substring(0, orderids.length - 1);
      }
      var mydata = {
        orderArr: orderids,
        updateor: userids,
        tenantId: tid,
        actioncode: actioncode,
        auditstatus: 1
      };
      var header = {
        "Content-Type": "application/json;charset=utf-8",
        access_token: token
      };
      var strResponse = postman("post", hostUrl + "/guize/Saveordernotice", JSON.stringify(header), JSON.stringify(mydata));
      return {};
    } else {
      return { res: "参数错误！" };
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });