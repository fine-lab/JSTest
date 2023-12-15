let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object = {
      id: "youridHere"
    };
    //实体查询
    var res = ObjectStore.selectById("pc.product.Product", object);
    let aa = res.name;
    throw new Error("查询结果的物料名称为：" + aa);
  }
}
exports({ entryPoint: MyTrigger });