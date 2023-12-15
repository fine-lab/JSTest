viewModel.on("customInit", function (data) {
  // 发货单主表页面--页面初始化
  var viewModel = this;
  //如果同时过滤多个数据下发如下：
  viewModel.on("beforeSearch", function (args) {
    console.log(args);
    args.params.condition.simpleVOs = [
      {
        field: "deliveryDetails.extendWriteStatus",
        op: "eq",
        value1: "~"
      }
    ];
  });
});