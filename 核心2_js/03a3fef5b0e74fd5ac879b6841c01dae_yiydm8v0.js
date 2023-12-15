viewModel.get("button16oj") &&
  viewModel.get("button16oj").on("click", function (data) {
    // 调用api--单击
    cb.rest.invokeFunction("GZTBDM.backDesignerFunction.apitest", {}, function (err, res) {
      alert(res.s);
    });
  });