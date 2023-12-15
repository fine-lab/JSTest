let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //循环请求参数取出套餐id
    let kitIds = "";
    request.data.forEach((kit) => {
      let kitId;
      if (kit.id != undefined) {
        kitId = "'" + kit.id + "',";
      } else {
        kitId = "'" + kit.examination_kit + "',";
      }
      kitIds += kitId;
    });
    kitIds = "(" + substring(kitIds, 0, kitIds.length - 1) + ")";
    let sql =
      "select id as yzqy_jmsrqr_id,gongyourenshenfenzhenghaoma as gyrmxgongyourenshenfenzhenghaoma,gongyourenxingming as gyrmxgongyourenxingming" +
      " from AT17A99AE209C00004.AT17A99AE209C00004.yzqy_jcsj_gyrmx where examination_kit_id in " +
      kitIds +
      "order by gongyourenshenfenzhenghaoma";
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });