let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data_request;
    data.custaccstatus = "2";
    ObjectStore.updateById("AT15DCD4700808000A.AT15DCD4700808000A.supplierbankaccsc", data);
    var sql = "select * from AT15DCD4700808000A.AT15DCD4700808000A.supplierbankaccsc where id='" + data.id + "'";
    var retobj = ObjectStore.queryByYonQL(sql);
    if (retobj != null) {
      return { data_response: retobj[0] }; //这边的"data"，对应前端的"data"
    } else {
      return { data_response: data }; //这边的"data"，对应前端的"data"
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });