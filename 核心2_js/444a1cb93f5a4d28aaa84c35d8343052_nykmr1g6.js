let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.ids;
    let orderInfos = [];
    for (let i = 0; i < ids.length; i++) {
      let billInfo = ObjectStore.selectById("st.salesout.SalesOut", { id: ids[i] });
      //计算客户的名称
      let queryCustName = "select name  from 	aa.merchant.Merchant where id = " + billInfo.cust;
      billInfo.cust_name = ObjectStore.queryByYonQL(queryCustName, "productcenter")[0].name;
      if (billInfo.operator != undefined) {
        let querySalesMan = "select name from bd.staff.Staff where id = " + billInfo.operator;
        billInfo.salesman_name = ObjectStore.queryByYonQL(querySalesMan, "ucf-staff-center")[0].name;
      }
      let mapObj = {};
      mapObj["mainid"] = ids[i];
      let entryInfo = ObjectStore.selectByMap("st.salesout.SalesOuts", mapObj);
      if (request.type == "出库") {
        if (entryInfo[0].qty < 0) {
          continue;
        }
      } else if (request.type == "退货") {
        if (entryInfo[0].qty > 0) {
          continue;
        }
      }
      for (let j = 0; j < entryInfo.length; j++) {
        let materialSql = "select extend_standard_code,extend_package_specification  from  pc.product.Product  where id = '" + entryInfo[j].product + "'";
        let materialInfo = ObjectStore.queryByYonQL(materialSql, "productcenter")[0];
        entryInfo[j].extend_standard_code = materialInfo.extend_standard_code;
        entryInfo[j].extend_package_specification = materialInfo.extend_package_specification;
      }
      billInfo.entry = entryInfo;
      orderInfos.push(billInfo);
    }
    return { orderInfos };
  }
}
exports({ entryPoint: MyAPIHandler });