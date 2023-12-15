viewModel.on("afterLoadData", function (event) {
  debugger;
  let params = viewModel.getParams();
  if (params != undefined) {
    if (params.orderCode != undefined) {
      viewModel.get("code").setValue(params.orderCode);
    }
    if (params.price != undefined) {
      viewModel.get("price").setValue(params.price);
    }
    if (params.orderName != undefined) {
      viewModel.get("name").setValue(params.orderName);
    }
  }
  var pay_status_id = viewModel.get("pay_status_id").getValue();
  var pay_type_id = viewModel.get("pay_type_id").getValue();
  if (pay_status_id == "1" && pay_type_id != undefined) {
    viewModel.get("button17xf").setVisible(true);
  } else {
    viewModel.get("button17xf").setVisible(false);
  }
});
// 支付--单击
viewModel.get("button17xf") &&
  viewModel.get("button17xf").on("click", function (data) {
    cb.utils.alert("支付成功", "success");
    viewModel.execute("refresh");
  });