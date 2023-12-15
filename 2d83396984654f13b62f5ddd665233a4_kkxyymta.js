viewModel.on("customInit", function (data) {
  // 物料分类--页面初始化
  cb.rest.invokeFunction("GZTBDM.bbb.apidy", {}, function (err, res) {
    alert(res.s);
  });
});