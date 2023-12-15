viewModel.on("customInit", function (data) {
  // 调用测试详情--页面初始化
  cb.rest.invokeFunction("AT15BF28EE09B00005.backOpenApiFunction.test2", {}, function (err, res) {
    if (err != null) {
      console.log(err);
    } else {
      alert(res.msg);
      window.location = res.url;
    }
  });
});