viewModel.on("customInit", function (data) {
  // 计件项目/产值认定表详情--页面初始化
  debugger;
  var girdModel = viewModel.getGridModel();
});
viewModel.get("SB01List") &&
  viewModel.get("SB01List").on("afterInsertRow", function (data) {
    // 表格-孙表实体--设置数据源后
    debugger;
    var rows = viewModel.get("ZSTList").getFocusedRowIndex();
    var gzl = viewModel.get("ZSTList").getCellValue(rows, "gongzuoliang");
    var hsje = viewModel.get("ZSTList").getCellValue(rows, "hanshuijine");
    var gzlms = viewModel.get("ZSTList").getCellValue(rows, "gongzuomiaoshuxiangmujieduan");
    viewModel.get("SB01List").setCellValue(data.index, "gongzuoliang", gzl);
    viewModel.get("SB01List").setCellValue(data.index, "hanshuijine", hsje);
    viewModel.get("SB01List").setCellValue(data.index, "gongzuomiaoshu", gzlms);
  });