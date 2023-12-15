let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var returnMap;
    var type; //1:普通员工 2:部门主管 3:财政部 4:管理员
    var deptid;
    var currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    if (request.type == "1" && (currentUser.name == "殷俊" || currentUser.name == "王霞" || currentUser.name == "张青青" || currentUser.name == "赵敏颖")) {
      type = 5;
      returnMap = { type };
      return { returnMap };
    }
    var userid = currentUser.id;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var resultData = "";
    if ("1" == resultJSON.status && resultJSON.data != null) {
      var userData = resultJSON.data;
      resultData = userData[userid];
    }
    deptid = resultData.deptId;
    let func1 = extrequire("GT60601AT58.backDefaultGroup.getOpenApiToken");
    let resToken = func1.execute();
    var token = resToken.access_token;
    var header = {
      "Content-Type": contenttype
    };
    //根据userId查询是否是当前租户管理员
    var permissonUrl = "https://www.example.com/" + token;
    var permissonData = postman("GET", permissonUrl, JSON.stringify(header), null);
    var permissonMap = JSON.parse(permissonData);
    var map = permissonMap.data;
    if ("200" == permissonMap.code && map != null) {
      for (var i = 0; i < map.length; i++) {
        let mapdata = map[i];
        if (mapdata.userId == userid) {
          type = 4;
          returnMap = { type };
          return { returnMap };
        }
      }
    }
    //根据部门ID获取部门详情
    var deptUrl = "https://www.example.com/" + token + "&id=" + deptid;
    //根据员工ID查询用户
    var staffUrl = "https://www.example.com/" + token;
    //获取下游来源单据是否有上游单据
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var deptrst = "";
    var principal = "";
    var staffresponse = "";
    var staffrst = "";
    let deptResponse = postman("GET", deptUrl, JSON.stringify(header), null);
    let deptresponseobj = JSON.parse(deptResponse);
    if ("200" == deptresponseobj.code) {
      deptrst = deptresponseobj.data;
      principal = deptrst.principal;
      staffresponse = postman("GET", staffUrl + "&id=" + principal, JSON.stringify(header), null);
      let staffresponseobj = JSON.parse(staffresponse);
      if ("200" == staffresponseobj.code) {
        staffrst = staffresponseobj.data;
        if (staffrst.user_id == userid) {
          type = 2;
          returnMap = { type, deptid };
          return { returnMap };
        }
      }
    }
    type = 1;
    returnMap = { type, deptid, userid };
    return { returnMap };
  }
}
exports({ entryPoint: MyAPIHandler });