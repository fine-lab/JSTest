viewModel.on("customInit", function (data) {
  // 测试主子_app详情--页面初始化
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    //通用检查查询条件
    var commonVOs = args.params.condition.commonVOs;
    commonVOs.push({
      itemName: "new1",
      op: "gt",
      value1: c11
    });
  });
});