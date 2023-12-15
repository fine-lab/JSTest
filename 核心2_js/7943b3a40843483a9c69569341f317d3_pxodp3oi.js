viewModel.get("button18db") &&
  viewModel.get("button18db").on("click", function (data) {
    // 自定义删除--单击
    alert("自定义");
    viewModel.get("btnBatchDelete").fireEvent("click");
  });