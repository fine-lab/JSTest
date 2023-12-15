viewModel.get("button14cd") &&
  viewModel.get("button14cd").on("click", function (data) {
    // 获取工作量--单击
    const value = viewModel.get("num").getValue();
    console.log(value);
    var pose = cb.rest.invokeFunction(
      "AT1613AF5609C80002.sssss.test1",
      {},
      function (err, res) {
        console.log(err);
        console.log(res);
        console.log(pose);
      },
      viewModel,
      { async: false }
    );
    console.log(pose);
  });