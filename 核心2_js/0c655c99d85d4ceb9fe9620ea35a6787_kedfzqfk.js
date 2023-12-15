let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var querySql = "select code,name from bd.CustomerEnumVO.CustomerEnumVO where dr=0 and enable=1 and custenumdefid='youridHere'";
    var userdefinesRes = ObjectStore.queryByYonQL(querySql, "ucfbasedoc");
    var apiArray = new Array();
    for (var i = 0; i < userdefinesRes.length; i++) {
      var bodydata = {};
      if (userdefinesRes[i].code == "申通") {
        //申通
        bodydata.code = "STO";
        bodydata.name = userdefinesRes[i].name;
      } else {
        bodydata.code = userdefinesRes[i].code;
        bodydata.name = userdefinesRes[i].name;
      }
      apiArray.push(bodydata);
    }
    return { apiArray };
  }
}
exports({ entryPoint: MyAPIHandler });