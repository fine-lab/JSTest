let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let _status = JSON.parse(param.requestData)._status;
    let note = JSON.parse(param.requestData).note;
    if (_status == "Update" && JSON.parse(param.requestData).test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList !== undefined && note == "审核") {
      let paramreturn = param.return;
      let masterid = paramreturn.id;
      let sunid = paramreturn.test_HistoryOrg_UserRoleList[0].id;
      let mastersql = "select SysUserRole,source_id from GT3AT33.GT3AT33.test_HistoryUserRole where id = '" + masterid + "'";
      let masterres = ObjectStore.queryByYonQL(mastersql);
      let SysUserRole = masterres[0].SysUserRole;
      let HistoryOrg_UserRole = JSON.parse(param.requestData).test_HistoryOrg_UserRoleList[0].note;
      let UptateID = param.return.test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList[0].id;
      var object2 = { id: UptateID, test_History_AuthOrgFk: HistoryOrg_UserRole };
      var res2 = ObjectStore.updateById("GT3AT33.GT3AT33.test_History_AuthOrg", object2, "test_HistoryUserRole1");
      let deleteID = param.return.test_HistoryOrg_UserRoleList[0].id;
      var object1 = { id: deleteID };
      var res1 = ObjectStore.deleteById("GT3AT33.GT3AT33.test_HistoryOrg_UserRole", object1, "test_HistoryUserRole_Child");
      let Org_UserRole = JSON.parse(param.requestData).test_HistoryOrg_UserRoleList[0].Org_UserRole;
      let Org_UserRole_AuthOrg = param.return.test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList[0].Org_UserRole_AuthOrg;
      var object = {
        id: Org_UserRole,
        SysUserRole: SysUserRole,
        HistoryUserRole: masterid,
        HistoryOrg_UserRole: sunid,
        test_Org_UserRole_AuthOrgList: [{ id: Org_UserRole_AuthOrg, History_AuthOrg: UptateID, _status: "Update" }]
      };
      var res = ObjectStore.updateById("GT3AT33.GT3AT33.test_Org_UserRole", object, "cafdeaa1");
    } else if (_status == "Update" && JSON.parse(param.requestData).test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList !== undefined && note == "弃审") {
      let paramreturn = param.return;
      let masterid = paramreturn.id;
      let sunid = paramreturn.test_HistoryOrg_UserRoleList[0].id;
      let mastersql = "select SysUserRole,source_id from GT3AT33.GT3AT33.test_HistoryUserRole where id = '" + masterid + "'";
      let masterres = ObjectStore.queryByYonQL(mastersql);
      let SysUserRole = masterres[0].SysUserRole;
      let HistoryOrg_UserRole = JSON.parse(param.requestData).test_HistoryOrg_UserRoleList[0].note;
      let shunID = param.return.test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList[0].id;
      //删子表
      var object1 = { id: sunid };
      var res1 = ObjectStore.deleteById("GT3AT33.GT3AT33.test_HistoryOrg_UserRole", object1, "test_HistoryUserRole_Child");
      //删孙表
      var object3 = { id: shunID };
      var res3 = ObjectStore.deleteById("GT3AT33.GT3AT33.test_History_AuthOrg", object3, "test_HistoryUserRole1");
      let UptateID = param.return.test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList[0].note;
      let endDate = param.return.test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList[0].endDate;
      let ModifyyhtUserId = param.return.test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList[0].ModifyyhtUserId;
      let ModifyyhtUserName = param.return.test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList[0].ModifyyhtUserName;
      var object2 = { id: UptateID, endDate: endDate, ModifyyhtUserId: ModifyyhtUserId, ModifyyhtUserName: ModifyyhtUserName, DelFlag: "1", Binded: "2" };
      var res2 = ObjectStore.updateById("GT3AT33.GT3AT33.test_History_AuthOrg", object2, "test_HistoryUserRole1");
    } else if (_status == "Update" && JSON.parse(param.requestData).test_HistoryOrg_UserRoleList[0].test_History_AuthOrgList == undefined) {
      let paramreturn = param.return;
      let masterid = paramreturn.id;
      let mastersql = "select SysUserRole,source_id from GT3AT33.GT3AT33.test_HistoryUserRole where id = '" + masterid + "'";
      let masterres = ObjectStore.queryByYonQL(mastersql);
      let SysUserRole = masterres[0].SysUserRole;
      let sunid = paramreturn.test_HistoryOrg_UserRoleList[0].id;
      let Org_UserRole = JSON.parse(param.requestData).test_HistoryOrg_UserRoleList[0].Org_UserRole;
      var object = { id: Org_UserRole, SysUserRole: SysUserRole, HistoryUserRole: masterid, HistoryOrg_UserRole: sunid };
      var res = ObjectStore.updateById("GT3AT33.GT3AT33.test_Org_UserRole", object, "cafdeaa1");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });