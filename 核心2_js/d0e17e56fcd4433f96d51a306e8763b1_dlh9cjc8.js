let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 设置systemCode
    var systemCode = "diwork";
    // 获取tenantId
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    //获取token
    let getAccessToken = extrequire("GT84467AT20.backDefaultGroup.getAccessToken");
    var paramToken = {};
    let resToken = getAccessToken.execute(paramToken);
    var token = resToken.access_token;
    // 查询角色信息
    let url = "https://www.example.com/" + token;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    let body = {
      systemCode: systemCode,
      tenantId: tid
    };
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    var resp = JSON.parse(strResponse);
    // 填充角色数据
    var roleArrays = resp.data;
    // 清空原有数据
    var delParam = {};
    let delRes = ObjectStore.deleteByMap("GT84467AT20.GT84467AT20.role_list_jp", delParam);
    var roles = [];
    for (var num = 0; num < roleArrays.length; num++) {
      // 角色数据
      let r = {
        roleId: roleArrays[num].roleId,
        createDate: roleArrays[num].createDate,
        isactive: roleArrays[num].isactive,
        roleCode: roleArrays[num].roleCode,
        roleName: roleArrays[num].roleName,
        name: roleArrays[num].name,
        multilingualDesc: roleArrays[num].multilingualDesc
      };
      // 查询角色对应的用户信息
      let url = "https://www.example.com/" + token;
      let params = {
        roleId: roleArrays[num].roleId,
        pageNumber: 1,
        pageSize: 30000
      };
      let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(params));
      var resUsers = JSON.parse(strResponse);
      var userArrays = resUsers.data.list;
      // 填充用户数据
      var users = [];
      for (var num1 = 0; num1 < userArrays.length; num1++) {
        let u = {
          code: userArrays[num1].code,
          name: userArrays[num1].name,
          email: userArrays[num1].email,
          mobile: userArrays[num1].mobile,
          tenant: userArrays[num1].tenant,
          userType: userArrays[num1].userType,
          yhtUserId: userArrays[num1].yhtUserId
        };
        users.push(u);
        r.role_usersList = users;
      }
      roles.push(r);
    }
    var res = ObjectStore.insertBatch("GT84467AT20.GT84467AT20.role_list_jp", roles);
    return { roles };
  }
}
exports({ entryPoint: MyTrigger });