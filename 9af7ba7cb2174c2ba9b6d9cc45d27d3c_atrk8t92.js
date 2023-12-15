viewModel.get("button14ib") &&
  viewModel.get("button14ib").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT168255FC17080007.houduanhanshu.getRule", {}, function (err, res) {
      if (err) {
        cb.utils.alert(err);
      } else {
        cb.utils.alert(res);
      }
    });
  });