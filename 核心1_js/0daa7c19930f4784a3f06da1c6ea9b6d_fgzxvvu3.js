viewModel.get("button14de") &&
  viewModel.get("button14de").on("click", function (data) {
    // 按钮--单击
    debugger;
    cb.rest.invokeFunction("e79af6f0678e41b99030514775855275", { data }, function (err, res) {
      alert("" + res);
    });
  });