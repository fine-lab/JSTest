let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let importData = param.requestData;
    let zxxsdycpbs = importData.productUdi_zxxsdycpbs; //产品标识
    let id = importData.id; //手工码
    //根据产品标识查询是否存在
    let pagckageData = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_listv3", { zxxsdycpbs: zxxsdycpbs });
    if (pagckageData.length == 0) {
      throw new Error("表头手工码：" + id + "，产品标识" + zxxsdycpbs + "在产品标识库中不存在，请检查后导入！");
    }
    let udiConfigData = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_relation_productv3", { productUdi: pagckageData[0].id });
    if (udiConfigData.length > 0) {
      throw new Error("表头手工码：" + id + "，产品标识" + zxxsdycpbs + "在配置方案中已存在，请勿重复导入！");
    }
    let sy01_udi_product_infov3List = importData.sy01_udi_product_infov3List; //关联物料信息
    if (sy01_udi_product_infov3List == undefined || sy01_udi_product_infov3List == null || sy01_udi_product_infov3List.length == 0) {
      throw new Error("表头手工码：" + id + "，DI商品关联信息为空，请填写完整后导入！");
    }
    if (sy01_udi_product_infov3List.length > 1) {
      throw new Error("表头手工码：" + id + "，DI商品关联信息只能填写一行数据，请删除其他数据后导入！");
    }
    let sy01_udi_product_configurev3List = sy01_udi_product_infov3List[0].sy01_udi_product_configurev3List;
    if (sy01_udi_product_configurev3List == undefined || sy01_udi_product_configurev3List == null || sy01_udi_product_configurev3List.length == 0) {
      throw new Error("表头手工码：" + id + "，DI商品对应层级配置信息为空，请填写完整后导入！");
    }
    for (let i = 0; i < sy01_udi_product_configurev3List.length; i++) {
      let createConfigCode = sy01_udi_product_configurev3List[i].udiCreateConfigId_name; //UDI生成规则code
      let createConfigCodeData = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_create_configv3", { code: createConfigCode });
      let configId = sy01_udi_product_configurev3List[i].id; //相关证照手工码
      if (createConfigCodeData == undefined || createConfigCodeData == null || createConfigCodeData.length == 0) {
        throw new Error("DI商品对应层级配置手工码：" + configId + "，找不到UDI生成配置规则，请检查UDI生成配置规则编码后导入，编码：'" + createConfigCode + "'。");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });