viewModel.get("btnCheckRepeatTool") &&
  viewModel.get("btnCheckRepeatTool").on("click", function (data) {
    //查重工具--单击
    cb.rest.invokeFunction("CUST.rule.refreshCust", {}, function (err, res) {
      debugger;
    });
  });