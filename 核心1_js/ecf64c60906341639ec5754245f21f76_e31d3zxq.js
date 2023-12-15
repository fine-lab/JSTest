let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterId = request.masterId;
    let vendor_name = request.vendor_name;
    let masterRes = [];
    let str_masterId = masterId.join(",");
    //采购入库（逆向查询）
    let masResSrcBill = [];
    let masResStockMgr = [];
    let masterSql = "select * from st.purinrecord.PurInRecord where id in (" + str_masterId + ")";
    let masRes = ObjectStore.queryByYonQL(masterSql);
    if (masRes.length > 0) {
      for (let i = 0; i < masRes.length; i++) {
        masRes[i].vendor_name = vendor_name[masRes[i].id];
        if (typeof masRes[i].srcBill != "undefined" && masRes[i].srcBill != null) {
          masResSrcBill.push(masRes[i].srcBill);
        }
        if (typeof masRes[i].stockMgr != "undefined" && masRes[i].stockMgr != null) {
          masResStockMgr.push(masRes[i].stockMgr);
        }
      }
    }
    let str_masResSrcBill = masResSrcBill.join(",");
    let str_masResStockMgr = masResStockMgr.join(",");
    //获取人员名称
    let salasName = {};
    let salsaSql = "";
    if (str_masResStockMgr.length > 10) {
      salsaSql = "select name from aa.operator.OperatorForVendor where id in (" + str_masResStockMgr + ")";
    } else {
      salsaSql = "select name from aa.operator.OperatorForVendor";
    }
    let salasRes = ObjectStore.queryByYonQL(salsaSql, "productcenter");
    if (salasRes.length > 0) {
      for (let i = 0; i < salasRes.length; i++) {
        if (!salasName.hasOwnProperty(salasRes[i].id)) {
          salasName[salasRes[i].id] = salasRes[i];
        }
      }
    }
    //采购订单（逆向查询）
    let masRes0SrcBill = [];
    let masterSql0 = "";
    if (str_masResSrcBill.length > 10) {
      masterSql0 = "select * from pu.purchaseorder.PurchaseOrder where id in (" + str_masResSrcBill + ")";
    } else {
      masterSql0 = "select * from pu.purchaseorder.PurchaseOrder";
    }
    let masRes0 = ObjectStore.queryByYonQL(masterSql0, "upu");
    if (masRes0.length > 0) {
      for (let i = 0; i < masRes0.length; i++) {
        if (typeof masRes0[i].srcBill != "undefined" && masRes0[i].srcBill != null) {
          masRes0SrcBill.push(masRes0[i].srcBill);
        }
      }
    }
    let str_masRes0SrcBill = masRes0SrcBill.join(",");
    //采购订单（正向查询）
    let masRes1IdArr = [];
    let masterSql1 = "";
    if (str_masRes0SrcBill.length > 10) {
      masterSql1 = "select * from pu.purchaseorder.PurchaseOrder where id in (" + str_masRes0SrcBill + ")";
    } else {
      masterSql1 = "select * from pu.purchaseorder.PurchaseOrder";
    }
    let masRes1 = ObjectStore.queryByYonQL(masterSql1, "upu");
    if (masRes1.length > 0) {
      for (let i = 0; i < masRes1.length; i++) {
        if (typeof masRes1[i].id != "undefined" && masRes1[i].id != null) {
          masRes1IdArr.push(masRes1[i].id);
        }
      }
    }
    let str_masRes1IdArr = masRes1IdArr.join(",");
    //到货单查询
    let masRes2IdArr = [];
    let masterSql2 = "";
    if (str_masRes1IdArr.length > 10) {
      masterSql2 = "select * from pu.arrivalorder.ArrivalOrder where srcBill in (" + str_masRes1IdArr + ")";
    } else {
      masterSql2 = "select * from pu.arrivalorder.ArrivalOrder";
    }
    let masRes2 = ObjectStore.queryByYonQL(masterSql2, "upu");
    if (masRes2.length > 0) {
      for (let i = 0; i < masRes2.length; i++) {
        if (typeof masRes2[i].id != "undefined" && masRes2[i].id != null) {
          masRes2IdArr.push(masRes2[i].id);
        }
      }
    }
    let str_masRes2IdArr = masRes2IdArr.join(",");
    let saleWithGoodsObj = {};
    let masterSql3 = "";
    if (str_masRes2IdArr.length > 10) {
      masterSql3 = "select * from st.purinrecord.PurInRecord where srcBill in (" + str_masRes2IdArr + ")";
    } else {
      masterSql3 = "select * from st.purinrecord.PurInRecord";
    }
    let masRes3 = ObjectStore.queryByYonQL(masterSql3, "ustock");
    if (masRes3.length > 0) {
      for (let i = 0; i < masRes3.length; i++) {
        if (!saleWithGoodsObj.hasOwnProperty(masRes3[i].id)) {
          saleWithGoodsObj[masRes3.id] = masRes3[i].extend_sale_with_goods;
        }
      }
    }
    //采购入库子表（逆向查询）
    let productArr = [];
    let childMapSql = "select * from st.purinrecord.PurInRecords where mainid in (" + str_masterId + ")";
    let entryInfo = ObjectStore.queryByYonQL(childMapSql, "ustock");
    if (entryInfo.length > 0) {
      for (let i = 0; i < entryInfo.length; i++) {
        if (typeof entryInfo[i].product != "undefined" && entryInfo[i].product != null) {
          productArr.push(entryInfo[i].product);
        }
      }
    }
    let str_productArr = productArr.join(",");
    //查询医药物料信息
    let materialFile = {};
    let proListSql = "";
    if (str_productArr.length > 10) {
      proListSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where 1=1 And material in (" + str_productArr + ")";
    } else {
      proListSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file";
    }
    let proListRes = ObjectStore.queryByYonQL(proListSql, "sy01");
    for (let i = 0; i < proListRes.length; i++) {
      materialFile[proListRes[i].material] = proListRes[i];
    }
    for (let i = 0; i < masRes.length; i++) {
      let isHave = false;
      if (typeof saleWithGoodsObj[masRes.id] != "undefined" && saleWithGoodsObj[masRes.id] != null) {
        masRes[0].saleWithGoods = saleWithGoodsObj[masRes.id].extend_sale_with_goods;
      }
      let entryInfoList = [];
      for (let j = 0; j < entryInfo.length; j++) {
        if (entryInfo[j].mainid == masRes[i].id) {
          if (entryInfo[j].qty > 0) {
            break;
          }
          if (entryInfo[j].qty < 0) {
            isHave = "true";
            if (typeof materialFile[entryInfo.product] != "undefined" && materialFile[entryInfo.product] != null) {
              if (materialFile[entryInfo[j].product].org_id == masRes[i].accountOrg) {
                entryInfo[j]["extend_package_specification"] = materialFile[entryInfo.product].boxPackSpec;
                entryInfo[j]["extend_bwm"] = materialFile[entryInfo.product].standardCode;
              }
            }
            entryInfoList.push(entryInfo[j]);
          }
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