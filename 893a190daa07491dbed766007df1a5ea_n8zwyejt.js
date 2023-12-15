let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //包装产品标识ID
    let createUdiNum = request.orderMaterialNum; //单据物料数量
    //查询包装信息和对应商品信息
    let udiConfigObj = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_configurev3", { id: configId });
    if (udiConfigObj[0].bzcpbs == udiConfigObj[0].bznhxyjbzcpbs) {
      //判断是否为最小包装
      return { result: createUdiNum };
    } else {
      //根据包含小一级产品包装标识查询
      let minUdiConfigObj = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_configurev3", { bzcpbs: udiConfigObj[0].bznhxyjbzcpbs });
      createUdiNum = Math.ceil(createUdiNum / udiConfigObj[0].bznhxyjbzcpbssl); //计算可生成中包装数量 不为外包装的情况下
      if (minUdiConfigObj[0].bzcpbs != minUdiConfigObj[0].bznhxyjbzcpbs) {
        //判断是否为最小包装
        //若包含小一级产品包装标识不为最小包装，则当前包装为外包装 在计算除以中包装后的生成数量
        createUdiNum = Math.ceil(createUdiNum / minUdiConfigObj[0].bznhxyjbzcpbssl);
      }
    }
    return { result: createUdiNum };
  }
}
exports({ entryPoint: MyAPIHandler });