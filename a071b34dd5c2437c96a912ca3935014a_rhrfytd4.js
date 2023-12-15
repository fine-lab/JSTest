let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let importData = param.requestData;
    let zxxsdycpbs = importData.zxxsdycpbs; //产品标识
    let id = importData.id; //手工码
    //根据产品标识查询是否存在
    let pagckageData = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_listv3", { zxxsdycpbs: zxxsdycpbs });
    if (pagckageData.length > 0) {
      throw new Error("表头手工码：" + id + "，最小销售单元产品标识" + zxxsdycpbs + "已存在，请更换其他产品标识导入！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });