let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取主表的id
    var masterId = request.params.masterData.id;
    // 获取子表id集合
    var sondata = request.params.sonArray;
    // 获取主表的取消人
    var CancelledBy = request.params.CancelledBy;
    // 获取主表的取消时间
    var CancelledDate = request.params.CancelledDate;
    // 遍历选中子表集合
    for (var i = 0; i < sondata.length; i++) {
      // 子表Id
      var sonId = sondata[i];
      var UpdateObject = {
        id: masterId,
        ReviewStatus: "0",
        CancelledBy: CancelledBy,
        CancelledDate: CancelledDate,
        enable: "0",
        IssueDetailsList: [{ id: sonId, ConfirmStatus: "0", _status: "Update" }]
      };
      var result = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", UpdateObject, "93ffc3ce");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });