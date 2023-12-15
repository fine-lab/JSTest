viewModel.getGridModel().on("afterSetDataSource", function (data) {
  let b = viewModel.getCache("remark");
  let gridModel = viewModel.getGridModel();
  //获取查询区
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  let filterModelInfo = filterViewModelInfo.get("name");
  let realModelInfo = filterModelInfo.getFromModel();
  if (!b) {
    debugger;
    console.log("======before==========>" + JSON.stringify(gridModel.getData()));
    let pageIndex = gridModel.getPageIndex();
    let pageSize = gridModel.getPageSize();
    let name = realModelInfo.getValue();
    let res = cb.rest.invokeFunction("AT17FE6D9E08480004.api.getWebData", { pageIndex: pageIndex, pageSize: pageSize, name: name }, function (err, res) {}, viewModel, { async: false });
    let total = res.result.total;
    viewModel.setCache("remark", 1);
    gridModel.setState("dataSourceMode", "local");
    gridModel.setDataSource(res.result.data);
    gridModel.setPageInfo({
      pageSize: pageSize,
      pageIndex: pageIndex,
      recordCount: total
    });
  } else {
    viewModel.clearCache("remark");
  }
});