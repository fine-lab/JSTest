let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var supplier = request.supplier;
    var sql = 'select id from GT22003AT166.GT22003AT166.supplyclassB061 where id = "' + supplier + '" and enable=1 ';
    var rst = ObjectStore.queryByYonQL(sql);
    var id = "";
    //线上开发典型案例-单卡节点开发
    if (rst != null && rst.length > 0) {
      id = rst[0].id;
    }
    return { id: id, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });