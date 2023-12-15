viewModel.get("button28af") &&
  viewModel.get("button28af").on("click", function (data) {
    //按钮--单击
    var ss = localStorage.valueOf();
    var ress = cb.rest.invokeFunction("AT161E5DFA09D00001.backOpenApiFunction.test01", { localStorage: ss }, function (err, res) {}, viewModel, { async: false });
    debugger;
  });