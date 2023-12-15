viewModel.on("customInit", function (data) {
  // 修改数量（勿删）详情--页面初始化
  console.log("修改数量（勿删）详情--页面初始化");
  viewModel.on("afterLoadData", function () {
    // 获取查询区模型
    let index = viewModel.getParams().index;
    let rowData = viewModel.getParams().rowData;
    viewModel.get("item8ah").setValue(rowData.subQty);
    viewModel.get("item17rg").setValue(rowData._productId_name);
    viewModel.get("item25qj").setValue(index);
  });
});
viewModel.get("button4sh") &&
  viewModel.get("button4sh").on("click", function (data) {
    // 确认--单击
    let index = viewModel.get("item25qj").getValue();
    let Number = viewModel.get("item8ah").getValue();
    sessionStorage.setItem("index", index);
    sessionStorage.setItem("Number", Number);
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button1gd") &&
  viewModel.get("button1gd").on("customInit", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });