let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var myDate = new Date();
    var now = myDate.valueOf();
    // 正确交货方式
    let orderdefinesSql =
      "select id,orderDefineCharacter.attrext14 as define7, orderDefineCharacter.attrext33 as define59, orderDefineCharacter.attrext8 as define2 from voucher.order.Order " +
      " where orderDefineCharacter.attrext18 is null";
    let orderdefineList = ObjectStore.queryByYonQL(orderdefinesSql, "udinghuo");
    orderdefineList.forEach((item) => {
      //交货方式
      let jhfs = item.define7;
      //总重量
      let wightTotal = 0;
      //地区
      let diqu = item.define59;
      let id = item.id;
      //子表信息
      let childSql = "select productId,qty from voucher.order.OrderDetail where orderId=" + id;
      let saleorderChild = ObjectStore.queryByYonQL(childSql, "udinghuo");
      saleorderChild.forEach((item) => {
        let productId = item.productId;
        let qty = item.qty;
        let getWeight = "select netWeight from pc.product.Product where id=" + productId; //物料 净重
        let Weight = ObjectStore.queryByYonQL(getWeight, "productcenter");
        if (Weight != undefined && Weight.length > 0 && Weight[0].netWeight != undefined) {
          let netWeight = Weight[0].netWeight;
          wightTotal = netWeight * qty + wightTotal;
        }
      });
      //客户指定物流
      let khzdwl;
      let customerCode = item.define2; //客户编码
      let customersql = "select id, merchantCharacter.attrext69 as define7, merchantCharacter.attrext69 as define8 from aa.merchant.Merchant  where code =" + customerCode;
      let customerinfo = ObjectStore.queryByYonQL(customersql, "productcenter");
      if (customerinfo.length > 0) {
        let define7 = customerinfo[0].define7; //客户指定物流
        let define8 = customerinfo[0].define8; //客户指定物流（小于等于55KG）
        if (define7 && !define8) {
          khzdwl = define7;
        } else if (define7 && define8) {
          if (wightTotal > 55) {
            khzdwl = define7;
          } else {
            khzdwl = define8;
          }
        } else if (!define7 && define8) {
          khzdwl = define8;
        }
      }
      //根据主表id去查code
      let getCode = "select  code  from  voucher.order.Order   where  id ='" + id + "'";
      var codeRes = ObjectStore.queryByYonQL(getCode, "udinghuo");
      let code = codeRes[0].code;
      if (jhfs == "COD-顺丰") {
        updateSalesOrder(id, code, jhfs);
      } else if (includes(khzdwl, "顺丰") || includes(khzdwl, "跨越")) {
        if (includes(khzdwl, "顺丰")) {
          if (wightTotal >= 55) {
            updateSalesOrder(id, code, "顺丰标快");
          } else {
            updateSalesOrder(id, code, "顺丰特快");
          }
        } else {
          if (wightTotal >= 55) {
            updateSalesOrder(id, code, "跨越物流");
          } else {
            updateSalesOrder(id, code, "跨越速运");
          }
        }
      } else {
        if (wightTotal >= 55) {
          updateSalesOrder(id, code, "跨越物流");
        } else {
          if (includes(diqu, "广东") || includes(diqu, "广西") || includes(diqu, "福建") || includes(diqu, "贵州")) {
            updateSalesOrder(id, code, "跨越速运");
          } else {
            updateSalesOrder(id, code, "顺丰特快");
          }
        }
      }
    });
    function updateSalesOrder(id, code, define60) {
      let url = "https://www.example.com/"; //销售订单自定义项特征更新
      let Objects = {
        datas: [
          {
            id: id,
            orderDefineCharacter: {
              attrext18: define60
            }
          }
        ]
      };
      let apiResponse = openLinker("POST", url, "AT1775ABBE17500005", JSON.stringify(Objects));
    }
    let res = "成功";
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });