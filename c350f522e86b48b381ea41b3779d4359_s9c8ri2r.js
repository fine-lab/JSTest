viewModel.on("customInit", function (data) {
  // 单项预算管控规则--页面初始化
  viewModel.get("button15rj").on("click", function () {
    cb.rest.invokeFunction("GT3407AT1.test.queryBidDetail", { id: "youridHere" }, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });
});