let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let return_info = [];
    let Info = [];
    let id = request.id;
    let invoiceOrg = request.invoiceOrg;
    const sql1 = "select * from GT22176AT10.GT22176AT10.SY01_xsckfmx_v6  where dr = 0 and sourcechild_id  = '" + id + "'";
    let list = ObjectStore.queryByYonQL(sql1);
    //从医药物料档案查询存储条件
    if (list.length > 0) {
      let material = list[0].material;
      const sql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = '" + invoiceOrg + "' and material = '" + material + "'";
      let productInfors = ObjectStore.queryByYonQL(sql);
      if (productInfors.length > 0) {
        for (let i = 0; i < list.length; i++) {
          list[i].storageCondition = productInfors[0].storageCondition;
          list[i].storageConditionName = productInfors[0].storageConditionName;
        }
      }
    }
    return { res: JSON.stringify(list) };
  }
}
exports({ entryPoint: MyAPIHandler });