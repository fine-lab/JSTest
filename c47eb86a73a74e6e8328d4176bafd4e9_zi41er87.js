viewModel.get("button35ae") &&
  viewModel.get("button35ae").on("click", function (data) {
    // 按钮--单击
    cb.rest.invokeFunction("AT16AFF5EC1628000B.thirdlevel.testapi", {}, function (err, res) {
      alert(res.z);
    });
  });