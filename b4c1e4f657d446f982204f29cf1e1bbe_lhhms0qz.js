let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = { wenben: "测试文本" };
    var res = ObjectStore.selectByMap("GT23196AT14.GT23196AT14.simpletest", object);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });