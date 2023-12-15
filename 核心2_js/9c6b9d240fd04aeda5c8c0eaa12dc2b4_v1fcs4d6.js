viewModel.get("st_salesoutlist") &&
  viewModel.get("st_salesoutlist").on("beforeSetDataSource", function (data) {
    // 表格--设置数据源后
    for (var i = 0; i < data.length; i++) {
      data[i]["headItem!define9"] = data[i].warehouse_name;
    }
  });