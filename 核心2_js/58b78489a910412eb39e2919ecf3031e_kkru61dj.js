let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let filterSchemeId = request.filterSchemeId; //养护过滤方案id
    let orgId = request.orgId; //组织id
    let tenantId = request.tenantId; //租户id脚手架使用
    let warehouseId = request.warehouseId; //仓库id
    let warehouseName = request.warehouseName; //仓库名称
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let materialFileFilterUrl = apiPreAndAppCode.apiRestPre + "/filtersScheme/materialFileFilter";
    let filterParam = { filterSchemeId: filterSchemeId, orgId: orgId, tenantId: tenantId, warehouseId: warehouseId, warehouseName: warehouseName };
    let warehouseSql = "select isGoodsPosition from 	aa.warehouse.Warehouse where    id ='" + warehouseId + "' ";
    let warehouse = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
    let stockStatusSql = "select id from 	st.stockStatusRecord.stockStatusRecord where statusName ='合格' ";
    let stockStatusRecord = ObjectStore.queryByYonQL(stockStatusSql, "ustock");
    if (warehouse[0].isGoodsPosition) {
      let currentStockLocationSql =
        "select location,currentqty,batchno,product,productsku,productsku.cCode,productsku.skuName,location.name,producedate,invaliddate from 	stock.currentstock.CurrentStockLocation where currentqty >0 and warehouse.id ='" +
        warehouseId +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "'  ";
      let currentStockLocation = ObjectStore.queryByYonQL(currentStockLocationSql, "ustock");
      filterParam.currentStock = currentStockLocation;
    } else {
      let currentStockSql =
        "select '' location,'' location_name, currentqty,batchno,product,productsku,productsku.cCode,productsku.skuName,producedate,invaliddate from 	stock.currentstock.CurrentStock where currentqty >0 and warehouse.id ='" +
        warehouseId +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "' ";
      let currentStock = ObjectStore.queryByYonQL(currentStockSql, "ustock");
      filterParam.currentStock = currentStock;
    }
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
        apiResponseProduct[i].product_name = materialProInfo[0].name;
      }
    }
    return { result: apiResponseProduct };
  }
}
exports({ entryPoint: MyAPIHandler });