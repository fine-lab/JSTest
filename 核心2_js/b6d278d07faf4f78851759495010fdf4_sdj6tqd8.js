viewModel.get("button22ef") &&
  viewModel.get("button22ef").on("click", function (data) {
    //汇总--单击
    cb.rest.invokeFunction("AT1862650009200008.backOpenApiFunction.orderSumCs", {}, function (err, res) {});
  });
viewModel.get("button44kc") &&
  viewModel.get("button44kc").on("click", function (data) {
    //销售订单接口--单击
    cb.rest.invokeFunction("AT1862650009200008.backOpenApiFunction.singleSave", {}, function (err, res) {});
  });