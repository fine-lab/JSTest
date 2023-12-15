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
    var interfaceCode = dr == "0" ? "ClientInformation_update" : "ClientInformation_delete";
    if (request.uploadStatus && request.uploadStatus == "1") {
      interfaceCode = "protocol_attachment";
    }
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
        " select client.uscc from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code " +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse ware on ware.district = id" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation client on ware.id = client.warehouse" +
        " where client.dr = 1 and client.pubts >= '" +
        enabletsBegin +
        "' and client.pubts <= '" +
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
        "clientName," +
        "uscc," +
        "location," +
        "representative," +
        "principal," +
        "businessAddr," +
        "storageAddr," +
        "businessScope," +
        "licenseNocertificate," +
        "licenseNocertificateNo," +
        "license_issue_date," +
        "certificate_record_date," +
        "license_period_start_date," +
        "expiryDate," +
        "Issuer," +
        "fromDate," +
        "toDate," +
        "contractYear," +
        "warehouse.warehouse_code," +
        "warehouse.warehouse_address," +
        "range_code.dict_code," +
        "part_of_product_type," +
        "range_code2.dict_code," +
        "protocol_attachment_file_name," +
        "protocol_attachment_file_url" +
        " from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse warehouse on warehouse.id = warehouse" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_code on range_code.id = EntrustBusiScopeRef" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_code2 on range_code2.id = store_transport_type" +
        " where dr = " +
        dr +
        " and enable = '1' and ((createTime >= '" +
        enabletsBegin +
        "' and createTime <= '" +
        enabletsEnd +
        "') " +
        " or (modifyTime >= '" +
        enabletsBegin +
        "' and modifyTime <= '" +
        enabletsEnd +
        "')) " +
        " limit " +
        currentPage +
        "," +
        pageSize;
      let res = ObjectStore.queryByYonQL(sqlQuery);
      return { res };
    }
  }
}
exports({ entryPoint: MyAPIHandler });