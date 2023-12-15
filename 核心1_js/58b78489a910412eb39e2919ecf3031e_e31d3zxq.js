let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 时间格式化方法
    var dateFormat = function (date, format) {
      if (date == null || date == undefined || date == "") {
        return "";
      }
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours() + 8, //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
    let filterSchemeId = request.filterSchemeId; //养护过滤方案id
    let orgId = request.orgId; //组织id
    let tenantId = ObjectStore.user().tenantId;
    let warehouseId = request.warehouseId; //仓库id
    let warehouseName = request.warehouseName; //仓库名称
    let apiPreAndAppCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let materialFileFilterUrl = apiPreAndAppCode.apiRestPre + "/filtersScheme/materialFileFilter";
    let filterParam = { filterSchemeId: filterSchemeId, orgId: orgId, tenantId: tenantId, warehouseId: warehouseId, warehouseName: warehouseName };
    let warehouseSql = "select isGoodsPosition from 	aa.warehouse.Warehouse where    id ='" + warehouseId + "' ";
    let warehouse = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
    let s = new Date().getTime();
    let stockStatusSql = "select id from 	st.stockStatusRecord.stockStatusRecord where statusName ='合格' ";
    let stockStatusRecord = ObjectStore.queryByYonQL(stockStatusSql, "ustock");
    if (warehouse[0].isGoodsPosition) {
      let currentStockLocationSql =
        "select id currentStockId, location,currentqty,batchno, product,productsku,productsku.cCode,productsku.skuName,location.name,producedate,invaliddate  from 	stock.currentstock.CurrentStockLocation where currentqty >0 and warehouse.id ='" +
        warehouseId +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "'  ";
      let currentStockLocation = ObjectStore.queryByYonQL(currentStockLocationSql, "ustock");
      filterParam.currentStock = currentStockLocation;
    } else {
      let currentStockSql =
        "select id currentStockId , '' location,'' location_name, currentqty,batchno, product,productsku,productsku.cCode,productsku.skuName,producedate,invaliddate  from 	stock.currentstock.CurrentStock where currentqty >0  and warehouse.id ='" +
        warehouseId +
        "' and stockStatusDoc.id='" +
        stockStatusRecord[0].id +
        "' ";
      let currentStock = ObjectStore.queryByYonQL(currentStockSql, "ustock");
      filterParam.currentStock = currentStock;
    }
    if (filterParam.currentStock == null || filterParam.currentStock == undefined || filterParam.currentStock.length == 0) {
      return { result: null };
    }
    //通过后端脚手架筛选过滤后的医药物料
    let result = postman("POST", materialFileFilterUrl, null, JSON.stringify(filterParam));
    result = JSON.parse(result);
    let e = new Date().getTime();
    if (result.code != "200") {
      throw new Error("过滤方案提取商品失败！");
    }
    let apiResponseProduct = result.list;
    return { result: apiResponseProduct };
  }
}
exports({ entryPoint: MyAPIHandler });