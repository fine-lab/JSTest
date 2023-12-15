let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //项目主键
    var projectId = request.projectId;
    //单据id
    var idnumber = request.idnumber;
    var sql = "select id from GT4425AT14.GT4425AT14.prjMaterRelevance where dr=0 and project='" + projectId + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (idnumber === undefined && res.length > 0) {
      throw new Error("保存失败，所选项目已存在关系表！");
    } else if (idnumber !== undefined && idnumber != res[0].id) {
      throw new Error("保存失败，所选项目已存在关系表！");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });