let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestDataObject = param.data;
    // 获取预审单主表信息
    let sql = "select * from ISY_2.ISY_2.SY01_supply_pre_hear_sheet where id = '" + requestDataObject[0].id + "'";
    let result = ObjectStore.queryByYonQL(sql);
    let baseInfo = result[0];
    let insert_base_object = {};
    // 获取物料模板信息
    if (typeof baseInfo.productTemplate != "undefined" && baseInfo.productTemplate != null) {
      let productTplSql = "select * from pc.tpl.ProductTpl where id = '" + baseInfo.productTemplate + "'";
      let productTplRes = ObjectStore.queryByYonQL(productTplSql, "productcenter");
      let productTplInfo = productTplRes[0];
      insert_base_object.productTemplate = baseInfo.productTemplate;
      insert_base_object.productTemplate_name = productTplInfo.name;
    }
    //获取证照信息
    const license_sub_sql = "select * from ISY_2.ISY_2.SY01_supply_licence where SY01_supply_pre_hear_sheet_id = '" + baseInfo.id + "'";
    baseInfo.license = ObjectStore.queryByYonQL(license_sub_sql);
    for (let i = 0; i < baseInfo.license.length; i++) {
      let license_id = baseInfo.license[i].id;
      let license_sun_sql = "select * from ISY_2.ISY_2.SY01_supply_auth_scope2 where SY01_supply_licence_id = '" + license_id + "'";
      baseInfo.license[i].sunlist = ObjectStore.queryByYonQL(license_sun_sql);
    }
    //获取人员证照信息
    const attorney_sub_sql = "select * from 	ISY_2.ISY_2.SY01_supply_power_attorney where SY01_supply_pre_hear_sheet_id = '" + baseInfo.id + "'";
    baseInfo.attorney = ObjectStore.queryByYonQL(attorney_sub_sql);
    for (let i = 0; i < baseInfo.attorney.length; i++) {
      let attorney_id = baseInfo.attorney[i].id;
      let attorney_sun_sql = "select * from ISY_2.ISY_2.SY01_supply_auth_scope1 where SY01_supply_power_attorney_id = '" + attorney_id + "'";
      baseInfo.attorney[i].sunlist = ObjectStore.queryByYonQL(attorney_sun_sql);
    }
    //获取产品信息
    const product_sub_sql = "select * from ISY_2.ISY_2.SY01_supply_apply_product where SY01_supply_pre_hear_sheet_id = '" + baseInfo.id + "'";
    baseInfo.product_list = ObjectStore.queryByYonQL(product_sub_sql);
    let num = "";
    for (let i = 0; i < 6; i++) {
      let radom = Math.floor(Math.random() * 10);
      num += radom;
    }
    let code = "HGGYSQD" + num;
    insert_base_object.org_id = baseInfo.org_id;
    insert_base_object.org_id_name = baseInfo.org_id.name;
    insert_base_object.supplierCode = baseInfo.supplierCode;
    insert_base_object.supplierName = baseInfo.supplierName;
    insert_base_object.productCode = baseInfo.productCode;
    insert_base_object.productName = baseInfo.productName;
    insert_base_object.skuCode = baseInfo.skuCode;
    insert_base_object.skuName = baseInfo.skuName;
    insert_base_object.prelimeReviewOpinion = baseInfo.prelimeReviewOpinion;
    insert_base_object.proCode = baseInfo.proCode;
    insert_base_object.proName = baseInfo.proName;
    insert_base_object.code = code;
    insert_base_object.description = baseInfo.description;
    insert_base_object.model = baseInfo.model;
    insert_base_object.manufacturer = baseInfo.manufacturer;
    insert_base_object.prelimeReviewNo = baseInfo.code;
    //写入预审有效期至
    insert_base_object.endDate = baseInfo.endDate;
    //写入预审日期
    insert_base_object.prelimeReviewDate = baseInfo.billDate;
    insert_base_object.gmpProPerHear = baseInfo.gmpProPerHear;
    //写入自由项特征组
    insert_base_object.freeFeatureGroup = baseInfo.freeFeatureGroup;
    insert_base_object.ytenant = baseInfo.ytenant;
    insert_base_object._status = "Insert";
    //写入合格供应商证照
    let licenseChildObject = [];
    let licenseSunObject = [];
    for (let i = 0; i < baseInfo.license.length; i++) {
      let insert_license_object = {};
      insert_license_object.licenseId = baseInfo.license[i].licenseName;
      insert_license_object.remark = baseInfo.license[i].remark;
      insert_license_object.supplierName = baseInfo.license[i].supplierName;
      insert_license_object.supplierCode = baseInfo.license[i].supplierCode;
      insert_license_object._status = "Insert";
      for (let j = 0; j < baseInfo.license[i].sunlist.length; j++) {
        let insert_license_sun_object = {};
        insert_license_sun_object.authProduct = baseInfo.license[i].sunlist[j].authProduct;
        insert_license_sun_object.authType = baseInfo.license[i].sunlist[j].authType;
        insert_license_sun_object.authProductType = baseInfo.license[i].sunlist[j].authProductType;
        insert_license_sun_object.authDosageForm = baseInfo.license[i].sunlist[j].authDosageForm;
        insert_license_sun_object.authSku = baseInfo.license[i].sunlist[j].authSku;
        insert_license_sun_object.authFeatures = baseInfo.license[i].sunlist[j].authFeatures;
        insert_license_sun_object.ytenant = baseInfo.license[i].sunlist[j].ytenant;
        insert_license_sun_object._status = "Insert";
        licenseSunObject.push(insert_license_sun_object);
      }
      insert_license_object.SY01_supply_licences_rangeList = licenseSunObject;
      licenseChildObject.push(insert_license_object);
    }
    insert_base_object.SY01_supply_licencesList = licenseChildObject;
    let attorneyChildObject = [];
    let attorneySunObject = [];
    //写入合格供应商委托书
    for (let i = 0; i < baseInfo.attorney.length; i++) {
      let insert_attorney_object = {};
      insert_attorney_object.authorizerCode = baseInfo.attorney[i].authorizerCode;
      insert_attorney_object.supplierName = baseInfo.attorney[i].supplierName;
      insert_attorney_object.supplierCode = baseInfo.attorney[i].supplierCode;
      insert_attorney_object._status = "Insert";
      for (let j = 0; j < baseInfo.attorney[i].sunlist.length; j++) {
        let insert_attorney_sun_object = {};
        insert_attorney_sun_object.authProduct = baseInfo.attorney[i].sunlist[j].authProduct;
        insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[j].authType;
        insert_attorney_sun_object.authProductType = baseInfo.attorney[i].sunlist[j].authProductType;
        insert_attorney_sun_object.authDosageForm = baseInfo.attorney[i].sunlist[j].authDosageForm;
        insert_attorney_sun_object.authSku = baseInfo.attorney[i].sunlist[j].authSku;
        insert_attorney_sun_object.authFeatures = baseInfo.attorney[i].sunlist[j].authFeatures;
        insert_attorney_sun_object.ytenant = baseInfo.attorney[i].sunlist[j].ytenant;
        insert_attorney_sun_object._status = "Insert";
        attorneySunObject.push(insert_attorney_sun_object);
      }
      insert_attorney_object.SY01_supply_attorney_rangeList = attorneySunObject;
      attorneyChildObject.push(insert_attorney_object);
    }
    insert_base_object.SY01_supply_attorneyList = attorneyChildObject;
    let productChildObject = [];
    //写入适用产品
    for (let i = 0; i < baseInfo.product_list.length; i++) {
      let insert_product_object = {};
      insert_product_object.productCode = baseInfo.product_list[i].productCode;
      insert_product_object.productName = baseInfo.product_list[i].productName;
      insert_product_object.description = baseInfo.product_list[i].description;
      insert_product_object.model = baseInfo.product_list[i].model;
      insert_product_object.manufacturer = baseInfo.product_list[i].manufacturer;
      insert_product_object._status = "Insert";
      productChildObject.push(insert_product_object);
    }
    insert_base_object.SY01_supply_apply_proList = productChildObject;
    let baseObject = insert_base_object;
    let baseRes = ObjectStore.insert("ISY_2.ISY_2.SY01_supply_licences", baseObject, "8b394bfb");
  }
}
exports({ entryPoint: MyTrigger });