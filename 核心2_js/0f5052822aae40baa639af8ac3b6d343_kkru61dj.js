let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterObject = { id: request.id };
    let masterRes = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_qualified_supply", masterObject);
    let baseInfo = masterRes[0];
    if (typeof baseInfo == "undefined") {
      return { data: baseInfo };
    }
    let id = baseInfo.id;
    let subObject = { SY01_qualified_supply_id: id };
    baseInfo.productList = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_apply_pro", subObject);
    baseInfo.license = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_licences", subObject);
    baseInfo.attorney = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_attorney", subObject);
    let orgId = baseInfo.org_id;
    let sId = baseInfo.supplierCode;
    let expiredLicence = [];
    for (let j = 0; j < baseInfo.license.length; j++) {
      let licenseMasId = baseInfo.license[j].id;
      let authLicenceId = baseInfo.license[j].licenseId;
      let type = "证照";
      let url = "ISY_2.ISY_2.SY01_supply_qualify_licence";
      let childUrl = "ISY_2.ISY_2.SY01_supply_licence_child";
      let upOrderId = "yourIdHere";
      let paramObj = { authLicenceId, orgId, sId, type, url, childUrl, upOrderId };
      let licenceInfo = extrequire("ISY_2.public.getSunInfoList").execute(paramObj);
      let licenceRes = licenceInfo.licenceRes;
      if (typeof licenceRes == "undefined" || licenceRes == null) {
        licenceRes == [];
      }
      if (licenceRes.length == 0) {
        continue;
      } else {
        for (let l = 0; l < licenceRes[0].licenceChildRes.length; l++) {
          let validUntil = licenceRes[0].validUntil;
          if (validUntil == {} || typeof validUntil == "undefined" || validUntil == null) {
            expiredLicence.push("编码为:[" + licenceRes[0].code + "] 的供应商资质证照已过期");
            continue;
          }
          let date = new Date(validUntil);
          let nowDate = new Date();
          let diffValue = Math.floor((date - nowDate) / (1000 * 60 * 60 * 24));
          if (diffValue < 0) {
            expiredLicence.push("编码为:[" + licenceRes[0].code + "] 的供应商资质证照已过期");
            continue;
          }
          baseInfo.license[j].licenceCode_code = licenceRes[0].code;
          baseInfo.license[j].licenceName = licenceRes[0].licenceName;
          baseInfo.license[j].effectiveDate = licenceRes[0].effectiveDate;
          baseInfo.license[j].validUntil = licenceRes[0].validUntil;
          let sonObject = { SY01_supply_licences_id: baseInfo.license[j].id }; //SY01_supply_licence_child_id
          baseInfo.license[j].range = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_licences_range", sonObject); //ISY_2.ISY_2.SY01_supply_licence_sun
          for (let k = 0; k < baseInfo.license[j].range.length; k++) {
            if (licenceRes[0].licenceChildRes[l].authType == "1" && licenceRes[0].licenceChildRes[l].authType == baseInfo.license[j].range[k].authType) {
              baseInfo.license[j].range[k].authType = "1";
              let materialId = baseInfo.license[j].range[k].authProduct;
              let paramObj = { orgId, materialId };
              let productInfo = extrequire("ISY_2.public.getProduct").execute(paramObj);
              let merchantInfo = productInfo.merchantInfo;
              baseInfo.license[j].range[k].productName = merchantInfo.name;
            } else if (licenceRes[0].licenceChildRes[l].authType == "2" && licenceRes[0].licenceChildRes[l].authType == baseInfo.license[j].range[k].authType) {
              baseInfo.license[j].range[k].authType = "2";
              let productTypeSql = "select * from GT22176AT10.GT22176AT10.SY01_custcatagoryv3 where id = " + baseInfo.license[j].range[k].authProductType;
              let productTypeRes = ObjectStore.queryByYonQL(productTypeSql, "sy01");
              baseInfo.license[j].range[k].productTypeName = productTypeRes[0].name;
            } else if (licenceRes[0].licenceChildRes[l].authType == "3" && licenceRes[0].licenceChildRes[l].authType == baseInfo.license[j].range[k].authType) {
              baseInfo.license[j].range[k].authType = "3";
              let dosageSql = "select * from GT22176AT10.GT22176AT10.SY01_dosagaformv1 where id = " + baseInfo.license[j].range[k].authDosageForm;
              let dosageRes = ObjectStore.queryByYonQL(dosageSql, "sy01");
              baseInfo.license[j].range[k].dosagaFormName = dosageRes[0].dosagaFormName;
            } else if (licenceRes[0].licenceChildRes[l].authType == "4" && licenceRes[0].licenceChildRes[l].authType == baseInfo.license[j].range[k].authType) {
              baseInfo.license[j].range[k].authType = "4";
              let materialId = baseInfo.license[j].range[k].authProduct;
              let proSkuId = baseInfo.license[j].range[k].authSku;
              let paramObj = { orgId, materialId };
              let productInfo = extrequire("ISY_2.public.getProduct").execute(paramObj);
              let productskus = productInfo.merchantInfo;
              if (typeof productskus != "undefined" && productskus != null) {
                for (let l = 0; l < productskus.length; l++) {
                  if (productskus[l].id == proSkuId) {
                    baseInfo.license[j].range[k].skuName = productskus[l].name;
                  }
                }
              }
            }
          }
        }
      }
    }
    for (let j = 0; j < baseInfo.attorney.length; j++) {
      let attorney = baseInfo.attorney;
      let attorneyId = baseInfo.attorney[j].id;
      let type = "授权委托书";
      let url = "ISY_2.ISY_2.SY01_personal_licensen";
      let childUrl = "ISY_2.ISY_2.SY01_personal_licensen_child";
      let upOrderId = "yourIdHere";
      let authLicenceId = request.salesmanId;
      if (typeof authLicenceId == "undefined" || authLicenceId == null) {
        continue;
      }
      let paramObj = { authLicenceId, orgId, sId, type, url, childUrl, upOrderId };
      let licenceInfo = extrequire("ISY_2.public.getSunInfoList").execute(paramObj);
      let licenceRes = licenceInfo.licenceRes;
      if (typeof licenceRes == "undefined" || licenceRes == null) {
        licenceRes == [];
      }
      if (licenceRes.length == 0) {
        continue;
      }
      for (let l = 0; l < licenceRes[0].licenceChildRes.length; l++) {
        let validUntil = licenceRes[0].validUntil;
        if (validUntil == {} || typeof validUntil == "object" || typeof validUntil == "undefined" || validUntil == null) {
          expiredLicence.push("编码为:[" + licenceRes[0].code + "] 的人员证照已过期");
          continue;
        }
        let date = new Date(validUntil);
        let nowDate = new Date();
        let diffValue = Math.floor((date - nowDate) / (1000 * 60 * 60 * 24));
        if (diffValue < 0) {
          expiredLicence.push("编码为:[" + licenceRes[0].code + "] 的人员证照已过期");
          continue;
        }
        baseInfo.attorney[j].authorizerCode_code = licenceRes[0].code;
        baseInfo.attorney[j].authorizerName = licenceRes[0].clientName;
        baseInfo.attorney[j].effectiveDate = licenceRes[0].effectiveDate;
        baseInfo.attorney[j].validUntil = licenceRes[0].validUntil;
        baseInfo.attorney[j].idCard = licenceRes[0].idCard;
        let sonObject = { SY01_supply_attorney_id: baseInfo.attorney[j].id }; //SY01_personal_licensen_child_id
        baseInfo.attorney[j].range = ObjectStore.selectByMap("ISY_2.ISY_2.SY01_supply_attorney_range", sonObject); //ISY_2.ISY_2.SY01_personal_licensen_sun
        for (let k = 0; k < baseInfo.attorney[j].range.length; k++) {
          if (licenceRes[0].licenceChildRes[l].authType == "1" && licenceRes[0].licenceChildRes[l].authType == baseInfo.attorney[j].range[k].authType) {
            baseInfo.attorney[j].range[k].authType = "1";
            let materialId = baseInfo.attorney[j].range[k].authProduct;
            let paramObj = { orgId, materialId };
            let productInfo = extrequire("ISY_2.public.getProduct").execute(paramObj);
            let merchantInfo = productInfo.merchantInfo;
            baseInfo.attorney[j].range[k].productName = merchantInfo.name;
          } else if (licenceRes[0].licenceChildRes[l].authType == "2" && licenceRes[0].licenceChildRes[l].authType == baseInfo.attorney[j].range[k].authType) {
            baseInfo.attorney[j].range[k].authType = "2";
            let productTypeSql = "select * from GT22176AT10.GT22176AT10.SY01_custcatagoryv3 where id = " + baseInfo.attorney[j].range[k].authProductType;
            let productTypeRes = ObjectStore.queryByYonQL(productTypeSql, "sy01");
            baseInfo.attorney[j].range[k].productTypeName = productTypeRes[0].name;
          } else if (licenceRes[0].licenceChildRes[l].authType == "3" && licenceRes[0].licenceChildRes[l].authType == baseInfo.attorney[j].range[k].authType) {
            baseInfo.attorney[j].range[k].authType = "3";
            let dosageSql = "select * from GT22176AT10.GT22176AT10.SY01_dosagaformv1 where id = " + baseInfo.attorney[j].range[k].authDosageForm;
            let dosageRes = ObjectStore.queryByYonQL(dosageSql, "sy01");
            baseInfo.attorney[j].range[k].dosagaFormName = dosageRes[0].dosagaFormName;
          } else if (licenceRes[0].licenceChildRes[l].authType == "4" && licenceRes[0].licenceChildRes[l].authType == baseInfo.attorney[j].range[k].authType) {
            baseInfo.attorney[j].range[k].authType = "4";
            let materialId = baseInfo.attorney[j].range[k].authProduct;
            let proSkuId = baseInfo.attorney[j].range[k].authSku;
            let paramObj = { orgId, materialId };
            let productInfo = extrequire("ISY_2.public.getProduct").execute(paramObj);
            let productskus = productInfo.merchantInfo;
            if (typeof productskus != "undefined" && productskus != null) {
              for (let l = 0; l < productskus.length; l++) {
                if (productskus[l].id == proSkuId) {
                  baseInfo.attorney[j].range[k].skuName = productskus[l].name;
                }
              }
            }
          }
        }
      }
    }
    if (expiredLicence.length > 0) {
      throw new Error(JSON.stringify(expiredLicence));
    }
    for (let i = 0; i < baseInfo.productList.length; i++) {
      let orgId = baseInfo.org_id;
      let materialId = baseInfo.productList[i].productCode;
      let paramObj = { orgId, materialId };
      let productListInfo = extrequire("ISY_2.public.getProduct").execute(paramObj);
      let merchantInfo = productListInfo.merchantInfo;
      baseInfo.productList[i].productCode_code = merchantInfo.code;
    }
    return { data: baseInfo };
  }
}
exports({ entryPoint: MyAPIHandler });