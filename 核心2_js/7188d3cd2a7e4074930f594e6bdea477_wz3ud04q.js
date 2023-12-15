let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //从request里面取到supplier
    var supplier = request.supplier;
    var sql = 'select id from AT15DCD4700808000A.AT15DCD4700808000A.supplysc where id = "' + supplier + '" and enable = 1';
    var rst = ObjectStore.queryByYonQL(sql);
    var id = "";
    //把查出来的ID信息取出来
    if (rst != null && rst.length > 0) {
      id = rst[0].id;
    }
    //最后将id和request都返回回去
    return { id: id, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });