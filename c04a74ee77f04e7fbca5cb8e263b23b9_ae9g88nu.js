let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.ids;
    let orderInfos = [];
    for (let i = 0; i < ids.length; i++) {
      let billInfo = ObjectStore.selectById("st.othoutrecord.OthOutRecord", { id: ids[i] });
      //计算供货企业的名称
      let queryCustName = "select id,name  from 	aa.merchant.Merchant";
      let custName = ObjectStore.queryByYonQL(queryCustName, "productcenter");
      if (billInfo.operator != undefined) {
        let querySalesMan = "select name from bd.staff.Staff where id = " + billInfo.operator;
        billInfo.salesman_name = ObjectStore.queryByYonQL(querySalesMan, "ucf-staff-center")[0].name;
      }
      let mapObj = {};
      mapObj["mainid"] = ids[i];
      let entryInfo = ObjectStore.selectByMap("st.othoutrecord.OthOutRecords", mapObj);
      for (let k = 0; k < request.busTypeList.length; k++) {
        const element = array[k];
      }
      for (let j = 0; j < entryInfo.length; j++) {
        for (let k = 0; k < custName.length; k++) {
          if ((entryInfo[j].stockUnitId = custName[k].id)) {
            entryInfo[j].cust_name = custName[k].name;
          }
        }
        let materialSql = "select extend_standard_code,extend_package_specification,manufacturer  from  pc.product.Product  where id = '" + entryInfo[j].product + "'";
        let materialInfo = ObjectStore.queryByYonQL(materialSql, "productcenter");
        if (materialInfo.length > 0) {
          entryInfo[j].extend_standard_code = materialInfo[0].extend_standard_code;
          entryInfo[j].extend_package_specification = materialInfo[0].extend_package_specification;
          entryInfo[j].manufacturer = materialInfo[0].manufacturer;
        }
      }
      billInfo.entry = entryInfo;
      orderInfos.push(billInfo);
    }
    return { orderInfos };
  }
}
exports({ entryPoint: MyAPIHandler });