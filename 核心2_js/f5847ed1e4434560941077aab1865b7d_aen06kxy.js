let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var boardName = request.boardName;
    var startDate = request.startDate;
    startDate = startDate.replace(/\//g, "-");
    var sql =
      "select * from GT16804AT364.GT16804AT364.board_room_order  where board_room_name.name= " +
      "'" +
      boardName +
      "'" +
      " and start_time< " +
      "'" +
      startDate +
      "'" +
      " and end_time > " +
      "'" +
      startDate +
      "'";
    var data = ObjectStore.queryByYonQL(sql);
    return { data: data };
  }
}
exports({ entryPoint: MyAPIHandler });