let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var uid = obj.currentUser.id;
    let hostUrl = "https://www.example.com/";
    if (tid == "ykrrxl7u") {
      hostUrl = "https://www.example.com/";
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
        "Content-Type": "application/json;charset=utf-8"
      };
      var strResponse = postman("post", hostUrl + "/orderstore/saveorderstoreout?tenant_id=" + tid + "&orderId=" + orderId, JSON.stringify(header), JSON.stringify(mydata));
      var objJSON = JSON.parse(strResponse);
    } catch (e) {}
    return {};
  }
}
exports({ entryPoint: MyTrigger });