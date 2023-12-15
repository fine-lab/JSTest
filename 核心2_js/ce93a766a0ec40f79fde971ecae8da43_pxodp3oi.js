viewModel.on("customInit", function (data) {
  // 自动更新富通新改数据--页面初始化
  let rolesRest = cb.rest.invokeFunction("GT3734AT5.APIFunc.getUsrRoles", {}, function (err, res) {}, viewModel, { async: false });
  let resObj = rolesRest.result;
  let roles = resObj.roles;
  let chkRoleRst = chkUsrRole(roles, ["5e8259dd-6fa1-4321-88d2-68c9b91ae512"], "id");
  debugger;
});
let chkUsrRole = (roles, roleParams, fieldName) => {
  for (var i in roleParams) {
    let roleParam = roleParams[i];
    for (var j in roles) {
      let roleObj = roles[j];
      let roleVal = fieldName == "id" ? roleObj.role_id : roleObj.role_name;
      if (roleVal == roleParam) {
        return true;
      }
    }
  }
  return false;
};