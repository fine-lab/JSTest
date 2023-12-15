let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //书写YonQL语句，类似Mysql
    var sql_dept = "select id,code,type_name,waste_quantity,summary_length from AT17AA2EFA09C00009.AT17AA2EFA09C00009.manufacturing_order where code ='" + request.srcBillNO + "'";
    //只能在表所在的对应的领域查询出来
    var response = ObjectStore.queryByYonQL(sql_dept, "developplatform");
    return { response };
  }
}
exports({ entryPoint: MyAPIHandler });