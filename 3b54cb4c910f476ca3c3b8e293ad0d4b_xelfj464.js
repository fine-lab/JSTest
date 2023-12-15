viewModel.get("button18aa") &&
  viewModel.get("button18aa").on("click", function (data) {
    // 加载数据--单击
    cb.rest.invokeFunction("后端API函数路径", "传参", "回调处理");
    cb.rest.invokeFunction("AT17631B1817B80009.backOpenApiFunction.loaddata1", {}, function (err, res) {
      console.log(err);
      console.log(res);
    });
    //刷新页面
    viewModel.execute("refresh");
  });
viewModel.get("button24ag").on("click", function (data) {
  // 批量插入--单击
  // 批量插入--单击
  cb.rest.invokeFunction("AT17631B1817B80009.backOpenApiFunction.insert01", {}, function (err, res) {});
  setTimeout(() => {
    viewModel.execute("refresh");
  }, 10);
});