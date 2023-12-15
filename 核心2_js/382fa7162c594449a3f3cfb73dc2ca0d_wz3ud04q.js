let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data = request.data_request;
    var sql = "select * from AT15E7206608080004.AT15E7206608080004.customerinfo where id='" + data + "'";
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