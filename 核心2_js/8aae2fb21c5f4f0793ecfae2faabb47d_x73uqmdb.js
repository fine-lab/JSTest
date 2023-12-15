viewModel.get("button1qc") &&
  viewModel.get("button1qc").on("click", function (data) {
    debugger;
    let pId = viewModel.get("Product").getValue();
    let pName = viewModel.get("Product_name").getValue();
    let parentViewModel = viewModel.getCache("parentViewModel");
    parentViewModel.execute("refresh");
    // 确定--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.on("beforeClose", function (data) {
  // 弹框详情--页面初始化
  alert("dagaga");
});