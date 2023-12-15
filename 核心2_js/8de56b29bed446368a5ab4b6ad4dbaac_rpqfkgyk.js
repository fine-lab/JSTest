viewModel.on("customInit", function (data) {
  debugger;
  console.log(123456789);
});
viewModel.on("afterMount", function () {
  //说明：根据domainkey获取用户信息
  var a = cb.utils.getUser("developplatform");
  console.log(a);
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  filtervm.on("afterInit", function () {
    // 进行查询区相关扩展
    filtervm.get("creator").getFromModel().setValue(a.userId);
  });
});
viewModel.get("plane_apply_1529566402638774275") &&
  viewModel.get("plane_apply_1529566402638774275").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源前
  });