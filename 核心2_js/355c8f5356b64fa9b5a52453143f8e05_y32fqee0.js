let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var masterId = request.dataParam.masterId;
    var sonId = request.dataParam.sonId;
    // 注册证号
    // 生产企业
    var enterprise_name = request.dataParam.enterprise_name;
    // 储运条件
    var transportation_conditions = request.dataParam.transportation_conditions;
    // 注册人/备案人名称
    var nameRegistrant = request.dataParam.nameRegistrant;
    var object = {
      id: masterId,
      _status: "Update",
      IssueDetailsList: [{ id: sonId, ProductionEnterprisName: enterprise_name, storageCondition: transportation_conditions, registrant: nameRegistrant, _status: "Update" }]
    };
    var res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", object, "93ffc3ce");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });