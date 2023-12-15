let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 删除标记
    var dr = request.dr;
    // 接口编码
    var interfaceCode = dr == "0" ? "warehouse_update" : "warehouse_delete";
    // 同步状态是否开启
    let switchSql = "select enable from AT161E5DFA09D00001.AT161E5DFA09D00001.sync_drug_switch where table_name = '" + interfaceCode + "'";
    let swRes = ObjectStore.queryByYonQL(switchSql);
    if (swRes[0].enable == "0") {
      return {};
    }
    // 每页显示的数据数量
    var pageSize = request.pageSize;
    // 当前页码
    var currentPage = request.currentPage;
    // 日期时间
    var enabletsBegin = request.beginDate;
    var enabletsEnd = request.endDate;
    // 当前页码和每页数量计算偏移量
    var offset = currentPage * pageSize;
    if (dr == "1") {
      var sql =
        " select ware.warehouse_code from AT161E5DFA09D00001.AT161E5DFA09D00001.range_code " +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse ware on ware.id = wareArea.warehouse " +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.inventory_area wareArea on id = wareArea.district " +
        " where wareArea.dr = 1 and wareArea.pubts >= '" +
        enabletsBegin +
        "' and wareArea.pubts <= '" +
        enabletsEnd +
        "' " +
        " limit " +
        currentPage +
        "," +
        pageSize;
      var res = ObjectStore.queryByYonQL(sql);
      return { res };
    } else {
      var sqlQuery =
        "select dr, warehouse_address,area_name,storage_env_cond,ware.contacts,ware.contact_phone, ware.warehouse_code, range_code.dict_code" +
        " from AT161E5DFA09D00001.AT161E5DFA09D00001.inventory_area" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse ware on ware.id = warehouse" +
        " left join AT161E5DFA09D00001.AT161E5DFA09D00001.range_code range_code on range_code.id = district" +
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
        " limit " +
        currentPage +
        "," +
        pageSize;
      var res = ObjectStore.queryByYonQL(sqlQuery);
      return { res };
    }
  }
}
exports({ entryPoint: MyAPIHandler });