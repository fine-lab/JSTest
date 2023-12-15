viewModel.on("customInit", function (data) {
  //获取选择行
  viewModel.on("beforeAdd", function (args) {
    var level = args.params.parent.level;
    if (level != null && "undefined" != level) {
      if (level == 2) {
        cb.utils.alert("最多只能增加2级标签");
        return false;
      }
    }
  });
});