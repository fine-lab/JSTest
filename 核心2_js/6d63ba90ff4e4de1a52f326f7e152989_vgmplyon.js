let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const { list } = request;
    //查询内容
    var object = {
      ids: list
    };
    //实体查询
    var res = ObjectStore.selectBatchIds("GT85815AT32.GT85815AT32.sczz_kc", object);
    return { data: res };
  }
}
exports({ entryPoint: MyAPIHandler });