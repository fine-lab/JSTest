viewModel.get("button21ei") &&
  viewModel.get("button21ei").on("click", function (data) {
    // 确定--单击
    let selectedRows = viewModel.getGridModel().getSelectedRows();
    if (selectedRows.length == 0) {
      cb.utils.alert("请选择数据");
      return false;
    }
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    var gridModel = parentViewModel.getGridModel();
    selectedRows.forEach((row) => {
      row.is_kit = "N";
      row.project_name = row.name;
      row.project = row.id;
      row.product_standard = row.product;
      row.product_standard_name = row.product_name;
      gridModel.appendRow(row);
    });
    //关闭模态框
    viewModel.communication({ type: "modal", payload: { data: false } });
  });