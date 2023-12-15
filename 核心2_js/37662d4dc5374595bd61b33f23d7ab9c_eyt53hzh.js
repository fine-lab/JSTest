let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let proId = [];
    let skuId = [];
    //预审单主表
    let masterSql = "select * from ISY_2.ISY_2.SY01_supply_pre_hear_sheet where org_id=" + '"' + request.orgId + '"' + " and supplierCode=" + '"' + request.supplierCode + '"';
    let masterRes = ObjectStore.queryByYonQL(masterSql);
    if (masterRes.length > 0) {
      for (let i = 0; i < masterRes.length; i++) {
        if (request.type == "主表物料") {
          proId.push(masterRes[i].productCode);
        }
        if (request.type == "证照范围") {
          //预审单证照子表
          let licenceChildObject = { SY01_supply_pre_hear_sheet_id: masterRes[i].id };
          let licenceChildRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_licence", licenceChildObject);
          if (licenceChildRes.length > 0) {
            for (let j = 0; j < licenceChildRes.length; j++) {
              //预审单证照孙表
              let licenceSunObject = { SY01_supply_licence_id: licenceChildRes[j].id };
              let licenceSunRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_auth_scope2", licenceSunObject);
              if (licenceSunRes.length > 0) {
                for (let k = 0; k < licenceSunRes.length; k++) {
                  if (licenceSunRes[k].authType == "1") {
                    if (typeof licenceSunRes[k].authProduct != "null" && typeof licenceSunRes[k].authProduct != "undefined") {
                      proId.push(licenceSunRes[k].authProduct);
                    }
                  } else if (licenceSunRes[k].authType == "4") {
                    if (typeof licenceSunRes[k].authProduct != "null" && typeof licenceSunRes[k].authProduct != "undefined") {
                      proId.push(licenceSunRes[k].authProduct);
                    }
                    if (typeof licenceSunRes[k].authSku != "null" && typeof licenceSunRes[k].authSku != "undefined") {
                      skuId.push(licenceSunRes[k].authSku);
                    }
                  }
                }
              }
            }
          }
        }
        if (request.type == "授权委托书范围") {
          //预审单授权委托书子表
          let sqwtsChildObject = { SY01_supply_pre_hear_sheet_id: masterRes[i].id };
          let sqwtsChildRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_power_attorney", sqwtsChildObject);
          if (sqwtsChildRes.length > 0) {
            for (let j = 0; j < sqwtsChildRes.length; j++) {
              //预审单授权委托书孙表
              let sqwtsSunObject = { SY01_supply_power_attorney_id: sqwtsChildRes[j].id };
              let sqwtsSunRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_auth_scope1", sqwtsSunObject);
              if (sqwtsSunRes.length > 0) {
                for (let k = 0; k < sqwtsSunRes.length; k++) {
                  if (sqwtsSunRes[k].authType == "1") {
                    if (typeof sqwtsSunRes[k].authProduct != "null" && typeof sqwtsSunRes[k].authProduct != "undefined") {
                      proId.push(sqwtsSunRes[k].authProduct);
                    }
                  } else if (sqwtsSunRes[k].authType == "4") {
                    if (typeof sqwtsSunRes[k].authProduct != "null" && typeof sqwtsSunRes[k].authProduct != "undefined") {
                      proId.push(sqwtsSunRes[k].authProduct);
                    }
                    if (typeof sqwtsSunRes[k].authSku != "null" && typeof sqwtsSunRes[k].authSku != "undefined") {
                      skuId.push(sqwtsSunRes[k].authSku);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    let object = { proId: proId, skuId: skuId };
    return { object };
  }
}
exports({ entryPoint: MyAPIHandler });