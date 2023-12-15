viewModel.getGridModel().on("afterSetDataSource", function (data) {
  let b = viewModel.getCache("remark");
  let gridModel = viewModel.getGridModel();
  if (!b) {
    let pageIndex = gridModel.getPageIndex();
    let pageSize = gridModel.getPageSize();
    const filtervm = viewModel.getCache("FilterViewModel");
    let materialCode = filtervm.get("material_code").getFromModel().getValue();
    let obj = cb.rest.invokeFunction("GT80750AT4.xcl.insandUpWlXX", { pageIndex: pageIndex, pageSize: pageSize, materialCode: materialCode }, function (err, res) {}, viewModel, { async: false });
    debugger;
    let total = obj.result.total;
    viewModel.setCache("remark", 1);
    gridModel.setState("dataSourceMode", "local");
    gridModel.setDataSource(obj.result.data);
    gridModel.setPageInfo({
      pageSize: pageSize,
      pageIndex: pageIndex,
      recordCount: total
    });
  } else {
    viewModel.clearCache("remark");
  }
});
viewModel.on("beforeSearch", function (args) {
  debugger;
  if (event.target.id == "111011195search") {
    viewModel.getGridModel().setPageIndex(1);
  }
});
viewModel.on("customInit", function (data) {
  // 现存量报表--页面初始化
  viewModel.getGridModel().setPageSize(10);
});