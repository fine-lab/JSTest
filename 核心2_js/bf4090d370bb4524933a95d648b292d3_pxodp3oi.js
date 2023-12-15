viewModel.get("button22zi") &&
  viewModel.get("button22zi").on("click", function (data) {
    //设置统计月份--单击
    let datas = viewModel.getGridModel().getAllData();
    for (let i = 0; i < datas.length; i++) {
      viewModel.getGridModel().setCellValue(i, "tongjiyuefen", "2023-07-01");
    }
  });