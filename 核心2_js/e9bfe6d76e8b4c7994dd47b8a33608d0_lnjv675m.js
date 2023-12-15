viewModel.get("button27mg") &&
  viewModel.get("button27mg").on("click", function (data) {
    // 生成商品--单击
    viewModel.get("flowbutton31ae").execute("click");
    viewModel.get("flowbutton23ki").execute("click");
    let btn = viewModel.get("flowbutton23ki");
    btn.execute("click");
    btn = viewModel.get("btnBatchDelete");
    btn.execute("click");
  });
viewModel.on("customInit", function (data) {
  // 脚本触发业务流--页面初始化
});