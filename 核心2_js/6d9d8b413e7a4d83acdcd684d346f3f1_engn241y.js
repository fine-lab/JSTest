let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var currentUser = JSON.parse(AppContext()).currentUser;
    var sysId = "yourIdHere";
    var tenantId = currentUser.tenantId;
    var userids = [currentUser.id];
    var result = listOrgAndDeptByUserIds(sysId, tenantId, userids);
    var resultJSON = JSON.parse(result);
    var userid;
    var deptid;
    var deptCode;
    var orgid;
    var usercode;
    var orgCode;
    if ("1" == resultJSON.status && resultJSON.data != null) {
      //根据当前用户信息去查询员工表
      var userData = resultJSON.data;
      //业务系统员工id
      userid = userData[currentUser.id].id;
      deptid = userData[currentUser.id].deptId;
      orgid = userData[currentUser.id].orgId;
      usercode = userData[currentUser.id].code;
      deptCode = userData[currentUser.id].deptCode;
      orgCode = userData[currentUser.id].orgCode;
    } else {
      throw new Error("获取员工信息异常");
    }
    var retorgid = [];
    var retdeptid = [];
    var useridrole;
    var doctype;
    if (request.custdoctype != undefined) {
      if ("1" == resultJSON.status && resultJSON.data != null) {
        var userDatas = resultJSON.data;
        useridrole = userDatas[currentUser.id].id;
        doctype = request.custdoctype;
        var resa = ObjectStore.queryByYonQL(
          "select kongzhiweidu,zuzhiweidu,bumenweidu from AT163DA72808680006.AT163DA72808680006.HT_QXKZZB where HT_QXKZ_id in (select id from AT163DA72808680006.AT163DA72808680006.HT_QXKZ where danjumingcheng = '" +
            doctype +
            "' ) and staffNew='" +
            useridrole +
            "' "
        );
        if (resa !== null) {
          for (var x = 0; x < resa.length; x++) {
            //控制维度枚举组织是2，部门是1
            if (resa[x].kongzhiweidu == "2") {
              retorgid.push(resa[x].zuzhiweidu);
            }
            if (resa[x].kongzhiweidu == "1") {
              retdeptid.push(resa[x].bumenweidu);
            }
          }
        }
      } else {
        throw new Error("获取员工信息异常");
      }
    }
    return { orgid: orgid, deptCode: deptCode, usercode: usercode, userid: userid, retorgid: retorgid, retdeptid: retdeptid };
  }
}
exports({ entryPoint: MyAPIHandler });