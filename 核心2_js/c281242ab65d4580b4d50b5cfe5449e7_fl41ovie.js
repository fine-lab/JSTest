let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var alluser = []; //存储需要发送的用户主键
    var content = request.data;
    var userlist = ObjectStore.queryByYonQL("select * from base.user.User", "productcenter");
    let func1 = extrequire("GT21873AT3.gettoken.gettoken2");
    let res = func1.execute("");
    var access_token = res.access_token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let body = { systemCode: "diwork", tenantId: "yourIdHere" };
    //查询bbtz角色主键
    let strResponse = postman("post", "https://www.example.com/" + access_token, JSON.stringify(header), JSON.stringify(body));
    var strResponseobj = JSON.parse(strResponse);
    var roleid;
    if ((strResponseobj.code = "200")) {
      for (var i = strResponseobj.data.length; i--; ) {
        var roledata = strResponseobj.data[i];
        if (roledata.roleCode == "bbtz") {
          roleid = roledata.roleId;
        }
      }
    }
    //查询角色主键关联ID
    let userbody = { roleId: roleid, pageNumber: 1, pageSize: 50 };
    let roleuser = postman("post", "https://www.example.com/" + access_token, JSON.stringify(header), JSON.stringify(userbody));
    var roleuserobj = JSON.parse(roleuser);
    if ((roleuserobj.code = "200")) {
      for (var i = roleuserobj.data.list.length; i--; ) {
        var userlist = roleuserobj.data.list[i];
        alluser.push(userlist.yhtUserId); //用户主键
      }
    }
    for (var i = 0; i < userlist.length; i++) {
      if (userlist[i].name == request.User) {
        alluser.push(userlist[i].yhtUserId); //用户主键
      }
    }
    var channels = ["uspace"];
    var title = request.title;
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: alluser,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    var resultobj = JSON.parse(result);
    return resultobj;
  }
}
exports({ entryPoint: MyAPIHandler });