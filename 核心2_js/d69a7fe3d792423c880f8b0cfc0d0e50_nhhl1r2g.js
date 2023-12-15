viewModel.get("salesorg_1663548869489721350") &&
  viewModel.get("salesorg_1663548869489721350").on("afterSelect", function (data) {
    // 表格--选择后
    debugger;
    var parentViewModel = viewModel.getCache("parentViewModel") || null;
    const currentData = viewModel.get("salesorg_1663548869489721350").getSelectedRows();
    parentViewModel && parentViewModel.setCache("childrenTableData", currentData);
  });