let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { name: request.name, call_num: request.call_num };
    var res = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.buildma_info", object);
    var throughTrainType = request.throughTrainType;
    if (request.throughTrainType == "3" || request.throughTrainType == "2") {
      if (res[0].throughTrainType == "1" || res[0].throughTrainType == "4" || res[0].throughTrainType == "5") {
        throughTrainType = res[0].throughTrainType;
      }
    }
    var object = { name: request.name, call_num: request.call_num, throughTrainType: throughTrainType };
    var updateWrapper = new Wrapper();
    updateWrapper.eq("name", request.name).eq("call_num", request.call_num);
    // 待更新字段内容
    var toUpdate = { status: "3", throughTrainType: throughTrainType };
    // 执行更新
    var res = ObjectStore.update("GT42921AT2.GT42921AT2.buildma_info", toUpdate, updateWrapper, "a510f6ba");
    return { res, object };
  }
}
exports({ entryPoint: MyAPIHandler });