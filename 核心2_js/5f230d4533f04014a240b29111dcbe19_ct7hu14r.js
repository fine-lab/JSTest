let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var userids = obj.currentUser.id; //获取当前的操作人
    // 检测需要访问的URL地址
    let hostUrl = "https://www.example.com/";
    if (tid == "ykrrxl7u") {
      hostUrl = "https://www.example.com/";
    }
    if (param !== null) {
      var actioncode = param.action;
      var orderArr = "";
      var transtype = "";
      if (param.data !== null && param.data.length > 0) {
        for (var i = param.data.length - 1; i >= 0; i--) {
          var org = param.data[i].hasOwnProperty("org") === false ? "" : param.data[i].org; //获取当前租户备用
          var busType = param.data[i].hasOwnProperty("busType") === false ? "" : param.data[i].busType;
          var busTypeName = param.data[i].hasOwnProperty("busType_name") === false ? "" : param.data[i].busType_name;
          var code = param.data[i].hasOwnProperty("code") === false ? "" : param.data[i].code;
          orderArr = param.data[i].id + "|" + busType + "|" + busTypeName + "|" + code + ",";
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
      var strResponse = postman("post", hostUrl + "/guize/Saveordernotice?tenant_id=" + tid, JSON.stringify(header), JSON.stringify(mydata));
      var objJSON = JSON.parse(strResponse);
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