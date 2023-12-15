viewModel.get("button24ab") &&
  viewModel.get("button24ab").on("click", function (data) {
    cb.rest.invokeFunction("GT1972AT1.TEST01.CRMT0001", { r: 2 }, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });
viewModel.on("customInit", function (data) {
  // 员工信息--页面初始化
});