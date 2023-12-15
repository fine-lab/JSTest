let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var boardName = request.boardName;
    var startDate = request.startDate;
    startDate = startDate.replace(/\//g, "-");
    var endDate = request.endDate;
    endDate = endDate.replace(/\//g, "-");
    var endSql =
      "select * from GT16804AT364.GT16804AT364.board_room_order  where board_room_name.name= " +
      "'" +
      boardName +
      "'" +
      " and start_time< " +
      "'" +
      endDate +
      "'" +
      " and end_time > " +
      "'" +
      endDate +
      "'";
    var quJianSql =
      "select * from GT16804AT364.GT16804AT364.board_room_order  where board_room_name.name= " +
      "'" +
      boardName +
      "'" +
      " and start_time >= " +
      "'" +
      startDate +
      "'" +
      " and end_time <= " +
      "'" +
      endDate +
      "'";
    var endData = ObjectStore.queryByYonQL(endSql);
    var QuJianData = ObjectStore.queryByYonQL(quJianSql);
    return { endData: endData, QuJianData: QuJianData };
  }
}
exports({ entryPoint: MyAPIHandler });