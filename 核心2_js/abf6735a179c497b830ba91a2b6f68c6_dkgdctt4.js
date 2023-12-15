viewModel.get("extend46") &&
  viewModel.get("extend46").on("blur", function (data) {
    //通用信息--失去焦点的回调
    cb.rest.invokeFunction("HRTMESS.rule.neweapi", {}, function (err, res) {
      alert(res.s);
    });
  });