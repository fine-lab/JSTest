let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterId = request.masterId;
    let vendor_name = request.vendor_name;
    let masterRes = [];
    for (let i = 0; i < masterId.length; i++) {
      let isHave = false;
      //采购入库（逆向查询）
      let masterSql = "select * from st.purinrecord.PurInRecord where id=" + masterId[i];
      let masRes = ObjectStore.queryByYonQL(masterSql);
      if (typeof masRes != "undefined") {
        masRes[0].vendor_name = vendor_name[masterId[i]];
        let salsaSql = "select name from hred.staff.Staff where id=" + masRes[0].stockMgr;
        let salasRes = ObjectStore.queryByYonQL(salsaSql, "ucf-staff-center");
        if (salasRes.length > 0) {
          masRes[0].salasName = salasRes[0].name;
        }
      }
      //采购订单（逆向查询）
      let masterSql0 = "select * from pu.purchaseorder.PurchaseOrder where id=" + masRes[0].srcBill;
      let masRes0 = ObjectStore.queryByYonQL(masterSql0, "upu");
      if (masRes0.length > 0) {
        if (typeof masRes0[0].srcBill != "undefined" && masRes0[0].srcBill != null) {
          let masterSql1 = "select * from pu.purchaseorder.PurchaseOrder where id=" + masRes0[0].srcBill;
          let masRes1 = ObjectStore.queryByYonQL(masterSql1, "upu");
          let masterSql2 = "select * from pu.arrivalorder.ArrivalOrder where srcBill=" + masRes1[0].id;
          let masRes2 = ObjectStore.queryByYonQL(masterSql2, "upu");
          let masterSql3 = "select * from st.purinrecord.PurInRecord where srcBill=" + masRes2[0].id;
          let masRes3 = ObjectStore.queryByYonQL(masterSql3);
          let saleWithGoods = masRes3[0].extend_sale_with_goods;
          masRes[0].saleWithGoods = saleWithGoods;
        } else {
          let masterSql3 = "select * from st.purinrecord.PurInRecord where srcBill=" + masRes0[0].id;
          let masRes3 = ObjectStore.queryByYonQL(masterSql3);
          let saleWithGoods = masRes3[0].extend_sale_with_goods;
          masRes[0].saleWithGoods = saleWithGoods;
        }
      } else {
        let masterSql3 = "select * from st.purinrecord.PurInRecord where srcBill=" + masRes0[0].id;
        let masRes3 = ObjectStore.queryByYonQL(masterSql3);
        let saleWithGoods = masRes3[0].extend_sale_with_goods;
        masRes[0].saleWithGoods = saleWithGoods;
      }
      //采购入库子表（逆向查询）
      let mapObj = {};
      mapObj["mainid"] = masterId[i];
      let entryInfo = ObjectStore.selectByMap("st.purinrecord.PurInRecords", mapObj);
      let entryInfoList = [];
      for (let j = 0; j < entryInfo.length; j++) {
        if (entryInfo[j].qty > 0) {
          break;
        }
        if (entryInfo[j].qty < 0) {
          let wheresql = " And id=" + entryInfo[j].product;
          let proListSql = "select * from  pc.product.Product where 1=1 " + wheresql;
          let proListRes = ObjectStore.queryByYonQL(proListSql, "productcenter");
          entryInfo[j]["extend_package_specification"] = proListRes[0].extend_package_specification;
          entryInfo[j]["extend_bwm"] = proListRes[0].extend_standard_code;
          entryInfoList.push(entryInfo[j]);
          isHave = "true";
        }
      }
      if (isHave) {
        masRes[0].entryInfo = entryInfoList;
        masterRes.push(masRes[0]);
      }
    }
    return { masterRes };
  }
}
exports({ entryPoint: MyAPIHandler });