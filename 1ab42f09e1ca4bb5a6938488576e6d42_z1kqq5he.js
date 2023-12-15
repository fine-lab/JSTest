viewModel.get("button14yj") &&
  viewModel.get("button14yj").on("click", function (data) {
    //按钮--单击
    cb.rest.invokeFunction("GT0000TEN0.jc.subscribe", {}, function (err, res) {
      var cc = JSON.parse(res);
      alert(cc.get("code"));
    });
  });