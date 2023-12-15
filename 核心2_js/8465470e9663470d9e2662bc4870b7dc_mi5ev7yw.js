let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterId = request.masterId;
    let vendor_name = request.vendor_name;
    let str_ids = masterId.join(",");
    let masterRes = [];
    //查询采购入库主表
    let masterSql = "select * from st.purinrecord.PurInRecord where id in (" + str_ids + ")";
    let masRes = ObjectStore.queryByYonQL(masterSql, "ustock");
    let vendorArr = [];
    for (let i = 0; i < masRes.length; i++) {
      if (typeof masRes[i].vendor != "undefined" && masRes[i].vendor != null) {
        let masId = masRes[i].id;
        vendorArr.push(masRes[i].vendor);
        masRes[i].vendor_name = vendor_name[masId];
        masRes[i].vendor_name = vendor_name[masId];
      }
    }
    let str_vendors = vendorArr.join(",");
    //查询采购入库子表
    let mapSql = "select * from st.purinrecord.PurInRecords where mainid in (" + str_ids + ")";
    let entryInfo = ObjectStore.queryByYonQL(mapSql, "ustock");
    let productArr = [];
    for (let i = 0; i < entryInfo.length; i++) {
      if (typeof entryInfo[i].product != "undefined" && entryInfo[i].product != null) {
        productArr.push(entryInfo[i].product);
      }
    }
    let str_products = productArr.join(",");
    //查询GSP医药物料档案
    let proListObj = {};
    let proListSql = "select * from pc.product.Product where 1=1 And id in (" + str_products + ")";
    let proListRes = ObjectStore.queryByYonQL(proListSql, "productcenter");
    for (let i = 0; i < proListRes.length; i++) {
      proListObj[proListRes[i].id] = proListRes[i];
    }
    for (let i = 0; i < masRes.length; i++) {
      let entryInfoArr = [];
      let isHave = false;
      for (let j = 0; j < entryInfo.length; j++) {
        if (entryInfo[j].mainid == masRes[i].id) {
          if (request.type == "采购入库") {
            if (entryInfo[j].qty < 0) {
              break;
            }
          } else if (request.type == "采购退货") {
            if (entryInfo[j].qty > 0) {
              break;
            }
          }
          if (typeof proListObj[entryInfo[j].product] != "undefined" && proListObj[entryInfo[j].product] != null) {
            if (proListObj[entryInfo[j].product].org_id == masRes[i].accountOrg) {
              if (typeof proListObj[entryInfo[j].product].extend_standard_code != "undefined" && proListObj[entryInfo[j].product].extend_standard_code != null) {
                entryInfo[j]["extend_bwm"] = proListObj[entryInfo[j].product].extend_standard_code;
              }
              if (typeof proListObj[entryInfo[j].product].extend_package_specification != "undefined" && proListObj[entryInfo[j].product].extend_package_specification != null) {
                entryInfo[j]["extend_package_specification"] = proListObj[entryInfo[j].product].extend_package_specification;
              }
            } else {
              let applyRangeSql = "select orgId from pc.product.ProductApplyRange where 1=1 And productId = '" + entryInfo[j].product + "'";
              let applyRangeRes = ObjectStore.queryByYonQL(applyRangeSql, "productcenter");
              if (typeof applyRangeRes != "undefined" && applyRangeRes != null) {
                if (applyRangeRes.length > 0) {
                  let orgIdArr = [];
                  for (let k = 0; k < applyRangeRes.length; k++) {
                    orgIdArr.push(applyRangeRes[k].orgId);
                  }
                  let index = orgIdArr.indexOf(masRes[i].accountOrg);
                  if (index != -1) {
                    if (typeof proListObj[entryInfo[j].product].extend_standard_code != "undefined" && proListObj[entryInfo[j].product].extend_standard_code != null) {
                      entryInfo[j]["extend_bwm"] = proListObj[entryInfo[j].product].extend_standard_code;
                    }
                    if (typeof proListObj[entryInfo[j].product].extend_package_specification != "undefined" && proListObj[entryInfo[j].product].extend_package_specification != null) {
                      entryInfo[j]["extend_package_specification"] = proListObj[entryInfo[j].product].extend_package_specification;
                    }
                  }
                }
              }
            }
          }
          entryInfoArr.push(entryInfo[j]);
          isHave = true;
        }
      }
      if (isHave) {
        masRes[i]["entryInfo"] = entryInfoArr;
        masterRes.push(masRes[i]);
      }
    }
    return { masterRes };
  }
}
exports({ entryPoint: MyAPIHandler });