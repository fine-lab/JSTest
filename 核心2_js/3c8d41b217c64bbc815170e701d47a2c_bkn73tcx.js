let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateWrapper = new Wrapper();
    updateWrapper.eq("ziduan1", request.project_no);
    updateWrapper.eq("baogaobianma", request.report_no);
    // 待更新字段内容
    var toUpdate = { qianshouri: request.signing_date, qianshoufang: request.signed };
    // 执行更新
    var res = ObjectStore.update("GT59740AT1.GT59740AT1.RJ01", toUpdate, updateWrapper, "7b4816ae");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });