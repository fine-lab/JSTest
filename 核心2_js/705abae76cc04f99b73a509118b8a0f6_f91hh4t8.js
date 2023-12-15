let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = {
      id: "实体id",
      compositions: [
        {
          name: "子实体id",
          compositions: []
        }
      ]
    };
    //实体查询
    return { param };
  }
  updateBipCtStatus() {}
  createNCCCtAr(pk) {}
}
exports({ entryPoint: MyTrigger });