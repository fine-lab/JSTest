viewModel.on("afterMount", function (data) {
  // 库存嵌入页详情--页面初始化
  debugger;
  let condition = viewModel.__data && viewModel.__data.cache && viewModel.__data.cache.condition;
  let condition2 = viewModel.getCache("condition");
  if (!condition) {
    cb.utils.alert("请选择列表行！", "error");
  } else {
    let itemCode = condition.commonVOs[2] && condition.commonVOs[2].value1;
    let selectId = viewModel.getCache("parentViewModel").getCache("selectId");
    if (!itemCode) {
      cb.utils.alert("请选择列表行！", "error");
    } else {
      cb.rest.invokeFunction("AT173E4CEE16E80007.backOpenApiFunction.createStockData", { itemCode: itemCode, selectId }, function (err, res) {
        viewModel.setData(res);
      });
    }
  }
});