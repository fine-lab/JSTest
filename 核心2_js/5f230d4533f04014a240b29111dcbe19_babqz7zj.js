let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var userids = obj.currentUser.id; //获取当前的操作人
    let configFun = extrequire("IDX_02.myConfig.baseConfig");
    let myConfig = configFun.execute();
    var hostUrl = myConfig.config.apiUrl;
    //获token
    let func1 = extrequire("IDX_02.myConfig.cusToken");
    let resToken = func1.execute();
    var myToken = JSON.parse(resToken.strResponse);
    var token = myToken.access_token;
    if (param !== null) {
      var actioncode = param.action;
      var orderArr = "";
      var transtype = "";
      if (param.data !== null && param.data.length > 0) {
        for (var i = param.data.length - 1; i >= 0; i--) {
          orderArr += param.data[i].id + "|" + param.data[i].busType + ",";
        }
        orderArr = orderArr.substring(0, orderArr.length - 1);
      }
      var mydata = {
        orderArr: orderArr,
        updateor: userids,
        tenantId: tid,
        actioncode: actioncode,
        auditstatus: 2
      };
      var header = {
        "Content-Type": "application/json;charset=utf-8"
      };
      var strResponse = postman("post", hostUrl + "/guize/Saveordernotice?access_token=" + token + "&tenant_id=" + tid, JSON.stringify(header), JSON.stringify(mydata));
      return {};
    } else {
      return {
        res: "参数错误！"
      };
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});