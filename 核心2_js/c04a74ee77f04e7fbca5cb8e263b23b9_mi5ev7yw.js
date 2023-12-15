let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.ids;
    let orderInfos = [];
    for (let i = 0; i < ids.length; i++) {
      let billInfo = ObjectStore.selectById("st.othoutrecord.OthOutRecord", { id: ids[i] });
      //计算供货企业的名称
      let queryCustName = "select id,name  from aa.vendor.Vendor";
      let custName = ObjectStore.queryByYonQL(queryCustName, "yssupplier");
      if (billInfo.operator != undefined) {
        let querySalesMan = "select name from bd.staff.Staff where id = " + billInfo.operator;
        billInfo.salesman_name = ObjectStore.queryByYonQL(querySalesMan, "ucf-staff-center")[0].name;
      }
      let mapObj = {};
      mapObj["mainid"] = ids[i];
      let entryInfo = ObjectStore.selectByMap("st.othoutrecord.OthOutRecords", mapObj);
      for (let j = 0; j < entryInfo.length; j++) {
        //查询物料表
        let materialSql = "select extend_standard_code,extend_package_specification,manufacturer  from  pc.product.Product  where id = '" + entryInfo[j].product + "'";
        let materialInfo = ObjectStore.queryByYonQL(materialSql, "productcenter")[0];
        if (typeof materialInfo != "undefined") {
          if (typeof materialInfo.extend_standard_code != "undefined") {
            entryInfo[j].extend_standard_code = materialInfo.extend_standard_code;
          } else {
            entryInfo[j].extend_package_specification = "";
          }
          if (typeof materialInfo.extend_standard_code != "undefined") {
            entryInfo[j].extend_package_specification = materialInfo.extend_package_specification;
          } else {
            entryInfo[j].extend_package_specification = "";
          }
        }
        //查询采购入库单子表
        let queryPurinrecordChild =
          "select * from st.purinrecord.PurInRecords where product = '" + entryInfo[j].product + "' and productsku = '" + entryInfo[j].productsku + "' and batchno = '" + entryInfo[j].batchno + "'";
        let purinrecordNameChild = ObjectStore.queryByYonQL(queryPurinrecordChild, "ustock"); //
        if (purinrecordNameChild.length > 0 && typeof purinrecordNameChild != "undefined") {
          let idList = [];
          for (let k = 0; k < purinrecordNameChild.length; k++) {
            //查询采购入库单
            let queryPurinrecord =
              "select vendor,code from st.purinrecord.PurInRecord where id = " + purinrecordNameChild[k].mainid + " and warehouse = " + billInfo.warehouse + " and purchaseOrg = " + billInfo.org;
            let purinrecordName = ObjectStore.queryByYonQL(queryPurinrecord, "ustock");
            idList.push(purinrecordName);
            if (purinrecordName.length > 0) {
              let masterCode = purinrecordName[0].code;
              if (typeof masterCode != "undefined") {
                entryInfo[j].upStreamCode = purinrecordName[0].code;
              }
              for (let l = 0; l < custName.length; l++) {
                if (purinrecordName[0].vendor == custName[l].id) {
                  entryInfo[j].cust_name = custName[l].name;
                  break;
                }
              }
            }
          }
        } else {
          if (typeof materialInfo != "undefined" && materialInfo != null && JSON.stringify(materialInfo) != "{}") {
            if (typeof materialInfo.manufacturer != "undefined" && materialInfo.manufacturer != null) {
              entryInfo[j].cust_name = materialInfo.manufacturer;
            }
          }
        }
      }
      billInfo.entry = entryInfo;
      orderInfos.push(billInfo);
    }
    return { orderInfos };
  }
}
exports({ entryPoint: MyAPIHandler });