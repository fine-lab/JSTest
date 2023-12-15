let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询科目对照表
    var sydType = request.SampleUnitType; //收样单类型
    var orgId = request.organizationId; //组织id
    var subjectSql = "select * from AT15F164F008080007.AT15F164F008080007.insItems where sydType = '" + sydType + "'and org_id = '" + orgId + "'";
    var subjectRes = ObjectStore.queryByYonQL(subjectSql, "developplatform");
    return { subjectRes };
  }
}
exports({ entryPoint: MyAPIHandler });