viewModel.get("button24oj") &&
  viewModel.get("button24oj").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT165369EC09000003.apifunc.ValuesScoreQry", { staffId: "yourIdHere", valuesId: "2" }, function (err, res) {
      debugger;
    });
  });