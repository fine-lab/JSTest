let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 主表id
    var id = request.masterId;
    // 根据出库单主表Id查询子表数据
    var sonSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDetails where IssueDocInfo_id = '" + id + "'";
    var sonResult = ObjectStore.queryByYonQL(sonSql, "developplatform");
    for (var x = 0; x < sonResult.length; x++) {
      var sonDetail = sonResult[x];
      var sonId = sonDetail.id;
      var UpdateObject = { id: id, ReviewStatus: "2", enable: "1", IssueDetailsList: [{ id: sonId, ConfirmStatus: "1", _status: "Update" }] };
      var result = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", UpdateObject, "93ffc3ce");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });