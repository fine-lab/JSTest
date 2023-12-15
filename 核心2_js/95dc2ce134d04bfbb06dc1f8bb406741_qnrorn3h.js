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
    var uspaceReceiver = uspaceReceivers;
    var channels = ["uspace"];
    var title = "您有一份專案報告需要關注！";
    var content = "專案編號：" + res2[0].code + ",專案主題：" + res2[0].subject;
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    return { dd: uspaceReceivers };
  }
}
exports({ entryPoint: MyAPIHandler });