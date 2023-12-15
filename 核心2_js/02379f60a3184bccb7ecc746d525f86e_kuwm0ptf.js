viewModel.get("button22fb") &&
  viewModel.get("button22fb").on("click", function (data) {
    //测试按钮--单击
    cb.rest.invokeFunction("AT18B1B8FE0908000B.api.testCronApi", {}, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });