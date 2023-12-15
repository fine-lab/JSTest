viewModel.get("fljsjg_1737009629573939206") &&
  viewModel.get("fljsjg_1737009629573939206").on("afterSetDataSource", function (data) {
    // 返利计算结果--设置数据源后
    debugger;
    for (var i = 0; i < data.length; i++) {
      let fljsje = data[i];
      let res = cb.rest.invokeFunction("4e8f720f324e4422bfc73a42b6d5adb2", { id: fljsje.id, qushuguize: fljsje.qushuguize_name }, null, viewModel, { async: false });
      viewModel.get("fljsjg_1737009629573939206").setCellValue(i, "item148he", res.result.jisuanjine);
    }
  });