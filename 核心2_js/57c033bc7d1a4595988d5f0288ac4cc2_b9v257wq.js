viewModel.get("button10xa") &&
  viewModel.get("button10xa").on("click", function (data) {
    //按钮--单击
    let result = cb.rest.invokeFunction("AT18623B800920000A.api.apitest", {}, function (err, res) {}, viewModel, {
      async: false
    });
    console.log(JSON.stringify(result));
  });