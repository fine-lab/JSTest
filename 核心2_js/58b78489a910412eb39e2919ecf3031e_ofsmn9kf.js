let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let filterSchemeId = request.filterSchemeId; //养护过滤方案id
    let orgId = request.orgId; //组织id
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let materialFileFilterUrl = apiPreAndAppCode.apiRestPre + "/filtersScheme/materialFileFilter";
    let filterParam = { filterSchemeId: filterSchemeId, orgId: orgId };
    //通过后端脚手架筛选过滤后的医药物料
    let result = postman("POST", materialFileFilterUrl, null, JSON.stringify(filterParam));
    result = JSON.parse(result);
    if (result.code != "200") {
      throw new Error("过滤方案提取商品失败！");
    }
    let apiResponseProduct = result.list;
    //循环医药物料
    for (let i = 0; i < apiResponseProduct.length; i++) {
      //查询原厂物料属性
      let yonql = "select name,unit.id,unit.name from pc.product.Product  where  id = '" + apiResponseProduct[i].material + "'";
      let materialProInfo = ObjectStore.queryByYonQL(yonql, "productcenter");
      if (materialProInfo != null && materialProInfo.length > 0) {
        apiResponseProduct[i].unit = materialProInfo[0].unit_id;
        apiResponseProduct[i].unit_Name = materialProInfo[0].unit_Name;
        apiResponseProduct[i].product_name = materialProInfo[0].name;
      }
    }
    return { result: apiResponseProduct };
  }
}
exports({ entryPoint: MyAPIHandler });