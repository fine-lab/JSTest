let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let udiProductId = request.udiProductId; //物料对应包装配置id
    let result = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_product_configurev2", { sy01_udi_product_info_id: udiProductId });
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });