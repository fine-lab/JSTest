let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取tenantid
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    // 设置systemCode
    var systemCode = "diwork";
    //获取token
    let getAccessToken = extrequire("GT84332AT19.backDefaultGroup.getAccessToken");
    var paramToken = {};
    let resToken = getAccessToken.execute(paramToken);
    var token = resToken.access_token;
    //调用API接口查询角色
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
    // 角色信息
    let roleArray = resp.data;
    // 清空数据
    var delParam = {};
    let delRes = ObjectStore.deleteByMap("GT84332AT19.GT84332AT19.role_list", delParam, "e6caecf1");
    var roleLists = [];
    for (var num = 0; num < roleArray.length; num++) {
      // 填充角色表
      let r = {
        roleId: roleArray[num].roleId,
        createDate: roleArray[num].createDate,
        isactive: roleArray[num].isactive,
        roleCode: roleArray[num].roleCode,
        roleName: roleArray[num].roleName,
        name: roleArray[num].name
      };
      roleLists.push(r);
    }
    var res = ObjectStore.insertBatch("GT84332AT19.GT84332AT19.role_list", roleLists, "e6caecf1");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });