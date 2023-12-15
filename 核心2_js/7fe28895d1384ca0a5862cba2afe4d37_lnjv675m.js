viewModel.get("ManageDept_name") &&
  viewModel.get("ManageDept_name").on("afterValueChange", function (data) {
    // 当前所属部门(系统)--值改变后
  });
viewModel.on("customInit", function (data) {
  // 我的银行账户详情--页面初始化
});
viewModel.get("ManageDept_name").on("beforeBrowse", function () {
  var promise = new cb.promise();
  let ManageDept_name = viewModel.get("ManageDept_name");
  let org_id = viewModel.get("org_id").getValue();
  cb.rest.invokeFunction("GT34544AT7.authManager.getAllDeptJoin", { org_id: org_id }, function (err, res) {
    if (err) {
      console.log("err", err.message);
    }
    let deptArr = res.deptArr;
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "id",
      op: "in",
      value1: deptArr
    });
    ManageDept_name.setTreeFilter(condition);
    promise.resolve();
  });
  return promise;
});