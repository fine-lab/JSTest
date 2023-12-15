let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let billType = this.findeBillType(context);
    // 查找用车管理人角色的role_id
    let searchQL = `select id from sys.auth.Role where code = \'${billType.code}\'`;
    var roleId = ObjectStore.queryByYonQL(searchQL, "u8c-auth");
    // 根据role_id去UserRole表里查用户id
    let searchUserQL = `select user,yhtUser from sys.auth.UserRole where role = "${roleId[0].id}"`;
    let userId = ObjectStore.queryByYonQL(searchUserQL, "u8c-auth");
    if (userId.length) {
      var res = JSON.parse(AppContext());
      var receiver = [userId[0].yhtUser];
      var channels = ["uspace"];
      var title = `${billType.name}单据审批完成`;
      var content = "点击查看";
      var createToDoExt = {
        webUrl: `/mdf-node/meta/Voucher/${param.billnum}?domainKey=developplatform&billid=${param.data[0].id}`
      };
      var messageInfo = {
        sysId: "yourIdHere",
        tenantId: res.currentUser.tenantId,
        receiver: receiver,
        channels: channels,
        subject: title,
        content: content,
        messageType: "createToDo",
        createToDoExt: createToDoExt
      };
      var result = sendMessage(messageInfo);
      return { result };
    }
    return {};
  }
  findeBillType(context) {
    let { name } = context;
    let res = {};
    if (name.includes("文档借阅")) {
      res.code = "wendang";
      res.name = "文档借阅";
    }
    return res;
  }
}
exports({ entryPoint: MyTrigger });