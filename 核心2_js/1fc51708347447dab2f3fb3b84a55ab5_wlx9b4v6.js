viewModel.get("qiyemingchen_gongsimingche_gongsimingchen") &&
  viewModel.get("qiyemingchen_gongsimingche_gongsimingchen").on("afterValueChange", function (data) {
    // 企业名称--值改变后
    var qiye = viewModel.get("qiyemingchen").getValue();
    var tt = cb.rest.invokeFunction("29224256806942a19422e9490d242728", { qiye: qiye }, function (err, res) {}, viewModel, { async: false });
    if (tt.result.res != undefined && tt.result.res != "") {
      viewModel.get("keyongjifen").setValue(tt.result.res);
    }
    if (tt.result.res == "0") {
      viewModel.get("keyongjifen").setValue(tt.result.res);
    }
  });