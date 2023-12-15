let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateId = "yourIdHere"; //
    var person_nameid = "youridHere"; //人才姓名
    var cerTypeid = "5"; //证书类型
    var object = { id: updateId, person_name: person_nameid, cerType: cerTypeid };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });