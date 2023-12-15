let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    debugger;
    //主表信息
    var querydate = request.querydate; //日期
    var canteenname = request.canteenname; //食堂名称
    var exportstock = request.exportstock; //导出库id
    var team = request.team_id; //班组id
    var url = "GT21859AT11.GT21859AT11.canteen_query";
    //主表信息插入
    var object = {
      querydate: querydate,
      canteenname: canteenname,
      exportstock: exportstock,
      team: team,
      subTable: [{ key: "yourkeyHere" }]
    };
    var res = ObjectStore.insert(url, object, "97597202");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });