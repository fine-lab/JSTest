viewModel.on("customInit", function (data) {
  // 银行账号管理--页面初始化
  viewModel.on("beforeSearch", function (args) {
    var promise = new cb.promise();
    cb.rest.invokeFunction("GT34544AT7.user.myUserInfoDeal", {}, function (err, res) {
      //获取当前用户组织id
      let orgID = res.currentUser.orgId;
      args.isExtend = true;
      //通用检查查询条件
      args.params.condition.simpleVOs = [];
      args.params.condition.simpleVOs.push({
        field: "baseOrg",
        op: "eq",
        value1: orgID
      });
      promise.resolve();
    });
    return promise;
  });
});