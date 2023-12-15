let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var array = new Array();
    if (request.hasOwnProperty("son")) {
      var son = request.son;
      for (var i = 0; i < son.length; i++) {
        array.push({
          product_code: son[i].product_code,
          product_name: son[i].product_name,
          product_umber: son[i].product_umber,
          nameRegistrant: son[i].nameRegistrant,
          classOfmd: son[i].classOfmd,
          product_date: son[i].product_date,
          product_certificate_date: son[i].product_certificate_date,
          specifications: son[i].specifications,
          Entrusting_enterprise_code: son[i].Entrusting_enterprise_code_clientCode,
          production_enterprise_code_production_numbers: son[i].production_enterprise_code_production_numbers,
          production_enterprise_name: son[i].production_enterprise_name,
          storage_conditions: son[i].storage_conditions,
          type_of_enterprise: son[i].type_of_enterprise
        });
      }
    }
    var object = {
      // 产品编码
      product_coding: request.product_coding,
      // 产品名称
      the_product_name: request.the_product_name,
      // 规格型号
      specifications: request.specifications,
      // 单位
      unit: request.unit,
      // 产品注册证号
      product_registration_number: request.product_registration_number,
      // 产品注册证/备案凭证批准日期
      registration_certificate_approval_date: request.registration_certificate_approval_date,
      // 产品注册证/备案凭证有效日期
      registration_certificate_effective_date: request.registration_certificate_effective_date,
      // 生产企业编码
      production_enterprise_code_production_numbers: request.production_enterprise_code_production_numbers,
      // 生产企业名称
      production_enterprise_name: request.production_enterprise_name,
      // 储运条件
      storage_and_transportation_conditions: request.storage_and_transportation_conditions,
      // 是否医疗器械
      whether_medical_equipment: request.whether_medical_equipment,
      // 默认入库贮存区货位号
      warehouse_storage_area_position_number_by_default: request.warehouse_storage_area_position_number_by_default,
      // 委托方企业编码
      to_the_enterprise: request.to_the_enterprise_clientCode,
      // 注册证书
      registration: request.registration,
      // 委托方企业名称
      Entrusting_enterprise_name: request.Entrusting_enterprise_name,
      // 启用状态
      enable: request.enable,
      // 组织Id
      org_id: "youridHere",
      // 子表集合
      product_registration_certificaList: array
    };
    var res = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", object, "3f0c64e9");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });