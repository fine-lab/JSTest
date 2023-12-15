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
    //查询到专人购销数据，那么业务员必填
    if (request.operator == undefined && request.type == 1) {
      return { info: "请录入采购员!\n\r" };
    }
    //查询到专人购销数据，那么业务员必填
    if (request.operator == undefined && request.type == 2) {
      return { info: "请录入销售业务员!\n\r" };
    }
    let productMap = new Map();
    for (let i = 0; i < res.length; i++) {
      let obj = {
        product: res[i].product.toString(),
        sku: res[i].sku == undefined ? "" : res[i].sku.toString()
      };
      obj = JSON.stringify(obj);
      if (!productMap.has(obj)) {
        productMap.set(obj, []);
      }
      productMap.get(obj).push(res[i].staff);
    }
    //如果传参没有sku
    if (request.productsku == undefined) {
      //先判断有无进行非sku购销控制
      let obj = {
        product: request.productId.toString(),
        sku: ""
      };
      obj = JSON.stringify(obj);
      let flag = true;
      //如果对非sku进行了相关设置，且专人中没有此业务员，那么报错
      if (productMap.has(obj) && productMap.get(obj).indexOf(request.operator) == -1) {
        flag = false;
      }
      //也存在一种可能，productMap中存在sku级别，那么理论上，只要存在sku级别，无论有没有进行相关，都得报错
      for (let key of productMap.keys()) {
        if (key.sku != "") {
          flag = false;
          break;
        }
      }
      if (!flag) {
        return { info: "第" + request.rowno + "行药品【" + request.productName + "】" + map[request.type]["errorInfo"] + "。\n\r" };
      }
    }
    //如果没有传sku，那么无需flag，有符合条件即可
    if (request.productsku != undefined) {
      let obj1 = {
        product: request.productId.toString(),
        sku: ""
      };
      obj1 = JSON.stringify(obj1);
      let obj2 = {
        product: request.productId.toString(),
        sku: request.productsku.toString()
      };
      obj2 = JSON.stringify(obj2);
      //如果存在非sku维度
      if (productMap.has(obj1)) {
        //业务员匹配，即可
        if (productMap.get(obj1).indexOf(request.operator) != -1) {
          return { info: "" };
        } else {
          //业务员不匹配，那么sku维度必须要有
          if (productMap.has(obj2) && productMap.get(obj2).indexOf(request.operator) != -1) {
            return { info: "" };
          }
        }
      } else {
        //如果两种都没有，或者sku维度有
        if (!productMap.has(obj2) || (productMap.has(obj2) && productMap.get(obj2).indexOf(request.operator) != -1)) {
          return { info: "" };
        }
      }
      return { info: "第" + request.rowno + "行药品【" + request.productName + "】" + map[request.type]["errorInfo"] + "。\n\r" };
    }
    return { info: "" };
  }
}
exports({ entryPoint: MyAPIHandler });