let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取SKU物料
    let func1 = extrequire("GZTBDM.essentialData.getSkuRecord");
    let func3 = extrequire("GZTBDM.essentialData.getSkuYsBody");
    let res = func1.execute(null, null);
    let skuList = res.skuList;
    func3.execute(null, skuList);
  }
}
exports({ entryPoint: MyTrigger });