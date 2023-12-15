viewModel.getGridModel().setColumnState("province_name", "formatter", function (rowInfo, rowData) {
  let province_name = rowData.province_name || "-",
    city_name = rowData.city_name || "-",
    region_name = rowData.region_name || "-";
  let res = {
    override: true,
    html: ""
  };
  res = Object.assign({}, res, {
    html: province_name + city_name + region_name
  });
  return res;
});
viewModel.get("ordercontrol_1769081541724471297") &&
  viewModel.get("ordercontrol_1769081541724471297").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
    viewModel.getGridModel().setColumnState("city_name", "visible", false);
    viewModel.getGridModel().setColumnState("region_name", "visible", false);
  });