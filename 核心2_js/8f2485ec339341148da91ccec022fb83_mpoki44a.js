viewModel.get("huibaoshijian") &&
  viewModel.get("huibaoshijian").on("afterValueChange", function (data) {
    // 汇报时间--值改变后
    debugger;
    cb.rest.invokeFunction("75ea899bf8fc495e808b3a51a7b595aa", {}, function (err, res) {});
  });