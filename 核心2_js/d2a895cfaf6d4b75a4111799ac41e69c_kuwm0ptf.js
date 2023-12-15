const yyMMdd = () => {
  let date = new Date(); //获取当前日期
  let year = date.getFullYear(); //获取当前年
  let month = date.getMonth() + 1; //获取当前月
  month = month.toString().length == 1 ? "0" + month : month; //补0
  let strDate = date.getDate(); //获取当前日
  strDate = strDate.toString().length == 1 ? "0" + strDate : strDate; //补0
  return year + "-" + month + "-" + strDate;
};
viewModel.on("afterMount", function () {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  filterViewModelInfo.on("afterInit", function (data) {
    let dateModleInfo = filterViewModelInfo.get("sale_date");
    let today = yyMMdd();
    dateModleInfo.getFromModel().setValue(today);
    dateModleInfo.getToModel().setValue(today);
  });
});
viewModel.getGridModel().on("afterSetDataSource", function (data) {
  let b = viewModel.getCache("remark");
  let gridModel = viewModel.getGridModel();
  if (!b) {
    //获取查询区
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    let pageIndex = gridModel.getPageIndex();
    let pageSize = gridModel.getPageSize();
    let orgName = filterViewModelInfo.get("org_name").getFromModel().getValue();
    let skuName = filterViewModelInfo.get("sku_name").getFromModel().getValue();
    let dateModleInfo = filterViewModelInfo.get("sale_date");
    let start = dateModleInfo.getFromModel().getValue();
    let end = dateModleInfo.getToModel().getValue();
    console.log(">>>>>>>>>>>>>>>>>>>>>", start, end);
    let res = cb.rest.invokeFunction(
      "AT18D4028C3F280009.api.getOriginalSales",
      { pageIndex: pageIndex, pageSize: pageSize, orgName: orgName, skuName: skuName, start: start, end: end },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    let total = res.result.total;
    console.log("================>", res.result.sign, res.result.str);
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