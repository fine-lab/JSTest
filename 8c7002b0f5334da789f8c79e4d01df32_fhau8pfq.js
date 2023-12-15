let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let billType = this.findeBillType(context);
    // 查找角色的role_id
    let searchQL = `select id from sys.auth.Role where code = \'${billType.code}\'`;
    var roleId = ObjectStore.queryByYonQL(searchQL, "u8c-auth");
    // 根据role_id去UserRole表里查用户id
    let searchUserQL = `select user,yhtUser from sys.auth.UserRole where role = \'${roleId[0].id}\'`;
    let userId = ObjectStore.queryByYonQL(searchUserQL, "u8c-auth");
    var res = JSON.parse(AppContext());
    var result = "";
    if (userId.length) {
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
      result = sendMessage(messageInfo);
    }
    return { result };
  }
  findeBillType(context) {
    let { name } = context;
    let res = {};
    if (name.includes("携物出门")) {
      res.code = "xiewuchum";
      res.name = "携物出门";
    } else if (name.includes("接待人")) {
      res.code = "renyuanlaifangqiantai";
      res.name = "人员来访";
    }
    return res;
  }
}
exports({ entryPoint: MyTrigger });