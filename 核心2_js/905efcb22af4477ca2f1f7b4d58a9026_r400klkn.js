let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    for (let key in request) {
      if (request[key] != undefined) {
        request[key] = request[key].toString();
      }
    }
    let map = {
      1: {
        table: "GT22176AT10.GT22176AT10.sy01_limitPurProducts",
        errorInfo: "限制采购,请核对限采表"
      },
      2: {
        table: "GT22176AT10.GT22176AT10.sy01_limitSaleProducts",
        errorInfo: "限制销售,请核对限销表"
      }
    };
    let yonql =
      "select product,sku,sy01_specialDrugCfg_id.staff staff from " +
      map[request.type]["table"] +
      " where product = '" +
      request.productId +
      "' and sy01_specialDrugCfg_id.org_id = '" +
      request.orgId +
      "'";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    if (res.length == 0) {
      return { info: "" };
    }
    let staffMap = {};
    for (let i = 0; i < res.length; i++) {
      if (!staffMap.hasOwnProperty(res[i].staff)) {
        staffMap[res[i].staff] = {
          product: [],
          sku: []
        };
      }
      if (res[i]["sku"] == undefined || res[i]["sku"] == null || res[i]["sku"] == "") {
        staffMap[res[i].staff]["product"].push(res[i].product);
      } else {
        staffMap[res[i].staff]["sku"].push(res[i].sku);
      }
    }
    //如果业务员不匹配,那么直接g
    if (request.operator == undefined && request.type == 1) {
      return { info: "请录入采购员!\n\r" };
    }
    //如果业务员不匹配,那么直接g
    if (request.operator == undefined && request.type == 2) {
      return { info: "请录入销售业务员!\n\r" };
    }
    if (!staffMap.hasOwnProperty(request.operator)) {
      return { info: "第" + request.rowno + "行药品【" + request.productName + "】" + map[request.type]["errorInfo"] + "。\n\r" };
    }
    //如果列表没有填写sku，配置中product没有找到相关信息，报错
    if (staffMap[request.operator]["product"].indexOf(request.productId) == -1 && request.productsku == undefined) {
      return { info: "第" + request.rowno + "行药品【" + request.productName + "】" + map[request.type]["errorInfo"] + "。\n\r" };
    }
    //如果订单分录填写了sku，但是product和sku中都没有找到相关信息，那么报错
    if (staffMap[request.operator]["product"].indexOf(request.productId) == -1 && staffMap[request.operator]["sku"].indexOf(request.productsku) == -1 && request.productsku != undefined) {
      return { info: "第" + request.rowno + "行SKU【" + request.productskuName + "】" + map[request.type]["errorInfo"] + "。\n\r" };
    }
    return { info: "" };
  }
}
exports({ entryPoint: MyAPIHandler });