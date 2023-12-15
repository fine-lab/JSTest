let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var valArr = new Array();
    for (let i = 0; i < 100; i++) {
      valArr.push("('value_" + i + "')");
    }
    let sql = "INSERT INTO GT66570AT296.GT66570AT296.canshu  VALUES ('vv1')"; //+valArr.join(',');
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });