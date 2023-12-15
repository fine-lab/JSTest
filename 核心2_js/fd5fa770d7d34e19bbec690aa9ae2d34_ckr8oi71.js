viewModel.get("zhuzhipici_picihao") &&
  viewModel.get("zhuzhipici_picihao").on("afterValueChange", function (data) {
    // 批次号--值改变后
    debugger;
    var liaoyao = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.steppedCost", { data: data }, function (err, res) {}, viewModel, { async: false });
    if (liaoyao.error) {
      cb.utils.alert("错误原因:" + liaoyao.error.message);
      return;
    }
    var Batchrice = liaoyao.result.Batchrice;
    viewModel.get("liaoyaomiao").setValue(Batchrice);
    var qijian = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.periodExpense", { data: data }, function (err, res) {}, viewModel, { async: false });
    if (qijian.error) {
      cb.utils.alert("错误原因:" + qijian.error.message);
      return;
    }
    var periodCost = qijian.result.periodCost;
    viewModel.get("ziduan3").setValue(periodCost);
    var zhejiu = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.Depreciation", { data: data }, function (err, res) {}, viewModel, { async: false });
    //待摊总额
    var totalUnamort = Batchrice + periodCost;
    viewModel.get("daitanzonge").setValue(totalUnamort);
    var zhejiu = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.updStage", { data: data }, function (err, res) {}, viewModel, { async: false });
  });