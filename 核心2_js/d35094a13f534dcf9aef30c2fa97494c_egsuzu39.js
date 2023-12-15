viewModel.get("button27oa") &&
  viewModel.get("button27oa").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("saoma_id") &&
  viewModel.get("saoma_id").on("click", function (data) {
    var result = null;
    mtl.scanQRCode({
      scanType: ["qrCode", "barCode"],
      needResult: 1,
      success: function (res) {
        result = res.resultStr;
      },
      fail: function (err) {
        var message = err.message; // 错误信息
        console.log(message);
      }
    });
    console.log(result);
  });