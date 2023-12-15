viewModel.get("button1tk") &&
  viewModel.get("button1tk").on("click", function (data) {
    // 收款数据处理--单击
    cb.rest.invokeFunction("AT17C47D1409580006.saleOrderQS.lssjclSK", {}, function (err, res) {});
  });
viewModel.get("button2sk") &&
  viewModel.get("button2sk").on("click", function (data) {
    //签收单数据处理--单击
    cb.rest.invokeFunction("AT17C47D1409580006.saleOrderQS.lssjclQS", {}, function (err, res) {});
  });
viewModel.get("button3zd") &&
  viewModel.get("button3zd").on("click", function (data) {
    //测试--单击
    cb.rest.invokeFunction("AT17C47D1409580006.shibin.testApi2", {}, function (err, res) {});
  });