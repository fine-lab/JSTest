let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取请求数据
    let obj = request.data;
    let datauri = request.datauri;
    let res = ObjectStore.updateById(datauri, obj);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });