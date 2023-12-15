let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var res = ObjectStore.queryByYonQL("select * from GT29690AT232.GT29690AT232.rkdex where id='youridHere'");
    var uspaceReceiver = ["95dd88f9-bfb5-4bea-898f-5d71a6adea80"];
    var channels = ["uspace"];
    var title = "Script Debug";
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
    if (object == null) return false;
    else return true;
  }
}
exports({ entryPoint: MyTrigger });