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
    let orgId = request.org;
    let warehouse = request.warehouse;
    let stockstate = request.stockstate;
    let productIds = request.productIds;
    let currentStockList = [];
    let warehouseSql = "select isGoodsPosition from 	aa.warehouse.Warehouse where    id ='" + warehouse + "' ";
    let warehouseInfo = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
    let currentStockSql = "";
    if (warehouseInfo[0].isGoodsPosition) {
      currentStockSql =
        "select  org ,org.name org_name,batchno  lot_num_batchno,product  product_code,product.cCode product_code_code,product.cName product_name,warehouse,warehouse.name warehouse_name,productsku  skuid,productsku.cCode skuid_code,productsku.skuName skuname,currentqty  currentStockNum,stockStatusDoc  stockstate,stockStatusDoc.statusName stockstate_statusName,producedate  production_date,invaliddate  valid_until,location  huowei ,location.name huowei_name,currentStockCharacteristic features  from 	stock.currentstock.CurrentStockLocation where currentqty >0 and warehouse.id ='" +
        warehouse +
        "' and org='" +
        orgId +
        "'  ";
    } else {
      currentStockSql =
        "select org ,org.name org_name,batchno  lot_num_batchno,product  product_code,product.cCode product_code_code,product.cName product_name,warehouse,warehouse.name warehouse_name,productsku  skuid,productsku.cCode skuid_code,productsku.skuName skuname,currentqty  currentStockNum,stockStatusDoc  stockstate,stockStatusDoc.statusName stockstate_statusName,producedate   production_date,invaliddate  valid_until, currentStockCharacteristic features   from 	stock.currentstock.CurrentStock where currentqty >0 and warehouse.id ='" +
        warehouse +
        "' and org='" +
        orgId +
        "' ";
    }
    if (productIds != undefined && productIds != null && productIds.length > 0) {
      currentStockSql += " and product in (" + productIds.join() + ")";
    }
    if (stockstate != null && stockstate != undefined && stockstate != "") {
      currentStockSql += " and stockStatusDoc.id ='" + stockstate + "'";
    }
    currentStockList = ObjectStore.queryByYonQL(currentStockSql, "ustock");
    for (let i = 0; i < currentStockList.length; i++) {
      if (currentStockList[i].hasOwnProperty("features")) {
        delete currentStockList[i].features.id;
      }
      currentStockList[i].valid_until = dateFormat(currentStockList[i].valid_until, "yyyy-MM-dd");
      currentStockList[i].production_date = dateFormat(currentStockList[i].production_date, "yyyy-MM-dd");
    }
    return { currentStockList: currentStockList };
  }
}
exports({ entryPoint: MyAPIHandler });