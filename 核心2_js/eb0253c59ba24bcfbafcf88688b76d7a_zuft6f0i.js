viewModel.on("afterMount", function (args) {
  debugger;
  viewModel.get("org_id_name").setData("北京安湃声听力科技中心有限公司");
  viewModel.get("org_id").setData("1668354603247206468");
  viewModel.get("item86sb").setData("1697155167851380746");
  viewModel.get("item86sb_name").setValue("11");
});
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    viewModel.get("item86sb").setData("1697155167851380746");
    viewModel.get("item86sb_name").setValue("11");
  });
viewModel.on("beforeSave", (args) => {
  debugger;
  console.log(args);
  console.log("beforeSave");
});
viewModel.on("afterLoadData", function () {
  let user = cb.rest.AppContext.user;
  //查询组织信息 赋值主组织
  debugger;
});