viewModel.on("customInit", function (data) {
  // 可使用名额--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  var promise = new cb.promise();
  cb.rest.invokeFunction("GT34544AT7.authManager.getAppContext", {}, function (err, res) {
    console.log("你的组织单元");
    let orgid = res.res.currentUser.orgId;
    console.log(orgid);
    args.params.condition.simpleVOs = [];
    args.params.condition.simpleVOs.push({
      field: "UseOrg",
      op: "eq",
      value1: orgid
    });
    args.params.condition.simpleVOs.push({
      field: "CloseFlag",
      op: "eq",
      value1: "0"
    });
    promise.resolve();
  });
  return promise;
});