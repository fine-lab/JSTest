viewModel.get("button13ae") &&
  viewModel.get("button13ae").on("click", function (data) {
    //按钮--单击
  });
viewModel.get("button10vg") &&
  viewModel.get("button10vg").on("click", function (data) {
    //按钮--单击
    cb.rest.invokeFunction("HRTMESS.rule.testapi", {}, function (err, res) {
      alert(res.s);
    });
  });
viewModel.get("handover") &&
  viewModel.get("handover").on("afterValueChange", function (data) {
    //交接人--值改变后
    cb.rest.invokeFunction("HRTMESS.rule.testapi", {}, function (err, res) {
      alert(res.s);
    });
  });