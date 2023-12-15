let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.ids;
    let orderInfos = [];
    //销售出库
    let str_ids = ids.join(",");
    let billSql = "select * from st.salesout.SalesOut where id in (" + str_ids + ")";
    let billInfo = ObjectStore.queryByYonQL(billSql, "ustock");
    let custArr = [];
    let operatorArr = [];
    for (let i = 0; i < billInfo.length; i++) {
      if (typeof billInfo[i].cust != "undefined" && billInfo[i].cust != null) {
        custArr.push(billInfo[i].cust);
      }
      if (typeof billInfo[i].operator != "undefined" && billInfo[i].operator != null) {
        operatorArr.push(billInfo[i].operator);
      }
    }
    let str_custArr = custArr.join(",");
    let str_operatorArr = operatorArr.join(",");
    //计算客户的名称
    let queryCustNameSql = "";
    let querySalesManSql = "";
    if (str_operatorArr.length > 10) {
      queryCustNameSql = "select id, name from aa.merchant.Merchant where id in (" + str_custArr + ")";
    } else {
      queryCustNameSql = "select id, name from aa.merchant.Merchant";
    }
    let queryCustNameRes = ObjectStore.queryByYonQL(queryCustNameSql, "productcenter");
    let merchantRes = {};
    if (typeof queryCustNameRes != "undefined" && queryCustNameRes != null) {
      for (let i = 0; i < queryCustNameRes.length; i++) {
        if (!merchantRes.hasOwnProperty(queryCustNameRes[i].id)) {
          merchantRes[queryCustNameRes[i].id] = queryCustNameRes[i];
        }
      }
    }
    if (str_operatorArr.length > 10) {
      querySalesManSql = "select id, name from bd.staff.Staff where id in (" + str_operatorArr + ")";
    } else {
      querySalesManSql = "select id, name from bd.staff.Staff";
    }
    let querySalesManRes = ObjectStore.queryByYonQL(querySalesManSql, "ucf-staff-center");
    let staffRes = {};
    if (typeof querySalesManRes != "undefined" && querySalesManRes != null) {
      for (let i = 0; i < querySalesManRes.length; i++) {
        if (!staffRes.hasOwnProperty(querySalesManRes[i].id)) {
          staffRes[querySalesManRes[i].id] = querySalesManRes[i];
        }
      }
    }
    //销售出库子表
    let billChildSql = "select * from st.salesout.SalesOuts where mainid in (" + str_ids + ")";
    let billChildInfo = ObjectStore.queryByYonQL(billChildSql, "ustock");
    let products = [];
    let sourceautoids = [];
    if (typeof billChildInfo != "undefined" && billChildInfo != null) {
      for (let i = 0; i < billChildInfo.length; i++) {
        if (typeof billChildInfo[i].product != "undefined" && billChildInfo[i].product != null) {
          products.push(billChildInfo[i].product);
        }
        if (typeof billChildInfo[i].sourceautoid != "undefined" && billChildInfo[i].sourceautoid != null) {
          sourceautoids.push(billChildInfo[i].sourceautoid);
        }
      }
    }
    let str_products = products.join(",");
    let str_sourceautoids = sourceautoids.join(",");
    let productInfo = {};
    let materialSql = "select id, extend_standard_code,extend_package_specification  from  pc.product.Product  where id in (" + str_products + ")";
    let materialInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
    if (typeof materialInfo != "undefined" && materialInfo != null) {
      for (let i = 0; i < materialInfo.length; i++) {
        if (!productInfo.hasOwnProperty(materialInfo[i].id)) {
          productInfo[materialInfo[i].id] = materialInfo[i];
        }
      }
    }
    let salereturnInfo = {};
    let upBillChildInfoSql = "select id, upcode from voucher.salereturn.SaleReturnDetail where id in (" + str_sourceautoids + ")";
    let upBillChildInfo = ObjectStore.queryByYonQL(upBillChildInfoSql, "udinghuo");
    if (typeof upBillChildInfo != "undefined" && upBillChildInfo != null) {
      for (let i = 0; i < upBillChildInfo.length; i++) {
        if (!salereturnInfo.hasOwnProperty(upBillChildInfo[i].id)) {
          salereturnInfo[upBillChildInfo[i].id] = upBillChildInfo[i];
        }
      }
    }
    for (let i = 0; i < billChildInfo.length; i++) {
      if (typeof productInfo[billChildInfo[i].product] != "undefined" && productInfo[billChildInfo[i].product] != null) {
        billChildInfo[i].extend_standard_code = productInfo[billChildInfo[i].product].extend_standard_code;
      }
      if (typeof productInfo[billChildInfo[i].product] != "undefined" && productInfo[billChildInfo[i].product] != null) {
        billChildInfo[i].extend_package_specification = productInfo[billChildInfo[i].product].extend_package_specification;
      }
      if (typeof salereturnInfo[billChildInfo[i].sourceautoid] != "undefined" && salereturnInfo[billChildInfo[i].sourceautoid] != null) {
        billChildInfo[i].upStreamCode = salereturnInfo[billChildInfo[i].sourceautoid].upcode;
      }
    }
    let info = {};
    for (let i = 0; i < billInfo.length; i++) {
      info = billInfo[i];
      let isHave = false;
      let entry = [];
      for (let j = 0; j < billChildInfo.length; j++) {
        if (billChildInfo[j].mainid == billInfo[i].id) {
          let qty = billChildInfo[j].qty;
          if (request.type == "出库") {
            if (qty < 0) {
              break;
            }
          } else if (request.type == "退货") {
            if (qty > 0) {
              break;
            }
          }
          if (typeof merchantRes[billInfo[i].cust] != "undefined" && merchantRes[billInfo[i].cust] != null) {
            info.cust_name = merchantRes[billInfo[i].cust].name;
          }
          if (typeof staffRes[billInfo[i].operator] != "undefined" && staffRes[billInfo[i].operator] != null) {
            info.salesman_name = staffRes[billInfo[i].operator].name;
          }
          entry.push(billChildInfo[j]);
          isHave = true;
        }
      }
      if (isHave) {
        info.entry = entry;
        orderInfos.push(info);
      }
    }
    return { orderInfos };
  }
}
exports({ entryPoint: MyAPIHandler });