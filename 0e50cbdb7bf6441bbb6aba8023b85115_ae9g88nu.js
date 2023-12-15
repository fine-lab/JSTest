let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = JSON.parse(param.requestData);
    let requestDataObject = {};
    if (requestData.constructor == Array) {
      requestDataObject = requestData[0];
    } else {
      requestDataObject = requestData;
    }
    // 获取共供应商资质变更单主表信息
    let sql = "select * from ISY_2.ISY_2.SY01_supply_change_order where id =" + requestDataObject.id;
    let result = ObjectStore.queryByYonQL(sql);
    let baseInfo = result[0];
    //获取证照信息
    const license_sub_sql = "select * from ISY_2.ISY_2.SY01_supply_change_licence where SY01_supply_change_order_id =" + requestDataObject.id;
    baseInfo.license = ObjectStore.queryByYonQL(license_sub_sql);
    for (let i = 0; i < baseInfo.license.length; i++) {
      let license_id = baseInfo.license[i].id;
      let license_sun_sql = "select * from ISY_2.ISY_2.SY01_supply_change_licencesun where SY01_supply_change_licence_id =" + license_id;
      baseInfo.license[i].sunlist = ObjectStore.queryByYonQL(license_sun_sql);
    }
    //获取人员证照信息
    const attorney_sub_sql = "select * from ISY_2.ISY_2.SY01_supply_change_sqwts where SY01_supply_change_order_id =" + requestDataObject.id;
    baseInfo.attorney = ObjectStore.queryByYonQL(attorney_sub_sql);
    for (let i = 0; i < baseInfo.attorney.length; i++) {
      let attorney_id = baseInfo.attorney[i].id;
      let attorney_sun_sql = "select * from ISY_2.ISY_2.SY01_supply_change_sqwtssun where SY01_supply_change_sqwts_id =" + attorney_id;
      baseInfo.attorney[i].sunlist = ObjectStore.queryByYonQL(attorney_sun_sql);
    }
    //获取产品信息
    const product_sub_sql = "select * from ISY_2.ISY_2.SY01_supply_change_product where SY01_supply_change_order_id =" + requestDataObject.id;
    baseInfo.product_list = ObjectStore.queryByYonQL(product_sub_sql);
    let insert_base_object = {};
    insert_base_object.id = baseInfo.relationId;
    insert_base_object.org_id = baseInfo.org_id;
    insert_base_object.org_id_name = baseInfo.org_id.name;
    insert_base_object.supplierCode = baseInfo.supplierCode;
    insert_base_object.supplierName = baseInfo.supplierName;
    insert_base_object.productCode = baseInfo.productCode;
    insert_base_object.productName = baseInfo.productName;
    insert_base_object.skuCode = baseInfo.skuCode;
    insert_base_object.skuName = baseInfo.skuName;
    insert_base_object.proCode = baseInfo.proCode;
    insert_base_object.proName = baseInfo.proName;
    insert_base_object.description = baseInfo.description;
    insert_base_object.model = baseInfo.model;
    insert_base_object.manufacturer = baseInfo.manufacturer;
    insert_base_object.changeNo = baseInfo.code;
    //写入预审日期
    insert_base_object.changeDate = baseInfo.billDate;
    insert_base_object.endDate = baseInfo.endDate;
    //写入自由项特征组
    insert_base_object.freeFeatureGroup = baseInfo.freeFeatureGroup;
    //写入合格供应商证照
    let licenseChildObject = [];
    for (let i = 0; i < baseInfo.license.length; i++) {
      let relationId = baseInfo.license[i].relationId;
      let insert_license_object = {};
      let insert_license_sun_object = {};
      if (typeof relationId != "undefined" && typeof relationId != "null") {
        //更新
        insert_license_object.id = relationId;
        insert_license_object.SY01_qualified_supply_id = baseInfo.relationId;
        insert_license_object.licenseId = baseInfo.license[i].licenceCode;
        insert_license_object.remark = baseInfo.license[i].remark;
        insert_license_object.supplierName = baseInfo.license[i].supplierName;
        insert_license_object.supplierCode = baseInfo.license[i].supplierCode;
        insert_license_object._status = "Update";
        let sunIdArr = [];
        for (let k = 0; k < baseInfo.license[i].sunlist.length; k++) {
          let isBreak = false;
          for (let m = 0; m < sunIdArr.length; m++) {
            if (baseInfo.license[i].sunlist[k].id == sunIdArr[m]) {
              baseInfo.license[i].sunlist.splice(k, 1);
              k--;
              isBreak = true;
              break;
            }
          }
          if (isBreak) {
            break;
          }
          let sunRelationId = baseInfo.license[i].sunlist[k].relationId;
          if (typeof sunRelationId != "undefined" && typeof sunRelationId != "null") {
            let licenseSunObject = [];
            insert_license_sun_object.id = sunRelationId;
            insert_license_sun_object.authProduct = baseInfo.license[i].sunlist[k].authProduct;
            insert_license_sun_object.authProductType = baseInfo.license[i].sunlist[k].authProductType;
            insert_license_sun_object.authDosageForm = baseInfo.license[i].sunlist[k].authDosageForm;
            insert_license_sun_object.authSku = baseInfo.license[i].sunlist[k].authSku;
            insert_license_sun_object.authType = baseInfo.license[i].sunlist[k].authType;
            insert_license_sun_object.authFeatures = baseInfo.license[i].sunlist[k].authFeatures;
            insert_license_sun_object._status = "Update";
            licenseSunObject.push(insert_license_sun_object);
            insert_license_object.SY01_supply_licences_rangeList = licenseSunObject;
          } else {
            let licenseSunObject = [];
            insert_license_sun_object.authProduct = baseInfo.license[i].sunlist[k].authProduct;
            insert_license_sun_object.authProductType = baseInfo.license[i].sunlist[k].authProductType;
            insert_license_sun_object.authDosageForm = baseInfo.license[i].sunlist[k].authDosageForm;
            insert_license_sun_object.authSku = baseInfo.license[i].sunlist[k].authSku;
            insert_license_sun_object.authFeatures = baseInfo.license[i].sunlist[k].authFeatures;
            insert_license_sun_object._status = "Insert";
            licenseSunObject.push(insert_license_sun_object);
            insert_license_object.SY01_supply_licences_rangeList = licenseSunObject;
          }
          sunIdArr.push(baseInfo.license[i].sunlist[k].id);
        }
        licenseChildObject.push(insert_license_object);
        continue;
      } else {
        //新增
        let licenseSunObject = [];
        insert_license_object.licenseId = baseInfo.license[i].licenceCode;
        insert_license_object.remark = baseInfo.license[i].remark;
        insert_license_object.supplierName = baseInfo.license[i].supplierName;
        insert_license_object.supplierCode = baseInfo.license[i].supplierCode;
        insert_license_object._status = "Insert";
        let sunIdArr = [];
        for (let k = 0; k < baseInfo.license[i].sunlist.length; k++) {
          let sunRelationId1 = baseInfo.license[i].sunlist[k].relationId;
          if (typeof sunRelationId1 != "undefined" && sunRelationId1 != null) {
            continue;
          }
          let isBreak = false;
          for (let m = 0; m < sunIdArr.length; m++) {
            if (baseInfo.license[i].sunlist[k].id == sunIdArr[m]) {
              baseInfo.license[i].sunlist.splice(k, 1);
              k--;
              isBreak = true;
              break;
            }
          }
          if (isBreak) {
            break;
          }
          insert_license_sun_object.authProduct = baseInfo.license[i].sunlist[k].authProduct;
          insert_license_sun_object.authType = baseInfo.license[i].sunlist[k].authType;
          insert_license_sun_object.authProductType = baseInfo.license[i].sunlist[k].authProductType;
          insert_license_sun_object.authDosageForm = baseInfo.license[i].sunlist[k].authDosageForm;
          insert_license_sun_object.authSku = baseInfo.license[i].sunlist[k].authSku;
          insert_license_sun_object.authFeatures = baseInfo.license[i].sunlist[k].authFeatures;
          insert_license_sun_object._status = "Insert";
          licenseSunObject.push(insert_license_sun_object);
          insert_license_object.SY01_supply_licences_rangeList = licenseSunObject;
          sunIdArr.push(baseInfo.license[i].sunlist[k].id);
        }
        licenseChildObject.push(insert_license_object);
        continue;
      }
    }
    insert_base_object.SY01_supply_licencesList = licenseChildObject;
    let attorneyChildObject = [];
    //写入合格供应商委托书
    for (let i = 0; i < baseInfo.attorney.length; i++) {
      let insert_attorney_object = {};
      let insert_attorney_sun_object = {};
      let relationId = baseInfo.attorney[i].relationId;
      if (typeof relationId != "undefined" && typeof relationId != "null") {
        insert_attorney_object.id = relationId;
        insert_attorney_object.SY01_qualified_supply_id = baseInfo.relationId;
        insert_attorney_object.authorizerCode = baseInfo.attorney[i].authorizerCode;
        insert_attorney_object._status = "Update";
        let sunIdArr = [];
        for (let k = 0; k < baseInfo.attorney[i].sunlist.length; k++) {
          let isBreak = false;
          for (let m = 0; m < sunIdArr.length; m++) {
            if (baseInfo.attorney[i].sunlist[k].id == sunIdArr[m]) {
              baseInfo.attorney[i].sunlist.splice(k, 1);
              k--;
              isBreak = true;
              break;
            }
          }
          if (isBreak) {
            break;
          }
          let sunRelationId = baseInfo.attorney[i].sunlist[k].relationId;
          if (typeof sunRelationId != "undefined" && typeof sunRelationId != "null") {
            let attorneySunObject = [];
            if (baseInfo.attorney[i].sunlist[k].authType == "1" || baseInfo.attorney[i].sunlist[k].authType == 1) {
              insert_attorney_sun_object.id = sunRelationId;
              insert_attorney_sun_object.authProduct = baseInfo.attorney[i].sunlist[k].authProduct;
              insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[k].authType;
              insert_attorney_sun_object._status = "Update";
              attorneySunObject.push(insert_attorney_sun_object);
            } else if (baseInfo.attorney[i].sunlist[k].authType == "2" || baseInfo.attorney[i].sunlist[k].authType == 2) {
              insert_attorney_sun_object.id = sunRelationId;
              insert_attorney_sun_object.authProductType = baseInfo.attorney[i].sunlist[k].authProductType;
              insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[k].authType;
              insert_attorney_sun_object._status = "Update";
              attorneySunObject.push(insert_attorney_sun_object);
            } else if (baseInfo.attorney[i].sunlist[k].authType == "3" || baseInfo.attorney[i].sunlist[k].authType == 3) {
              insert_attorney_sun_object.id = sunRelationId;
              insert_attorney_sun_object.authDosageForm = baseInfo.attorney[i].sunlist[k].authDosageForm;
              insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[k].authType;
              insert_attorney_sun_object._status = "Update";
              attorneySunObject.push(insert_attorney_sun_object);
            } else if (baseInfo.attorney[i].sunlist[k].authType == "4" || baseInfo.attorney[i].sunlist[k].authType == 4) {
              insert_attorney_sun_object.id = sunRelationId;
              insert_attorney_sun_object.authProduct = baseInfo.attorney[i].sunlist[k].authProduct;
              insert_attorney_sun_object.authSku = baseInfo.attorney[i].sunlist[k].authSku;
              insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[k].authType;
              insert_attorney_sun_object._status = "Update";
              attorneySunObject.push(insert_attorney_sun_object);
            } else if (baseInfo.attorney[i].sunlist[k].authType == "5" || baseInfo.attorney[i].sunlist[k].authType == 5) {
              insert_attorney_sun_object.id = sunRelationId;
              insert_attorney_sun_object.authProduct = baseInfo.attorney[i].sunlist[k].authProduct;
              insert_attorney_sun_object.authFeatures = baseInfo.attorney[i].sunlist[k].authFeatures;
              insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[k].authType;
              insert_attorney_sun_object._status = "Update";
              attorneySunObject.push(insert_attorney_sun_object);
            }
            insert_attorney_object.SY01_supply_attorney_rangeList = attorneySunObject;
            continue;
          } else {
            let attorneySunObject = [];
            insert_attorney_sun_object.authProduct = baseInfo.attorney[i].sunlist[k].authProduct;
            insert_attorney_sun_object.authProductType = baseInfo.attorney[i].sunlist[k].authProductType;
            insert_attorney_sun_object.authDosageForm = baseInfo.attorney[i].sunlist[k].authDosageForm;
            insert_attorney_sun_object.authSku = baseInfo.attorney[i].sunlist[k].authSku;
            insert_attorney_sun_object.authFeatures = baseInfo.attorney[i].sunlist[k].authFeatures;
            insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[k].authType;
            insert_attorney_sun_object._status = "Insert";
            attorneySunObject.push(insert_attorney_sun_object);
            insert_attorney_object.SY01_supply_attorney_rangeList = attorneySunObject;
            continue;
          }
          sunIdArr.push(baseInfo.attorney[i].sunlist[k].id);
        }
        attorneyChildObject.push(insert_attorney_object);
      } else {
        let attorneySunObject = [];
        insert_attorney_object.authorizerCode = baseInfo.attorney[i].authorizerCode;
        insert_attorney_object._status = "Insert";
        let sunIdArr = [];
        for (let k = 0; k < baseInfo.attorney[i].sunlist.length; k++) {
          let sunRelationId1 = baseInfo.attorney[i].sunlist[k].relationId;
          if (typeof sunRelationId1 != "undefined" && sunRelationId1 != null) {
            continue;
          }
          let isBreak = false;
          for (let m = 0; m < sunIdArr.length; m++) {
            if (baseInfo.attorney[i].sunlist[k].id == sunIdArr[m]) {
              baseInfo.attorney[i].sunlist.splice(k, 1);
              k--;
              isBreak = true;
              break;
            }
          }
          if (isBreak) {
            break;
          }
          insert_attorney_sun_object.authProduct = baseInfo.attorney[i].sunlist[k].authProduct;
          insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[k].authType;
          insert_attorney_sun_object.authProductType = baseInfo.attorney[i].sunlist[k].authProductType;
          insert_attorney_sun_object.authDosageForm = baseInfo.attorney[i].sunlist[k].authDosageForm;
          insert_attorney_sun_object.authSku = baseInfo.attorney[i].sunlist[k].authSku;
          insert_attorney_sun_object.authFeatures = baseInfo.attorney[i].sunlist[k].authFeatures;
          insert_attorney_sun_object._status = "Insert";
          attorneySunObject.push(insert_attorney_sun_object);
          insert_attorney_object.SY01_supply_attorney_rangeList = attorneySunObject;
          sunIdArr.push(baseInfo.attorney[i].sunlist[k].id);
        }
        attorneyChildObject.push(insert_attorney_object);
      }
    }
    insert_base_object.SY01_supply_attorneyList = attorneyChildObject;
    let productChildObject = [];
    //写入适用产品
    let productIdArr = [];
    for (let i = 0; i < baseInfo.product_list.length; i++) {
      let insert_product_object = {};
      let relationId = baseInfo.product_list[i].relationId;
      if (typeof relationId != "undefined" && typeof relationId != "null") {
        //更新
        insert_product_object.id = relationId;
        insert_product_object.SY01_qualified_supply_id = baseInfo.relationId;
        insert_product_object.productCode = baseInfo.product_list[i].productCode;
        insert_product_object.productName = baseInfo.product_list[i].productName;
        insert_product_object.description = baseInfo.product_list[i].description;
        insert_product_object.model = baseInfo.product_list[i].model;
        insert_product_object.manufacturer = baseInfo.product_list[i].manufacturer;
        insert_product_object._status = "Update";
        productChildObject.push(insert_product_object);
      } else {
        //新增
        let isBreak = false;
        for (let m = 0; m < productIdArr.length; m++) {
          if (baseInfo.product_list[i].id == productIdArr[m]) {
            baseInfo.product_list.splice(k, 1);
            k--;
            isBreak = true;
            break;
          }
        }
        if (isBreak) {
          break;
        }
        insert_product_object.productCode = baseInfo.product_list[i].productCode;
        insert_product_object.productName = baseInfo.product_list[i].productName;
        insert_product_object.description = baseInfo.product_list[i].description;
        insert_product_object.model = baseInfo.product_list[i].model;
        insert_product_object.manufacturer = baseInfo.product_list[i].manufacturer;
        insert_product_object._status = "Insert";
        productIdArr.push(baseInfo.product_list[i].id);
        productChildObject.push(insert_product_object);
      }
    }
    insert_base_object.SY01_supply_apply_proList = productChildObject;
    let baseObject = insert_base_object;
    let res = ObjectStore.updateById("ISY_2.ISY_2.SY01_qualified_supply", baseObject, "8b394bfb");
  }
}
exports({ entryPoint: MyTrigger });