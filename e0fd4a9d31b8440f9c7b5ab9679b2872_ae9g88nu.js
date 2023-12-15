let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    //查询生成UDI规则明细
    let sonConfigObj = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.sy01_udi_create_config_son", { sy01_udi_create_config_id: configId });
    return { result: sonConfigObj };
  }
}
exports({ entryPoint: MyAPIHandler });