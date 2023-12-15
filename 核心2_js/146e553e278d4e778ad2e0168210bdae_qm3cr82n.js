let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //根据接口标识查询接口地址
    var res = ObjectStore.queryByYonQL('select url,des from GT29479AT185.GT29479AT185.interfaceInfo wehre label="iformlist"');
    //请求服务获取sign
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });