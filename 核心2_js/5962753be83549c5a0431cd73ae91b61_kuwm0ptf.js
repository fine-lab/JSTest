viewModel.on("beforeSearch", function (args) {
  debugger;
  //工单处理人
  args.isExtend = true;
  args.params.condition.simpleVOs = [
    {
      logicOp: "and",
      conditions: [
        {
          field: "status",
          op: "in",
          value1: ["1", "2", "3", "4", "5", "6", "7"]
        }
      ]
    }
  ];
});