//页面DOM加载完成
viewModel.on("afterMount", function () {
  // 获取查询区模型
  const filtervm = viewModel.getCache("FilterViewModel");
  let result = cb.rest.invokeFunction(
    "GT3AT2.backDesignerFunction.getSupplyByUser",
    {},
    function (err, res) {
      debugger;
      console.log(res);
    },
    viewModel,
    { async: false }
  );
  debugger;
  // 检索之前进行条件过滤
  filtervm.on("beforeSearch", function (args) {
    debugger;
    if (result.result.data.length != 0 && aresult.result.data[0].id) {
      args.isExtend = true;
      //通用检查查询条件
      var commonVOs = args.commonVOs;
      commonVOs.push({
        itemName: "shoujianren_contactname",
        op: "eq",
        value1: result.result.data[0].id
      });
    }
  });
});