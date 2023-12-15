viewModel.get("button22uh") &&
  viewModel.get("button22uh").on("click", function (data) {
    //同步--单击
    cb.rest.invokeFunction(
      "AT1862650009200008.backOpenApiFunction.posOrderData",
      {},
      function (err, res) {
        if (err) {
          cb.utils.alert(err);
        } else if (res) {
          var temp = JSON.parse(res.strResponse);
          cb.utils.alert("同步成功");
        }
      }
    );
  });
viewModel.get("button44oh") &&
  viewModel.get("button44oh").on("click", function (data) {
    //测试--单击
    cb.rest.invokeFunction("AT1862650009200008.backOpenApiFunction.ceshi", {}, function (err, res) {
      if (err) {
        cb.utils.alert(err);
      } else if (res) {
        cb.utils.alert("同步成功");
      }
    });
  });