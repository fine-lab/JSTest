viewModel.get("button14bg") &&
  viewModel.get("button14bg").on("click", function (data) {
    // 按钮--单击
    let no = viewModel.get("idno").getValue();
    cb.rest.invokeFunction(
      "AT174D973E08600008.api.fuzhi0428",
      { no: no },
      function (err, res) {
        console.log(err);
        console.log(res);
      }
    );
    debugger;
  });