let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    if (param.data[0].shenheren == null) {
      var object = { id: param.data[0].id, shenheren: "SSR", shenheshijian: new Date().toLocaleString() };
      var res = ObjectStore.updateById("GT29940AT234.GT29940AT234.ex_ruku", object, "47f41a4e");
      var uspaceReceiver = ["95dd88f9-bfb5-4bea-898f-5d71a6adea80"];
      var channels = ["uspace"];
      var title = "debugger";
      var content = JSON.stringify(res);
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: "yourIdHere",
        uspaceReceiver: uspaceReceiver,
        channels: channels,
        subject: title,
        content: content
      };
      var result = sendMessage(messageInfo);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });