viewModel.on("customInit", function (data) {
  // 手动删除用户角色--页面初始化
});
viewModel.get("button23ga") &&
  viewModel.get("button23ga").on("click", function (data) {
    // 解绑--单击
    var currentRow = viewModel.getGridModel().getRow(data.index);
    let roleId = currentRow["role"];
    let userId = currentRow["SysyhtUserId"];
    cb.rest.invokeFunction("GT34544AT7.authManager.unbindUsersAndRole", { roleId, userId }, function (err, res) {
      console.log(res);
    });
  });