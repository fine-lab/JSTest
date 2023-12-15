viewModel.get("extend99_code") &&
  viewModel.get("extend99_code").on("afterReferOkClick", function (data) {
    //销售订单(系统)--参照弹窗确认按钮点击后
    cb.rest.invokeFunction("7421612d27fa403c89a3010d54528548", { id: "youridHere" }, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });