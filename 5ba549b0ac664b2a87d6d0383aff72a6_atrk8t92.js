viewModel.get("button19tg") &&
  viewModel.get("button19tg").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT15BFE8B816C80007.frontDesignerFunction.sendMessage", { code: "11" }, function (err, res) {
      if (err) {
        cb.utils.alert(err);
      } else if (res) {
        cb.utils.alert(res);
      }
    });
  });