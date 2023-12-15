viewModel.on("customInit", function (data) {
  //考题难度分类2详情--页面初始化
  console.log("22222222222222");
});
viewModel.on("beforeSave", function (args) {
  console.log("--------------");
  cb.utils.alert("ffffffffffffffffff");
  return false;
});