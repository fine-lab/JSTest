//查询过滤，过滤掉已经复核的
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "psmx_id",
    op: "eq",
    value1: viewModel.getParams().id
  });
});