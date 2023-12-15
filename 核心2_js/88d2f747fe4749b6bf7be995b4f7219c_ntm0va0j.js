let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var appid = request.appid;
    var secret = request.secret;
    var code = request.code;
    var token = request.yy_token;
    var tenantId = request.tenantId;
    var yongyouUrl = request.yongyouUrl;
    var url = "https://www.example.com/" + appid + "&secret=" + secret + "&js_code=" + code;
    var resp = postman("GET", url, null, null);
    if (resp) {
      var resObject = JSON.parse(resp);
      var sql = "select * from GT37846AT3.GT37846AT3.RZH_901 where WeiXinID='" + resObject.openid + "'";
      var res_user = ObjectStore.queryByYonQL(sql);
      if (res_user == undefined) {
        return { message: "数据库查询为空", resp: resp };
      }
      if (res_user.length == 1) {
        //账号已注册
        var userInfo = res_user[0];
        var url = yongyouUrl + "iuap-api-gateway/yonbip/digitalModel/role/getTenantRoles?access_token=" + token;
        //获取角色
        var resp_role = postman("POST", url, null, JSON.stringify({ systemCode: "diwork", tenantId: tenantId }));
        var list = JSON.parse(resp_role).data;
        //测试
        var roleList = [];
        var index = 0;
        for (var i = 0; i < list.length; i++) {
          let item = list[i];
          if (
            item.name.indexOf("装箱") > -1 ||
            item.name.indexOf("发箱") > -1 ||
            item.name.indexOf("收货") > -1 ||
            item.name.indexOf("发货") > -1 ||
            item.name.indexOf("司机") > -1 ||
            item.name.indexOf("库管员") > -1 ||
            item.name.indexOf("销售人员") > -1
          ) {
            roleList[index] = item;
            index += 1;
          }
        }
        //获取角色索引
        var roleIndex = -1;
        for (var i = 0; i < roleList.length; i++) {
          let item = roleList[i];
          if (item.roleId === userInfo.Role) {
            if (item.name.indexOf("库管员") > -1) {
              roleIndex = 2;
            } else if (item.name.indexOf("收货") > -1 || item.name.indexOf("发货") > -1) {
              roleIndex = 1;
            } else if (item.name.indexOf("司机") > -1) {
              roleIndex = 3;
            } else if (item.name.indexOf("销售人员") > -1) {
              roleIndex = 4;
            }
            break;
          }
        }
        return { wx_data: resp, user_data: { loginName: userInfo.XingMing, name: userInfo.DengLuMing, roleIndex: roleIndex }, isRegister: 1 };
      }
      //账号未注册
      return { wx_data: resp };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });