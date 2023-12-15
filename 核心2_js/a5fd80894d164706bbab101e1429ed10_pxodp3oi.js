viewModel.get("button24ah") &&
  viewModel.get("button24ah").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT16ACB41608F0000B.apiTest.sendMessageApi", {}, function (err, res) {
      alert(JSON.stringify(res));
    });
  });