viewModel.get("headFreeItem!define9_name") &&
  viewModel.get("headFreeItem!define9_name").on("afterValueChange", function (data) {
    // 送达方--值改变后
    if (data != undefined) {
      let response = cb.rest.invokeFunction("SCMSA.API.queryClientData", { data: data }, function (err, res) {}, viewModel, { async: false });
      let receiver = response.result.resData.receiver;
      let mobile = response.result.resData.mobile;
      let address = response.result.resData.address;
      //给某个字段赋值
      viewModel.get("headFreeItem!define13").setValue(receiver);
      viewModel.get("headFreeItem!define10").setValue(mobile);
      viewModel.get("headFreeItem!define11").setValue(address);
    }
  });