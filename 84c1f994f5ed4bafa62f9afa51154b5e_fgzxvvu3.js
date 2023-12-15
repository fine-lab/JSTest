let queryUtils = extrequire("PU.frontDefaultGroup.CommonUtilsQuery");
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 数据库清空
    var sqlDel = "SELECT * from 	AT176A3EE417500003.AT176A3EE417500003.Bankjournal "; // 数据库清空
    var resDel = ObjectStore.queryByYonQL(sqlDel, "developplatform");
    for (var i = 0; i < resDel.length; i++) {
      let id = resDel[i].id;
      let pubts = resDel[i].pubts;
      let object = { id: id, pubts: pubts };
      var resDel2 = ObjectStore.deleteById("AT176A3EE417500003.AT176A3EE417500003.Bankjournal", object);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });