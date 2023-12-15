viewModel.on("customInit", function (data) {
  // 主子_lxf--页面初始化
  var viewModel = this;
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    //通用检查查询条件
    var commonVOs = args.params.condition.commonVOs;
    commonVOs.push({
      itemName: "new3",
      op: "like",
      value1: "3"
    });
  });
});