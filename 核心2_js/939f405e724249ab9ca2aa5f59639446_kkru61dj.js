let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestDataObject = JSON.parse(param.requestData);
    // 获取预审单主表信息
    let sql = "select * from ISY_2.ISY_2.SY01_supply_pre_hear_sheet where id =" + requestDataObject[0].id;
    let result = ObjectStore.queryByYonQL(sql);
    let baseInfo = result[0];
    //获取证照信息
    const license_sub_sql = "select * from ISY_2.ISY_2.SY01_supply_licence where SY01_supply_pre_hear_sheet_id =" + requestDataObject[0].id;
    baseInfo.license = ObjectStore.queryByYonQL(license_sub_sql);
    for (let i = 0; i < baseInfo.license.length; i++) {
      let license_id = baseInfo.license[i].id;
      let license_sun_sql = "select * from ISY_2.ISY_2.SY01_supply_auth_scope2 where SY01_supply_licence_id =" + license_id;
      baseInfo.license[i].sunlist = ObjectStore.queryByYonQL(license_sun_sql);
    }
    //获取人员证照信息
    const attorney_sub_sql = "select * from 	ISY_2.ISY_2.SY01_supply_power_attorney where SY01_supply_pre_hear_sheet_id =" + requestDataObject[0].id;
    baseInfo.attorney = ObjectStore.queryByYonQL(attorney_sub_sql);
    for (let i = 0; i < baseInfo.attorney.length; i++) {
      let attorney_id = baseInfo.attorney[i].id;
      let attorney_sun_sql = "select * from ISY_2.ISY_2.SY01_supply_auth_scope1 where SY01_supply_power_attorney_id =" + attorney_id;
      baseInfo.attorney[i].sunlist = ObjectStore.queryByYonQL(attorney_sun_sql);
    }
    //获取产品信息
    const product_sub_sql = "select * from ISY_2.ISY_2.SY01_supply_apply_product where SY01_supply_pre_hear_sheet_id =" + requestDataObject[0].id;
    baseInfo.product_list = ObjectStore.queryByYonQL(product_sub_sql);
    let num = "";
    for (let i = 0; i < 6; i++) {
      let radom = Math.floor(Math.random() * 10);
      num += radom;
    }
    let code = "HGGYSQD" + num;
    let insert_base_object = {};
    insert_base_object.org_id = baseInfo.organization;
    insert_base_object.org_id_name = baseInfo.organization.name;
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
    //写入合格供应商
    let res = ObjectStore.insert("ISY_2.ISY_2.SY01_qualified_supply", insert_base_object, "SY01_qualified_supply");
    //写入合格供应商证照
    for (let i = 0; i < baseInfo.license.length; i++) {
      let insert_license_object = {};
      insert_license_object.SY01_qualified_supply_id = res.id;
      insert_license_object.licenseId = baseInfo.license[i].licenseName;
      insert_license_object.remark = baseInfo.license[i].remark;
      insert_license_object.supplierName = baseInfo.license[i].supplierName;
      insert_license_object.supplierCode = baseInfo.license[i].supplierCode;
      let res_license = ObjectStore.insert("ISY_2.ISY_2.SY01_supply_licences", insert_license_object, "SY01_supply_licences");
      for (let j = 0; j < baseInfo.license[i].sunlist.length; j++) {
        let insert_license_sun_object = {};
        insert_license_sun_object.SY01_supply_licences_id = res_license.id;
        insert_license_sun_object.authProduct = baseInfo.license[i].sunlist[j].authProduct;
        insert_license_sun_object.authType = baseInfo.license[i].sunlist[j].authType;
        insert_license_sun_object.authProductType = baseInfo.license[i].sunlist[j].authProductType;
        insert_license_sun_object.authDosageForm = baseInfo.license[i].sunlist[j].authDosageForm;
        insert_license_sun_object.authSku = baseInfo.license[i].sunlist[j].authSku;
        let res_license_sun = ObjectStore.insert("ISY_2.ISY_2.SY01_supply_licences_range", insert_license_sun_object, "SY01_supply_licences_range");
      }
    }
    //写入合格供应商委托书
    for (let i = 0; i < baseInfo.attorney.length; i++) {
      let insert_attorney_object = {};
      insert_attorney_object.SY01_qualified_supply_id = res.id;
      insert_attorney_object.authorizerCode = baseInfo.attorney[i].authorizerCode;
      insert_attorney_object.supplierName = baseInfo.attorney[i].supplierName;
      insert_attorney_object.supplierCode = baseInfo.attorney[i].supplierCode;
      let res_attorney = ObjectStore.insert("ISY_2.ISY_2.SY01_supply_attorney", insert_attorney_object, "SY01_supply_attorney");
      for (let j = 0; j < baseInfo.attorney[i].sunlist.length; j++) {
        let insert_attorney_sun_object = {};
        insert_attorney_sun_object.SY01_supply_attorney_id = res_attorney.id;
        insert_attorney_sun_object.authProduct = baseInfo.attorney[i].sunlist[j].authProduct;
        insert_attorney_sun_object.authType = baseInfo.attorney[i].sunlist[j].authType;
        insert_attorney_sun_object.authProductType = baseInfo.attorney[i].sunlist[j].authProductType;
        insert_attorney_sun_object.authDosageForm = baseInfo.attorney[i].sunlist[j].authDosageForm;
        insert_attorney_sun_object.authSku = baseInfo.attorney[i].sunlist[j].authSku;
        let res_attorney_sun = ObjectStore.insert("ISY_2.ISY_2.SY01_supply_attorney_range", insert_attorney_sun_object, "SY01_supply_attorney_range");
      }
    }
    //写入适用产品
    for (let i = 0; i < baseInfo.product_list.length; i++) {
      let insert_product_object = {};
      insert_product_object.SY01_qualified_supply_id = res.id;
      insert_product_object.productCode = baseInfo.product_list[i].productCode;
      insert_product_object.productName = baseInfo.product_list[i].productName;
      insert_product_object.description = baseInfo.product_list[i].description;
      insert_product_object.model = baseInfo.product_list[i].model;
      insert_product_object.manufacturer = baseInfo.product_list[i].manufacturer;
      let res_license_sun = ObjectStore.insert("ISY_2.ISY_2.SY01_supply_apply_pro", insert_product_object, "SY01_supply_apply_pro");
    }
  }
}
exports({ entryPoint: MyTrigger });