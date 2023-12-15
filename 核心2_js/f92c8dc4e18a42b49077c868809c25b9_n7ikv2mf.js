viewModel.on("customInit", function (data) {
  var bh = viewModel.get("params").abnormalevent;
  viewModel.on("afterMount", function () {
    // 获取查询区模型
    const filtervm = viewModel.getCache("FilterViewModel");
    filtervm.on("afterInit", function () {
      // 进行查询区相关扩展
      filtervm.get("abnormalevent").getFromModel().setValue(bh);
    });
  });
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
    commonVOs.push({
      itemName: "billType",
      op: "eq",
      value1: "YonSuite"
    });
  });
});