viewModel.on("customInit", function (data) {
  //伙伴资源看板--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  const pageType = viewModel.getParams().query.pageType || false;
  if (pageType == "beforehandInvest") {
    args.params.condition.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "part_is_pre_invest2",
            op: "eq",
            value1: "Y"
          }
        ]
      }
    ];
  } else {
    args.params.condition.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "part_is_pre_invest2",
            op: "eq",
            value1: "N"
          }
        ]
      }
    ];
  }
});
//页面DOM加载完成
viewModel.on("afterMount", function () {
  const pageTypeName = viewModel.getParams().query.pageType || false;
  if (pageTypeName == "beforehandInvestNo") {
    console.log("afterMount:beforehandInvestNo");
    viewModel.get("btnAdd").setVisible(false);
    viewModel.get("btnImportDrop").setVisible(false);
  }
});