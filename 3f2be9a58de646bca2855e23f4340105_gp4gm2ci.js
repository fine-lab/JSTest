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
          value1: "1709750064631513097"
        },
        {
          field: "xmLeixing",
          op: "eq",
          value1: null
        }
      ]
    }
  ];
  if (viewModel.getParams().condition?.simpleVOs[0]) {
    args.params.condition.simpleVOs.push(viewModel.getParams().condition?.simpleVOs[0]);
  }
});