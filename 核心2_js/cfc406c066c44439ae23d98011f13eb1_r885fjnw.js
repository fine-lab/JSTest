viewModel.on("customInit", function (data) {
  // 员工档案详情--页面初始化
  // 数据加载完之后执行
  viewModel.on("afterLoadData", function () {
    //获取表格模型
    //表格编码：  实体编码+List后缀
    var gridModel = viewModel.get("role1230List");
    debugger;
    // 获取任职信息的所有数据
    var gridModelData = gridModel.getAllData();
    var gridModel2 = viewModel.get("test2222List");
    // 获取任职数据方式2
    // 调用API函数
    console.log(gridModelData);
    cb.rest.invokeFunction("AT168D900209980004.backDesignerFunction.getAllStaffs", { id: "youridHere" }, function (err, res) {
      console.log("获取员工信息");
      console.log(err, res);
    });
    // 数据处理
    // 赋值到表格2
  });
});
viewModel.get("button33de") &&
  viewModel.get("button33de").on("click", function (data) {
    // 按钮--单击
    // 弹窗显示一个页面（得先画一个页面）
  });