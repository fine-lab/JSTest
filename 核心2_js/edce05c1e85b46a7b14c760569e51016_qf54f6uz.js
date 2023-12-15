viewModel.on("afterLoadData", function (data) {
  let code = viewModel.get("code").getValue();
  //销售订单--页面初始化
  cb.rest.invokeFunction("SCMSA.rule.XSDDKTCKAPI", { vbillcode: code }, function (err, res) {
    let value = res.obj;
    if (value != null) {
      viewModel.get("orderDefineCharacter__KTCK").setValue(value.data);
    }
  });
});