let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let SysUser = data.SysUser;
    let org_id = data.org_id;
    let test_GxyService = data.test_GxyService;
    let Numbersql =
      "select count(id) from GT3AT33.GT3AT33.test_Org_UserRole where dr = 0 and SysUser = '" +
      SysUser +
      "' and charge = '1' and org_id = '" +
      org_id +
      "' and test_GxyService = '" +
      test_GxyService +
      "'";
    let count = ObjectStore.queryByYonQL(Numbersql)[0].id;
    if (count == 0) {
      let test_GxyService = data.test_GxyService; //供销云服务ID
      let OrderOrg = data.OrderOrg;
      let test_GxyServicesql =
        "select UsedUserquantity,UnusedUserquantity,id from GT3AT33.GT3AT33.test_OrderService where test_GxyService = '" +
        test_GxyService +
        "' and dr = 0 and enable = 1 and org_id ='" +
        OrderOrg +
        "'";
      let test_GxyServiceres = ObjectStore.queryByYonQL(test_GxyServicesql);
      if (test_GxyServiceres[0] !== undefined) {
        let UsedUserquantity = test_GxyServiceres[0].UsedUserquantity;
        let UnusedUserquantity = test_GxyServiceres[0].UnusedUserquantity;
        if (UnusedUserquantity > 0) {
          var test_GxyServiceobject = { id: test_GxyServiceres[0].id, UsedUserquantity: UsedUserquantity + 1, UnusedUserquantity: UnusedUserquantity - 1 };
          var res = ObjectStore.updateById("GT3AT33.GT3AT33.test_OrderService", test_GxyServiceobject, "3677f4d7");
        } else {
          throw new Error("用户可使用数不足，请联系管理员！（主表）");
        }
      } else {
      }
      let org_id = data.org_id; //服务使用组织ID
      let test_Org_UserRolesql =
        "select UsedUserquantity,UnusedUserquantity,id from GT3AT33.GT3AT33.test_OrderServiceUseOrg where UseOrg = '" + org_id + "' and dr = 0 and test_GxyService = '" + test_GxyService + "'";
      let test_Org_UserRoleres = ObjectStore.queryByYonQL(test_Org_UserRolesql);
      if (test_Org_UserRoleres.length > 0) {
        let UsedUserquantity = test_Org_UserRoleres[0].UsedUserquantity;
        let UnusedUserquantity = test_Org_UserRoleres[0].UnusedUserquantity;
        let test_Org_UserRoleID = test_Org_UserRoleres[0].id;
        if (UnusedUserquantity > 0) {
          var test_Org_UserRoleobject = { id: test_Org_UserRoleID, UsedUserquantity: UsedUserquantity + 1, UnusedUserquantity: UnusedUserquantity - 1 };
          var res = ObjectStore.updateById("GT3AT33.GT3AT33.test_OrderServiceUseOrg", test_Org_UserRoleobject, "yb8f1e980f");
        } else {
          throw new Error("用户可使用数不足，请联系管理员！（子表）");
        }
      } else {
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });