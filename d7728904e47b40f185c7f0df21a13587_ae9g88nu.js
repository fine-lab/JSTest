let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let udiProductId = request.udiProductId; //物料对应包装配置id
    let result = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.sy01_udi_product_configure2", { sy01_udi_product_info_id: udiProductId });
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });