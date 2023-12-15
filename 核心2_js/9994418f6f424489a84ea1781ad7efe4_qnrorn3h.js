viewModel.on("customInit", function (data) {
  // 获取当前部门的上一级详情--页面初始化
  cb.rest.invokeFunction("GT101670AT8.api.getOrg", {}, function (err, res) {
    debugger;
    var b_name;
    b_name = res.res2[0].b_name;
    viewModel.get("new10").setValue(b_name);
    alert(b_name);
  });
});