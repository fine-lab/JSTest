viewModel.on("customInit", function (data) {
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
    commonVOs.push({
      itemName: "billType",
      op: "eq",
      value1: "U9C"
    });
  });
});