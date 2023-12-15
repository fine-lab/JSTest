viewModel.on("customInit", function (data) {
  cb.utils.alert("fffffff");
  //支持人员详情--页面初始化
  viewModel.on("afterSave", function (args) {
    cb.utils.alert("dddd");
  });
});