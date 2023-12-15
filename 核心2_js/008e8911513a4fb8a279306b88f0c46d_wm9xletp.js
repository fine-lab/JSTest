viewModel.get("button33og") &&
  viewModel.get("button33og").on("click", function (data) {
    // 按钮--单击
    debugger;
    const value = viewModel.get("insetnew2").getValue();
    const res = JSON.parse(value);
    cb.rest.invokeFunction("dd722dfa59cc4bf4aaa72b1f661f7880", { res }, function (err, res) {
      const resa = JSON.parse(err.message);
      cb.utils.alert(resa);
    });
  });
viewModel.on("customInit", function (data) {
});