viewModel.get("button107lg") &&
  viewModel.get("button107lg").on("click", function (data) {
    // 按钮--单击
    var viewModel = this;
    var proxy = cb.rest.DynamicProxy.create({
      settle: {
        url: "web/function/invoke/AT161E4A7209D00005.test111.terwew1?terminalType=1",
        method: "POST",
        options: {
          domainKey: "yourKeyHere",
          busiObj: null
        }
      }
    });
    //传参
    var reqParams = {
      data: {}
    };
    proxy.settle(reqParams, function (err, result) {
      if (err) {
        cb.utils.alert(err.message, "error");
        return;
      } else {
        cb.utils.alert("保存成功");
      }
    });
  });