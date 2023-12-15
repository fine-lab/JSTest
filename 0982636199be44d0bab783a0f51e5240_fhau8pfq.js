let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查找用车管理人角色的role_id
    let searchQL = "select id from sys.auth.Role where code = 'yongcheguanlir'";
    var roleId = ObjectStore.queryByYonQL(searchQL, "u8c-auth");
    // 根据role_id去UserRole表里查用户id
    let searchUserQL = `select user,yhtUser from sys.auth.UserRole where role = "${roleId[0].id}"`;
    let userId = ObjectStore.queryByYonQL(searchUserQL, "u8c-auth");
    var res = JSON.parse(AppContext());
    var uspaceReceiver = [userId[0].yhtUser];
    var channels = ["uspace"];
    var title = "用车人评价";
    var content = request.msg;
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: res.currentUser.tenantId,
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });