let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var agentIds = request.agentIds;
    if (!agentIds || agentIds.length === 0) {
      return {};
    }
    // 查询代理商客户品种档案表头关系
    let yql2 = `select id ,operatorId,operatorId.code,
    operatorId.name,cmmssn_merchant.id,cmmssn_merchant.code,cmmssn_merchant.name 
     from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where cmmssn_merchant in ('${agentIds.join("', '")}')`;
    let agentCustomerMaterialList = ObjectStore.queryByYonQL(yql2);
    if (agentCustomerMaterialList.length > 0) {
      let agentCustomerMaterialIDList = agentCustomerMaterialList.map(function (v) {
        return v.operatorId;
      });
      return { agentCustomerMaterialIDList };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });