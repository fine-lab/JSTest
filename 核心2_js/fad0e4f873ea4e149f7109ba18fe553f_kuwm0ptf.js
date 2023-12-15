viewModel.on("customInit", function (data) {
  // 现存量_app--页面初始化
  var productId = viewModel.getParams().productId;
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
            value1: productId
          }
        ]
      }
    ];
  });
});