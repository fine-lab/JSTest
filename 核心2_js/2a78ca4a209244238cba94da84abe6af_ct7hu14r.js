let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId; //获取当前的租户
    var userids = obj.currentUser.id; //获取当前的操作人
    var token = obj.token;
    let func1 = extrequire("PU.commonFunction.baseConfig");
    let myConfig = func1.execute();
    // 检测需要访问的URL地址
    let hostUrl = "https://www.example.com/";
    if (tid == "hr2u8ml4" || tid == "jrp7vlmx") {
      hostUrl = myConfig.config.apiUrl;
    }
    if (param !== null) {
      var actioncode = param.action;
      var orderids = "";
      var transtype = "";
      if (param.data !== null && param.data.length > 0) {
        for (var i = param.data.length - 1; i >= 0; i--) {
          var busType = param.data[i].hasOwnProperty("busType") === false ? "" : param.data[i].busType;
          var busTypeName = param.data[i].hasOwnProperty("busType_name") === false ? "" : param.data[i].busType_name;
          var code = param.data[i].hasOwnProperty("code") === false ? "" : param.data[i].code;
          orderids = param.data[i].id + "|" + busType + "|" + busTypeName + "|" + code + ",";
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
        yht_access_token: token
      };
      var strResponse = postman("post", hostUrl + "/guize/Saveordernotice?tenant_id=" + tid, JSON.stringify(header), JSON.stringify(mydata));
      var objJSON = JSON.parse(strResponse);
      if (objJSON.status != 1) {
        throw new Error("操作失败!" + hostUrl + "/guize/Saveordernotice?tenant_id=" + tid + JSON.stringify(header) + JSON.stringify(mydata));
      } else {
        return "审核成功";
      }
    } else {
      return {
        res: "参数错误！"
      };
    }
  }
}
exports({
  entryPoint: MyTrigger
});