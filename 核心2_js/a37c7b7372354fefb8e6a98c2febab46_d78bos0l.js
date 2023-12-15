let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var define6Data = param.data[0];
    var requ = param.requestData;
    var define6 = 0;
    var num = 0;
    // 判断是string转对象
    if (Object.prototype.toString.call(requ) === "[object String]") {
      requ = JSON.parse(param.requestData);
    }
    var array = new Array();
    if ("A20001" == param.data[0].bustype_code || "002" == param.data[0].bustype_code) {
      return {};
    } else {
      if (requ._status == "Insert") {
        if (param.data[0].hasOwnProperty("purchaseOrders")) {
          var productOrders = param.data[0].purchaseOrders;
          for (var i = 0; i < productOrders.length; i++) {
            var productId = productOrders[i].product;
            // 查询最近非紧急采购价
            //查询主表id
            let sql =
              "select id as mainid,code,a.id from pu.purchaseorder.PurchaseOrder left join pu.purchaseorder.PurchaseOrders as a on id=a.mainid where a.product='" +
              productId +
              "' order by vouchdate desc";
            let resquest = ObjectStore.queryByYonQL(sql, "upu");
            if (resquest.length > 0) {
              for (var j = 0; j < resquest.length; j++) {
                let mainid = resquest[j].mainid;
                // 判断主表状态
                let hostSql = "select status,bustype from pu.purchaseorder.PurchaseOrder where id='" + mainid + "'";
                let hostRes = ObjectStore.queryByYonQL(hostSql, "upu");
                if (hostRes[0].status == 1 && hostRes[0].bustype != "2745364457577757" && hostRes[0].bustype != "1602259643240808452") {
                  // 查询表头自定义项
                  let customSql = "select purchaseOrderDefineCharacter.attrext43 as define3,id from pu.purchaseorder.PurchaseOrder where id='" + mainid + "'";
                  var customRes = ObjectStore.queryByYonQL(customSql, "upu");
                  if (customRes.length > 0) {
                    let define1 = customRes[0].define3;
                    if ("否" == define1) {
                      let mid = customRes[0].id;
                      // 查询采购价
                      let sql1 = "select * from pu.purchaseorder.PurchaseOrders where product='" + productId + "' and mainid='" + mid + "'";
                      let resquest1 = ObjectStore.queryByYonQL(sql1, "upu");
                      // 循环判断product
                      for (var m = 0; m < resquest1.length; m++) {
                        var oriTaxUnitPriceID = resquest1[m].product;
                        if (oriTaxUnitPriceID == productId) {
                          let oriTaxUnitPrice = resquest1[m].oriTaxUnitPrice;
                          param.data[0].purchaseOrders[i].purchaseOrdersDefineCharacter.set("attrext42", oriTaxUnitPrice + "");
                          num = num + 1;
                          break;
                        }
                      }
                    }
                  }
                  if (num > 0) {
                    num = 0;
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });