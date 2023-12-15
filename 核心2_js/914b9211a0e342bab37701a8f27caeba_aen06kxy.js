let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    let custom_id = data.kehu;
    var kehua;
    if (custom_id) {
      let sqlstr = "select * from GT38600AT3.GT38600AT3.custominfo1 where id =" + custom_id;
      kehua = ObjectStore.queryByYonQL(sqlstr, "developplatform");
    }
    let kehutemp = kehua[0];
    var uspaceReceiver = [currentUser.id];
    var channels = ["uspace"];
    var title = "title work notify";
    var content = "您申请查看的客户信息已经通过，客户名：" + kehutemp.kehuming;
    content += "<br/>	客户地址:" + kehutemp.kehudizhi;
    content += "<br/>	客户编码:" + kehutemp.kehubianma;
    content += "<br/>	联系方式:" + kehutemp.new4;
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    return {};
  }
}
exports({ entryPoint: MyTrigger });