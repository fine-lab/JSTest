let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取主表的id
    var masterId = request.paramsData.masterId;
    // 获取子表的Id
    var sonId = request.paramsData.sonId;
    var UpdateObject = { id: masterId, IssueDetailsList: [{ id: sonId, ConfirmStatus: "1", _status: "Update" }] };
    var result = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", UpdateObject, "93ffc3ce");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });