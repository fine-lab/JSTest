let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let manageClassCode = null;
    let manageClassParent = null;
    // 拿取物料编码
    let itemCodes = param.itemCodes || [];
    let inSqlCondition = "('" + itemCodes.join("','") + "')";
    let productQuerySql = "select code,model,manageClass,manageClass.code as manageClassCode,manageClass.parent as manageClassParent from pc.product.Product where model in " + inSqlCondition + "";
    var productRes = ObjectStore.queryByYonQL(productQuerySql, "productcenter");
    // 将结果数据进行code映射，构建map
    let productMap = {};
    productRes.map((item) => {
      // 物料分类查找最上级
      let manageClassCode = item.manageClassCode;
      let manageClassParent = item.manageClassParent;
      if (manageClassParent != 0) {
        while (manageClassParent != 0) {
          var manageClassRes = ObjectStore.queryByYonQL("select code,parent as parentId from pc.cls.ManagementClass where id = " + manageClassParent, "productcenter");
          if (manageClassRes != null && manageClassRes.length > 0) {
            manageClassParent = manageClassRes[0].parentId;
            manageClassCode = manageClassRes[0].code;
          } else {
            manageClassParent = 0;
          }
        }
      }
      let manageClassDesc = null;
      if (manageClassCode == "40" || manageClassCode == "10") {
        manageClassDesc = "风冷";
      } else if (manageClassCode == "41") {
        manageClassDesc = "液冷";
      }
      item.manageClassCode = manageClassCode;
      item.manageClassDesc = manageClassDesc;
      productMap[item.model] = item;
    });
    // 返回物料分类和物料编码
    return productMap;
  }
}
exports({ entryPoint: MyTrigger });