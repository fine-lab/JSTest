let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var fuzeren = request.fuzeren;
    // 根据父实体id更新项目负责人
    var updateWrapper1 = new Wrapper();
    updateWrapper1.eq("id", id);
    var toUpdate1 = { xiangmufuzeren: fuzeren };
    var updateres1 = ObjectStore.update("GT64724AT4.GT64724AT4.ziyuanzhixingming", toUpdate1, updateWrapper1, "3b59d156");
    return { updateres1 };
  }
}
exports({ entryPoint: MyAPIHandler });