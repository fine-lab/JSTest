let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let test_GxyService = request.test_GxyService; //用供销云服务项目ID查询对应的免费服务
    let sql = "select test_GxyService_testGxyServiceList.* from GT3AT33.GT3AT33.test_GxyService where dr = 0 and enable = 1 and id = '" + test_GxyService + "'";
    let servList = ObjectStore.queryByYonQL(sql);
    let servstr = "('" + test_GxyService + "'";
    if (servList[0] !== undefined) {
      for (let i = 0; i < servList.length; i++) {
        if (i == servList.length - 1) {
          servstr = servstr + ",'" + servList[i].test_GxyService_testGxyServiceList_testGxyService + "')";
        } else if (i < servList.length - 1) {
          servstr = servstr + ",'" + servList[i].test_GxyService_testGxyServiceList_testGxyService + "'";
        }
      }
    } else {
      servstr = servstr + ")";
    }
    var selectRoles = "select id from GT3AT33.GT3AT33.test_GxyRole where test_GxyService in " + servstr + " and dr = 0 and enable = 1";
    var roles = ObjectStore.queryByYonQL(selectRoles);
    var roleArr = [];
    if (roles.length !== 0) {
      for (let i = 0; i < roles.length; i++) {
        roleArr.push(roles[i].id);
      }
    }
    return { roleArr };
  }
}
exports({ entryPoint: MyAPIHandler });