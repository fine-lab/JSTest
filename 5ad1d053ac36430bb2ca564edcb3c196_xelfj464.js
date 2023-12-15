viewModel.get("button20ah") &&
  viewModel.get("button20ah").on("click", function (data) {
    // 加载数据--单击
    cb.rest.invokeFunction("后端函数路径", "传参", "回调处理");
    cb.rest.invokeFunction("AT17631B1817B80009.backOpenApiFunction.loaddata1", {}, function (err, res) {
      console.log(err);
      console.log(res);
    });
    //刷新页面
    viewModel.execute("refresh");
  });