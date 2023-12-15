let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = ObjectStore.queryByYonQL("select Z04 from AT1639DE8C09880005.AT1639DE8C09880005.sw01_Z04 where fkid = " + request.id);
    var res2 = ObjectStore.queryByYonQL("select Z01,Z02,projectPIC,code,subject from AT1639DE8C09880005.AT1639DE8C09880005.sw01 where id = " + request.id);
    var userlist = new Array();
    res.forEach((item, index) => {
      userlist.push("'" + item.Z04 + "'"); //执行人
    });
    userlist.push("'" + res2[0].Z01 + "'"); //主要负责人
    userlist.push("'" + res2[0].Z02 + "'"); //协同负责人
    userlist.push("'" + res2[0].projectPIC + "'"); //专案发起人
    var ul = ObjectStore.queryByYonQL("select user_id from bd.staff.Staff where id in (" + userlist + ")", "ucf-staff-center");
    var uspaceReceivers = new Array();
    ul.forEach((item, index) => {
      uspaceReceivers.push(item.user_id);
    });
    let url = "https://www.example.com/" + request.id + "?domainKey=developplatform";
    var receiver = uspaceReceivers;
    var channels = ["uspace"];
    var title = "您有一份專案報告需要处理！";
    var content = "專案編號：" + res2[0].code + ",專案主題：" + res2[0].subject;
    var createToDoExt = {
      webUrl: url
    };
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      receiver: receiver,
      channels: channels,
      subject: title,
      content: content,
      messageType: "createToDo",
      createToDoExt: createToDoExt
    };
    var result = sendMessage(messageInfo);
    return { r: request };
  }
}
exports({ entryPoint: MyAPIHandler });