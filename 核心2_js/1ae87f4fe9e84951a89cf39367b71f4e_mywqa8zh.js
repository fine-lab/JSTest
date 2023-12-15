viewModel.on("customInit", function (data) {
  // 现存量表stock.currentstock.CurrentStock--页面初始化
  debugger;
  // 现存量表--页面初始化
  var XianCun1 = viewModel.getParams().XianCun1;
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    var conditions = args.params.condition;
    conditions.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "product",
            op: "eq",
            value1: XianCun1
          }
        ]
      }
    ];
  });
});