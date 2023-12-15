let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let arr = [];
    let org_id = request.org_id;
    let item425zd = request.item425zd; //当前用户yhtUserID
    var yysobject = { UserOrg: org_id, SysyhtUserId: item425zd, RoleCode: "MULTI101" };
    var yysres = ObjectStore.selectByMap("GT3AT33.GT3AT33.test_Org_UserRole", yysobject);
    let yysjsID = yysres[0].id;
    var zzobject = { test_Org_UserRole_id: yysjsID };
    var zzres = ObjectStore.selectByMap("GT3AT33.GT3AT33.test_Org_UserRole_AuthOrg", zzobject); //运营商管理员管理的所有组织
    if (zzres.length > 0) {
      for (let i = 0; i < zzres.length; i++) {
        if (zzres[i].ContainSubFlag == "1") {
          arr.push(zzres[i].UserManageOrg);
          request.uri = "/yonbip/digitalModel/queryChildrenOrgInfos";
          request.body = { funcType: "adminorg", id: zzres[i].UserManageOrg };
          let Orgfunc = extrequire("GT34544AT7.common.baseOpenApi");
          let Orgfuncres = Orgfunc.execute(request).res;
          if ((Orgfuncres.code = "200")) {
            let orgArr = Orgfuncres.data;
            if (orgArr.length > 0) {
              for (let j = 0; j < orgArr.length; j++) {
                if (orgArr[j].is_biz_unit == 1 && orgArr[j].enable == 1) {
                  arr.push(orgArr[j].id);
                }
              }
            }
          }
        }
      }
    } else {
      var qyglyobject = { UserOrg: org_id, SysyhtUserId: item425zd, RoleCode: "MULTI101" };
      var qyglyres = ObjectStore.selectByMap("GT3AT33.GT3AT33.test_Org_UserRole", qyglyobject);
      let qyglyID = qyglyres[0].id;
      var qyglyzzobject = { test_Org_UserRole_id: qyglyID };
      var qyglyzzres = ObjectStore.selectByMap("GT3AT33.GT3AT33.test_Org_UserRole_AuthOrg", qyglyzzobject); //运营商管理员管理的所有组织
      if (qyglyzzres.length > 0) {
        for (let i = 0; i < qyglyzzres.length; i++) {
          if (qyglyzzres[i].ContainSubFlag == "1") {
            arr.push(qyglyzzres[i].UserManageOrg);
            request.uri = "/yonbip/digitalModel/queryChildrenOrgInfos";
            request.body = { funcType: "adminorg", id: qyglyzzres[i].UserManageOrg };
            let Orgfunc = extrequire("GT34544AT7.common.baseOpenApi");
            let Orgfuncres = Orgfunc.execute(request).res;
            if ((Orgfuncres.code = "200")) {
              let orgArr = Orgfuncres.data;
              if (orgArr.length > 0) {
                for (let j = 0; j < orgArr.length; j++) {
                  if (orgArr[j].is_biz_unit == 1 && orgArr[j].enable == 1) {
                    arr.push(orgArr[j].id);
                  }
                }
              }
            }
          }
        }
      }
    }
    return { arr };
  }
}
exports({ entryPoint: MyAPIHandler });