viewModel.get("button20hd") &&
  viewModel.get("button20hd").on("click", function (data) {
    // 加载数据--单击
    cb.rest.invokeFunction("后端API函数路径", "传参", "回调处理");
    cb.rest.invokeFunction("AT17631B1817B80009.backOpenApiFunction.loaddata1", {}, function (err, res) {
      console.log(err);
      console.log(res);
    });
    //刷新页面
    viewModel.execute("refresh");
  });
//调用后端api函数2-insert01
viewModel.get("button25sk").on("click", function (data) {
  // 批量插入--单击
  cb.rest.invokeFunction("AT17631B1817B80009.backOpenApiFunction.insert01", {}, function (err, res) {});
  setTimeout(() => {
    viewModel.execute("refresh");
  }, 10);
});