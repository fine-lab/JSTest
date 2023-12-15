let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var trainName = param.data[0].trainName;
    var examCommand = param.data[0].examCommand;
    var trainCode = param.data[0].trainCode;
    var examcode = param.data[0].code;
    var str = JSON.stringify(param.data);
    console.log("111111111111111111111");
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("trainCode", trainCode);
    // 待更新字段内容
    var toUpdate = { examCommand: examCommand, examCode: examcode, examFrequency: 1 };
    // 执行更新
    var res = ObjectStore.update("GT37770AT29.GT37770AT29.buildma_info", toUpdate, updateWrapper, "a426bc5b");
    return {};
  }
}
exports({ entryPoint: MyTrigger });