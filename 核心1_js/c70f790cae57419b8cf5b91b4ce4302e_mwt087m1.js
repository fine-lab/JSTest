let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orderdefinesSql = "select  *  from voucher.order.OrderFreeDefine where  define60 is null";
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
        let getWeight = "select netWeight from pc.product.Product where id=" + productId;
        let Weight = ObjectStore.queryByYonQL(getWeight, "productcenter");
        let netWeight = Weight[0].netWeight;
        wightTotal = netWeight * qty + wightTotal;
      });
      //客户指定物流
      let khzdwl;
      let customerCode = "XM000422";
      let customersql = "select id from aa.merchant.Merchant  where code =" + customerCode;
      let customerinfo = ObjectStore.queryByYonQL(customersql, "productcenter");
      let customer = customerinfo[0].id;
      let customerdefinesql = "select * from aa.merchant.MerchantDefine  where id =" + customer;
      let customerinfoDefine = ObjectStore.queryByYonQL(customerdefinesql, "productcenter");
      let define7 = customerinfoDefine[0].define7;
      let define8 = customerinfoDefine[0].define8;
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
      let url = "https://www.example.com/";
      let Objects = {
        billnum: "voucher_order",
        datas: [
          {
            id: id,
            code: code,
            definesInfo: [
              {
                define60: define60,
                isHead: true,
                isFree: true
              }
            ]
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