viewModel.on("customInit", function (data) {
  // 多实体列表--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  args.params.condition.simpleVOs = [
    {
      field: "testChildList.kaishiriqi",
      op: "egt",
      value1: "2022-08-05"
    }
  ];
});