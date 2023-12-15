let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查找用车管理人角色的role_id
    let searchQL = "select id from sys.auth.Role where code = 'xiewuchum'";
    var roleId = ObjectStore.queryByYonQL(searchQL, "u8c-auth");
    // 根据role_id去UserRole表里查用户id
    let searchUserQL = `select user,yhtUser from sys.auth.UserRole where role = "${roleId[0].id}"`;
    let userId = ObjectStore.queryByYonQL(searchUserQL, "u8c-auth");
    var res = JSON.parse(AppContext());
    var receiver = [userId[0].yhtUser];
    var channels = ["uspace"];
    var title = "携物出门单据审批完成";
    var content = "点击查看";
    var createToDoExt = {
      webUrl: `/mdf-node/meta/Voucher/c18ad669?domainKey=developplatform&billid=${request.data.id}`
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
}
exports({ entryPoint: MyAPIHandler });