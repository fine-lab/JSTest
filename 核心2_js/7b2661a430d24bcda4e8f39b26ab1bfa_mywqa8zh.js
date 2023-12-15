viewModel.on("customInit", function (data) {
  debugger;
  //阅读记录查询--页面初始化
  var lookLog = viewModel.getParams().abnormalevent;
  viewModel.on("afterMount", function (args) {
    args.isExtend = true;
    var conditions = args.params.condition;
    conditions.simpleVOs = [
      {
        logicOp: "and",
        conditions: [
          {
            field: "content",
            op: "eq",
            value1: lookLog.content
          }
        ]
      }
    ];
    // 获取查询区模型
  });
});