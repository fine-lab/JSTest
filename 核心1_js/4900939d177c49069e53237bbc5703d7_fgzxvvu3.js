viewModel.on("customInit", function (data) {
  // 用户新增--页面初始化
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  console.log("xxxxx:" + gridModel);
  gridModel.setState("showRowNo", true);
  //获取表格行模型（编辑态）
  gridModel.getEditRowModel();
  let name = gridModel.getEditRowModel().get("name");
  //设置表格列CSS样式
  gridModel.setColumnState("email", "style", { backgroundColor: "red" });
  console.log(name);
  viewModel.get("button45tf") &&
    viewModel.get("button45tf").on("click", function (data) {
      alert(1112);
      var email = viewModel.get("name").getValue();
      alert(email);
      // 订单增加计算--单击
      cb.rest.invokeFunction("AT1619118217600004.apiCode.updateEmail", {}, function (err, res) {});
    });
});
viewModel.get("button50dj") &&
  viewModel.get("button50dj").on("click", function (data) {
    // 撤销折扣计算--单击
    alert(5555);
  });