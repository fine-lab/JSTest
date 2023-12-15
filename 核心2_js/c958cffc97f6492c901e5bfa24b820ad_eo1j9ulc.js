viewModel.on("afterLoadData", function (data) {
  // 销售订单--页面数据加载后
  //获取采购订单编码
  const purOrderCodeV = viewModel.get("purOrderCode").getValue();
  //调用后端api
  cb.rest.invokeFunction(
    "6d82d66642a44bd6974466027a843bd5?buyerTenant=eo1j9ulc",
    { vbillcodeP: purOrderCodeV },
    function (err, res) {
      if (err !== null) {
        code = err.code;
      }
    },
    viewModel
  );
});
viewModel.on("customInit", function (data) {
  // 销售订单--页面初始化
});