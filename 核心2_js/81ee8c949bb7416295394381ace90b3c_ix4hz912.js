let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //循环请求参数取出套餐id
    let kitIds = "";
    request.data.forEach((kit) => {
      let kitId;
      if (kit.id != undefined) {
        kitId = "'" + kit.id + "',";
      } else {
        kitId = "'" + kit.examination_kit + "',";
      }
      kitIds += kitId;
    });
    kitIds = "(" + substring(kitIds, 0, kitIds.length - 1) + ")";
    let sql =
      "select id as project,name as project_name,price,price as useprice,des,original_price,examination_kit_id as examination_kit, examination_kit_id.name as examination_kit_name, " +
      " product as product_standard,product.name as product_standard_name" +
      " from AT17E6E98209580009.AT17E6E98209580009.project where examination_kit_id in " +
      kitIds +
      "order by examination_kit_id";
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });