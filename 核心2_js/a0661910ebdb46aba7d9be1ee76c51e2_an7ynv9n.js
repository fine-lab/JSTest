viewModel.on("customInit", function (data) {
  // 实际可用量--
  debugger;
  viewModel.getGridModel().appendRow({
    material_code: "1",
    material_name: "测试"
  });
});