viewModel.on("customInit", function (data) {
  // 内部合同--页面初始化
  let gridModel = viewModel.getGridModel();
  var commonVOs, reqCondition, permissions, alldata;
  var deptid;
});
viewModel.on("customInit", function (data) {
  //内部合同--页面初始化
});
viewModel.get("button26yc").on("click", (args) => {
  let pkOrg = viewModel.getGridModel().getRowsByIndexes([args.index])[0].pk_org_v;
  let id = viewModel.getGridModel().getRowsByIndexes([args.index])[0].id;
  cb.rest.invokeFunction("AT168837E809980003.backDesignerFunction.updateOrg", { id: id, pkOrg: pkOrg }, function (err, res) {
    debugger;
    if (res.res) {
      cb.utils.alert("更新成功");
    }
  });
});