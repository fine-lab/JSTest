viewModel.get("button15te") &&
  viewModel.get("button15te").on("click", function (data) {
    // 生成凭证--单击
    data = viewModel.getData();
    if (cb.utils.isEmpty(data.voucherID)) {
      cb.rest.invokeFunction("GT104180AT23.Voucher.JoinStock", data, function (err, res) {
        if (res.Voucher.code == "200") {
          cb.utils.alert("凭证生成成功！", "success");
        } else {
          cb.utils.alert("凭证生成失败！", "error");
          cb.utils.alert(res.Voucher.message, "error");
        }
      });
    } else {
      cb.utils.alert("凭证生成成功！", "success");
    }
  });