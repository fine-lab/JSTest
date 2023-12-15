let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let resMap = {};
    //根据物料的model查询物料的主键
    let allErpOuterCode = request.allErpOuterCode;
    let inSqlCondition = "('" + allErpOuterCode.join("','") + "')";
    let querySql = "select id,model  from pc.product.Product  where model in " + inSqlCondition + "";
    var res = ObjectStore.queryByYonQL(querySql, "productcenter");
    if (res && res.length > 0) {
      let codeToMap = {};
      for (let i = 0; i < res.length; i++) {
        let temp = res[i].model;
        codeToMap[temp] = res[i].id;
      }
      resMap.productMap = codeToMap;
    } else if (allErpOuterCode.length !== 0) {
      throw new Error(`编码[${[...new Set(allErpOuterCode)].join(",")}]算力物料不存在`);
    }
    //根据供应商姓名查询供应商的主键  aa.vendor.Vendor  yssupplier
    let allVendorName = request.allVendorName;
    inSqlCondition = "('" + allVendorName.join("','") + "')";
    querySql = "select id,name  from aa.vendor.Vendor  where name in " + inSqlCondition + "";
    let vendorRes = ObjectStore.queryByYonQL(querySql, "yssupplier");
    if (vendorRes && vendorRes.length > 0) {
      let nameToIdMap = {};
      for (let i = 0; i < vendorRes.length; i++) {
        let temp = vendorRes[i].name;
        nameToIdMap[temp] = vendorRes[i].id;
      }
      resMap.vendorMap = nameToIdMap;
    } else if (allVendorName.length != 0) {
      throw new Error(`供应商[${[...new Set(allVendorName)].join(",")}]不存在`);
    }
    //根据单据类型名称查询单据类型主键bd.bill.TransType  bd_transtype
    let allBusTypeNames = request.allBusTypeNames;
    inSqlCondition = "('" + allBusTypeNames.join("','") + "')";
    querySql = "select * from bd.bill.TransType where name in " + inSqlCondition;
    let transTypeRes = ObjectStore.queryByYonQL(querySql, "transtype");
    if (transTypeRes && transTypeRes.length > 0) {
      let typeNameToId = {};
      for (let i = 0; i < transTypeRes.length; i++) {
        let temp = transTypeRes[i].name;
        typeNameToId[temp] = transTypeRes[i].id;
      }
      resMap.typeNameToId = typeNameToId;
    }
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids); //获取当前用户的组织和部门信息
    var resultJSON = JSON.parse(result);
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      resMap.userData = resultJSON.data[currentUser.id];
    } else {
      throw new Error("获取员工信息异常");
    }
    return resMap;
  }
}
exports({ entryPoint: MyAPIHandler });