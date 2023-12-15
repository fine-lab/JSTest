let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data;
    for (var i = 0; i < data.length; i++) {
      var data1 = data[i];
      var date = new Date();
      var getTime = date.getTime();
      // 更新条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", "1503196712163344392");
      // 待更新字段内容
      var toUpdate = { new1: "2022-07-02 09:45:25", new2: "2022-07-02" };
      // 执行更新
      var res = ObjectStore.update("GT102159AT2.GT102159AT2.dateTest", toUpdate, updateWrapper, "1c9cca41");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });