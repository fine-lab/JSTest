viewModel.on("customInit", function (data) {
  // 测试--页面初始化
});
viewModel.get("button15ji") &&
  viewModel.get("button15ji").on("click", function (data) {
    // 按钮--单击
    let deptId = "yourIdHere";
    let matrixLevel = "D5";
    cb.rest.invokeFunction("GT3407AT1.flow.getApprover", deptId, matrixLevel, function (err, res) {
      debugger;
      console.log(res);
    });
  });