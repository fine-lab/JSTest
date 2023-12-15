viewModel.on("beforeSearch", function (args) {
  debugger;
  args.isExtend = true;
  //通用检查查询条件
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "enable",
    op: "eq",
    value1: 1
  });
});