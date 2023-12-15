let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var uid = obj.currentUser.id;
    var token = obj.token;
    let func1 = extrequire("PU.commonFunction.baseConfig");
    let myConfig = func1.execute();
    // 检测需要访问的URL地址
    let hostUrl = "https://www.example.com/";
    if (tid == "hr2u8ml4" || tid == "jrp7vlmx") {
      hostUrl = myConfig.config.apiUrl;
    }
    try {
      var orderId = "";
      var myList = [];
      if (param.data != null && param.data.length > 0) {
        for (var i = 0; i < param.data.length; i++) {
          var objItem = param.data[i];
          myList.push({ id: objItem.id, code: objItem.code });
        }
      }
      if (myList.length == 1) {
        orderId = myList[0]["id"];
      }
      var mydata = {
        billnum: param.billnum,
        dataList: JSON.stringify(myList),
        actioncode: param.action,
        userid: uid,
        userInfo: obj
      };
      var header = {
        "Content-Type": "application/json;charset=utf-8",
        yht_access_token: token
      };
      var strResponse = postman("post", hostUrl + "/orderstore/saveorderstoreout?tenant_id=" + tid + "&orderId=" + orderId, JSON.stringify(header), JSON.stringify(mydata));
      var objJSON = JSON.parse(strResponse);
      var objJSON = JSON.parse(strResponse);
      if (objJSON.status != 1) {
        throw new Error("操作失败!" + objJSON.message);
      } else {
        return {};
      }
    } catch (e) {}
    return {};
  }
}
exports({ entryPoint: MyTrigger });