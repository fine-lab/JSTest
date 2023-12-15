viewModel.get("huibaoshijian") &&
  viewModel.get("huibaoshijian").on("beforeValueChange", function (data) {
    // 汇报时间--值改变前
  });
viewModel.get("huibaoshijian") &&
  viewModel.get("huibaoshijian").on("afterValueChange", function (data) {
    // 汇报时间--值改变后
    cb.rest.invokeFunction("7dac0d3ca2de447f82ef599f384144a6", { r: 2 }, function (err, res) {
      alert(res);
      debugger;
      alert(err);
    });
  });