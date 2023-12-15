let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //存放五种培训试题表的url
    var object = { trainType: request.trainType };
    var res = ObjectStore.selectByMap("GT37770AT29.GT37770AT29.question_Num_Point", object);
    return { res, object };
  }
}
exports({ entryPoint: MyAPIHandler });