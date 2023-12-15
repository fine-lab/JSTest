viewModel.on("customInit", function (data) {
  // 销售订单脚本验证101501详情--页面初始化
  let param = {
    name: "销售订单脚本验证101501详情",
    desc: "页面初始化"
  };
  cb.rest.invokeFunction("ef62d401740a4ff4a5b62f1eab5ac69d", { name: "销售订单脚本验证101501详情" }, function (err, res) {
    cb.utils.alert(res);
  });
});