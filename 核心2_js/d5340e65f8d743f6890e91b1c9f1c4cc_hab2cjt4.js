let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object1 = { verifystate: 2 };
    var res1 = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.personTrainApply", object1);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("verifystate", 2);
    // 待更新字段内容
    var toUpdate = { verifystate: 0 };
    // 执行更新
    var res = ObjectStore.update("GT42921AT2.GT42921AT2.personTrainApply", toUpdate, updateWrapper, "684f664f");
    return {};
  }
}
exports({ entryPoint: MyTrigger });