let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let udiProductId = request.udiProductId; //物料对应包装配置id
    let result = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_configurev3", { sy01_udi_product_info_id: udiProductId });
    return { result: result };
  }
}
exports({ entryPoint: MyAPIHandler });