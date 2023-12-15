viewModel.on("customInit", function (data) {
  //伙伴03详情--页面初始化
  viewModel.on("beforeSave", function (args) {
    cb.utils.alert("ceshi");
  });
});