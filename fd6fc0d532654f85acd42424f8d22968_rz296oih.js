viewModel.on("beforeSearch", function (args) {
  debugger;
  // 调用中外运库存查询接口参数获取
  let itemCodeCache = viewModel.getCache("FilterViewModel").get("itemCode");
  let itemCode = itemCodeCache.getFromModel().getValue();
  let packageNoCache = viewModel.getCache("FilterViewModel").get("packageNo");
  let packageNo = packageNoCache.getFromModel().getValue();
  cb.rest.invokeFunction("AT19B433F416400006.api.QueryInventory", { itemCode: itemCode, packageNo: packageNo }, function (err, res) {
    debugger;
    let data = res.apiRes.object;
    viewModel.getGridModel().setState("dataSourceMode", "local");
    if (data) {
      let total = data.length;
      viewModel.getGridModel().setDataSource(data);
      let pageIndex = viewModel.getGridModel().getPageIndex();
      let pageSize = viewModel.getGridModel().getPageSize();
      viewModel.getGridModel().setPageInfo({
        pageSize: pageSize,
        pageIndex: pageIndex,
        recordCount: total
      });
    }
  });
  return false;
});