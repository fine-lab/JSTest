viewModel.on("afterMount", () => {
  const filterViewModel = viewModel.getCache("FilterViewModel");
  // 隐藏查询区
  filterViewModel.setState("bHideFilterScheme", true);
});
viewModel.on("beforeSearch", function (args) {
  args.params.condition.simpleVOs = [
    {
      logicOp: "or",
      conditions: [
        {
          field: "xmLeixing",
          op: "eq",
          value1: "1709750021681840132"
        },
        {
          field: "xmLeixing",
          op: "eq",
          value1: "1709749944372428805"
        },
        {
          field: "xmLeixing",
          op: "eq",
          value1: "1709749875660292105"
        },
        {
          field: "xmLeixing",
          op: "eq",
          value1: "1709749824120684547"
        }
      ]
    }
  ];
  if (viewModel.getParams().condition?.simpleVOs[0]) {
    args.params.condition.simpleVOs.push(viewModel.getParams().condition?.simpleVOs[0]);
  }
});