let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 声明是否存在超出紧急采购价的单据
    var sum = 0;
    var sumNo = 0;
    var arrayProduct = new Array();
    var requ = param.requestData;
    var define6 = 0;
    // 判断是string转对象
    if (Object.prototype.toString.call(requ) === "[object String]") {
      requ = JSON.parse(param.requestData);
    }
    // 获取主表id
    var id = param.data[0].id;
    var price = 0;
    // 没有purchaseOrders属性或者为null直接返回
    if (!param.data[0].hasOwnProperty("purchaseOrders") || param.data[0].purchaseOrders === null) {
      return {};
    }
    if ("A20001" == param.data[0].bustype_code || "002" == param.data[0].bustype_code) {
      return {};
    } else {
      if (requ._status == "Insert") {
        var Dprice = 0;
        var somProduct = param.data[0].purchaseOrders;
        for (var s = 0; s < somProduct.length; s++) {
          if (somProduct[s].hasOwnProperty("purchaseOrdersDefineCharacter")) {
            if (somProduct[s].purchaseOrdersDefineCharacter.hasOwnProperty("attrext42")) {
              Dprice = somProduct[s].purchaseOrdersDefineCharacter.attrext42;
              var Oprice = somProduct[s].oriTaxUnitPrice;
              price = Oprice - Dprice;
              if (0 >= price) {
                sum = sum + 1;
              } else {
                sumNo = sumNo + 1;
                arrayProduct.push("物料编码为" + somProduct[s].product_cCode);
                arrayProduct.push("行号第" + somProduct[s].rowno + "行");
              }
            } else {
              sum = sum + 1;
            }
          } else {
            sum = sum + 1;
          }
        }
        if (sumNo == somProduct.length) {
          param.data[0].purchaseOrderDefineCharacter.set("attrext44", "true");
        } else if (sum == somProduct.length) {
          param.data[0].purchaseOrderDefineCharacter.set("attrext44", "false");
        } else {
          throw new Error("同时存在超出和不超出紧急采购价" + JSON.stringify(arrayProduct));
        }
      } else if (requ._status == "Update") {
        var aarr = new Array();
        if (param.data[0].hasOwnProperty("purchaseOrders")) {
          var producrOrder = param.data[0].purchaseOrders;
          for (var a = 0; a < producrOrder.length; a++) {
            // 查询数据库
            var sonId = producrOrder[a].id;
            var sqlDefin = "select purchaseOrdersDefineCharacter.attrext42 from pu.purchaseorder.PurchaseOrders where id ='" + sonId + "'";
            var resDefin = ObjectStore.queryByYonQL(sqlDefin, "upu");
            if (resDefin.length > 0) {
              define6 = resDefin[0].purchaseOrdersDefineCharacter_attrext42;
              var Oprice = producrOrder[a].hasOwnProperty("oriTaxUnitPrice");
              if (Oprice) {
                var defin6OPrice = producrOrder[a].oriTaxUnitPrice;
                price = defin6OPrice - define6;
                if (0 >= price) {
                  sum = sum + 1;
                } else {
                  sumNo = sumNo + 1;
                  aarr.push("物料编码为" + producrOrder[a].product_cCode);
                  aarr.push("行号第" + producrOrder[a].rowno + "行");
                }
              } else {
                // 查询子表
                var purchaseOrderSql = "select oriTaxUnitPrice from pu.purchaseorder.PurchaseOrders where id=" + sonId + "";
                var respurchaseOrder = ObjectStore.queryByYonQL(purchaseOrderSql, "upu");
                var oriUnitPriceList = respurchaseOrder[0].oriTaxUnitPrice;
                price = oriUnitPriceList - define6;
                if (0 >= price) {
                  sum = sum + 1;
                } else {
                  sumNo = sumNo + 1;
                  aarr.push("物料编码为" + producrOrder[a].product_cCode);
                  aarr.push("行号第" + producrOrder[a].rowno + "行");
                }
              }
            } else {
              sum = sum + 1;
            }
          }
          if (sum == producrOrder.length) {
            param.data[0].purchaseOrderDefineCharacter.set("attrext44", "false");
          } else if (sumNo == producrOrder.length) {
            param.data[0].purchaseOrderDefineCharacter.set("attrext44", "true");
          } else {
            throw new Error("同时存在超出和不超出紧急采购价" + JSON.stringify(arrayProduct));
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });