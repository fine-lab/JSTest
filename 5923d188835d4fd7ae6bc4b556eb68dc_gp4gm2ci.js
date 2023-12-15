viewModel.on("customInit", function (data) {
  //操作记录详情--页面初始化
  viewModel.on("afterSave", function (args) {
    var name = args.res.caozuomingchen;
    cb.utils.alert(name);
    return true;
  });
});