viewModel.on("customInit", function (data) {
  //店铺1108--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  let result = cb.rest.invokeFunction("AT19C69B2808680004.API.getAuthor", {}, function (err, res) {}, viewModel, { async: false });
  console.log("======>", JSON.stringify(result));
  args.isExtend = true;
  args.params.condition.simpleVOs = [
    {
      logicOp: "and",
      conditions: [
        {
          field: "name",
          op: "in",
          value1: result.result.arr
        }
      ]
    }
  ];
});