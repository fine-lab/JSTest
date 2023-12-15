viewModel.get("button24tb") &&
  viewModel.get("button24tb").on("click", function (data) {
    //按钮1--单击
    debugger;
    var result = cb.rest.invokeFunction("GT2680AT6.nxbApi.selectProduct", {}, function (err, res) {}, viewModel, { async: false });
    alert(JSON.stringify(result));
  });