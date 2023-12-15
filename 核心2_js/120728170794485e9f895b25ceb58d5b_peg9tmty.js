let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 每页显示的数据数量
    var pageSize = request.pageSize;
    // 当前页码
    var currentPage = request.currentPage;
    // 日期时间
    var enabletsBegin = request.beginDate;
    var enabletsEnd = request.endDate;
    // 删除标记
    var dr = request.dr;
    // 接口编码
    var interfaceCode = dr == "0" ? "productInformation_update" : "productInformation_delete";
    // 同步状态是否开启
    let switchSql = "select enable from AT161E5DFA09D00001.AT161E5DFA09D00001.sync_drug_switch where table_name = '" + interfaceCode + "'";
    let swRes = ObjectStore.queryByYonQL(switchSql);
    if (swRes[0].enable == "0") {
      return {};
    }
    // 当前页码和每页数量计算偏移量
    var offset = currentPage * pageSize;
    if (dr == "1") {
      let sql =
        " select client.uscc, product.product_registration_number, product.product_coding from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation client on client.EntrustBusiScopeRef = id" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation product on client.id = product.to_the_enterprise" +
        " where product.dr = 1 and product.pubts >= '" +
        enabletsBegin +
        "' and product.pubts <= '" +
        enabletsEnd +
        "' " +
        " limit " +
        currentPage +
        "," +
        pageSize;
      let res = ObjectStore.queryByYonQL(sql);
      return { res };
    } else {
      let sqlQuery =
        "select " +
        "ClientInformation.clientName," +
        "ClientInformation.uscc," +
        "the_product_name," +
        "range_code.dict_code," +
        "range_code2.dict_code," +
        "specifications," +
        "product_coding," +
        "product_registration_number," +
        "registration_certificate_approval_date," +
        "product_registration_effective_date," +
        "registration_certificate_effective_date," +
        "range_code3.dict_code," +
        "production_enterprise_name," +
        "storage_and_transportation_conditions," +
        "transportation_conditions," +
        "registrantLicenseNocertificateNo," +
        "manufacturerLicenseNocertificateNo," +
        "registrant_name," +
        "is_unique_identification_control," +
        "di," +
        "range_code4.dict_code," +
        "range_code5.dict_code," +
        " group_concat(range_codex.dict_code)as production_type_codes, group_concat(ppt.dr)as production_type_trs , id " +
        " from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation ClientInformation on ClientInformation.id = to_the_enterprise" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_code on range_code.id = product_category" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_code2 on range_code2.id = class_of_product" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_code3 on range_code3.id = place_of_origin" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_code4 on range_code4.id = barcode_type" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_code5 on range_code5.id = product_control_method" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation_production_type ppt on ppt.fkid = id " +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_codex on range_codex.id = ppt.production_type " +
        " where dr = 0 and enable = '1' and ((createTime >= '" +
        enabletsBegin +
        "' and createTime <= '" +
        enabletsEnd +
        "') " +
        " or (modifyTime >= '" +
        enabletsBegin +
        "' and modifyTime <= '" +
        enabletsEnd +
        "')) " +
        " group by id order by id desc limit " +
        currentPage +
        "," +
        pageSize;
      let res = ObjectStore.queryByYonQL(sqlQuery);
      return { res };
    }
  }
}
exports({ entryPoint: MyAPIHandler });