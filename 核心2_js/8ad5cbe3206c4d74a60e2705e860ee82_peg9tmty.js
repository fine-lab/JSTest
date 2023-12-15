let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var clientcode = "" + request.enterprise.客户编码;
    var clientname = "" + request.enterprise.客户名称;
    var user_code = "" + request.enterprise.用户编码;
    var user_name = "" + request.enterprise.用户名称;
    var enterpriseSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.Customer_information where clientcode = '" + clientcode + "'";
    var enterpriseRes = ObjectStore.queryByYonQL(enterpriseSql, "developplatform");
    if (enterpriseRes.length == 0) {
      //新增
      var insertTable = {
        clientcode: clientcode,
        clientname: clientname,
        user_code: user_code,
        user_name: user_name
      };
      var insertTableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.Customer_information", insertTable, "1e360c21");
      return { insertTableRes };
    } else {
      //修改
      var updateTable = {
        id: enterpriseRes[0].id,
        clientcode: clientcode,
        clientname: clientname,
        user_code: user_code,
        user_name: user_name
      };
      var updateTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Customer_information", updateTable, "1e360c21");
      return { updateTableRes };
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });