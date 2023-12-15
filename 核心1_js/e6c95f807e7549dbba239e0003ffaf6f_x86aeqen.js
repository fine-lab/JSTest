viewModel.on("customInit", function (data) {
  // 函数1125详情--页面初始化
  cb.rest.invokeFunction("GT0000TEN0.aaa.apitest", {}, function (err, res) {
    alert(res.s);
  });
});
viewModel.get("riqi") &&
  viewModel.get("riqi").on("afterValueChange", function (data) {
    // 日期--值改变后
    console.log("after value change12345");
  });
viewModel.get("zidyi") &&
  viewModel.get("zidyi").get("te1119") &&
  viewModel
    .get("zidyi")
    .get("te1119")
    .on("beforeValueChange", function (data) {
      // 特征文本1119--值改变前
      alert("test fornt");
    });