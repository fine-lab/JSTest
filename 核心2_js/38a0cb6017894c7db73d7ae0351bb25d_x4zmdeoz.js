viewModel.on("beforeOpenApproveModel", function () {
  debugger;
  //按角色控制销管确认信息必输
  let userRole = cb.rest.invokeFunction("AT15D266F408300004.backFunction.queryUserRoles", {}, function (err, res) {}, viewModel, { async: false });
  let roleResult = userRole.result.res;
  let haveRole = false;
  for (var i = 0; i < roleResult.length; i++) {
    if (roleResult[i].role_code == "hnxgzj") {
      haveRole = true;
      break;
    }
  }
  if (haveRole) {
    let bianhao = viewModel.get("xiangmuhetongbianhao").getValue();
    let jine = viewModel.get("hetongjine").getValue();
    let dingyueyunjine = viewModel.get("dingyueyunjine").getValue();
    let chengben = viewModel.get("disanfangyingjianjichengben").getValue();
    if (bianhao == null || jine == null || dingyueyunjine == null || chengben == null) {
      cb.utils.alert("销管和人力确认信息必填");
      return false;
    }
  }
});