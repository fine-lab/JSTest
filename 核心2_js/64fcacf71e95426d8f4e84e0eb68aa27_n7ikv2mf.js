let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { id: "youridHere", partnerName: "北京时代原力信息科技有限公司", partner_code: "EX00022059", partner: "1515226529043316743" };
    var res = ObjectStore.updateById("GT30659AT3.GT30659AT3.ssp_parter_apply_cot", object, "e1dbbda4");
    return { res };
    //更新预估工作量
    //验证结果：{\"msg\":\"消息发送成功\",\"msgList\":[{\"responseStatusCode\":\"1\",\"receiver\":\"e73409ba-1733-4133-a563-0e1b708e780c\",\"responseContent\":\"yhtId为e73409ba-1733-4133-a563-0e1b708e780c发送成功\"}],\"status\":1}
  }
}
exports({ entryPoint: MyAPIHandler });