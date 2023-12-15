let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var businessType = request.businessTypeValue; //业务类型
    var qsOrgValue = request.qsOrgValue; //资质寻源组织id
    var sql = "select * from GT59181AT30.GT59181AT30.XPH_QSRelationship where qualificationSourcingOrganization='" + qsOrgValue + "' and businessType='" + businessType + "'and enable ='1'";
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });