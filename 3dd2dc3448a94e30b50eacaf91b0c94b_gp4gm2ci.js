viewModel.on("customInit", function (data) {
  //选中select后事件 rowIndexs为行号，单行(整形)or多行(数组)
  //服务单--页面初始化
  throw new Error("contextResult====>  param====> ");
});
viewModel.get("button22yd") &&
  viewModel.get("button22yd").on("click", function (data) {
    var rowIndex = data.index;
    var cellValue = viewModel.getGridModel().getCellValue(rowIndex, "id");
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "voucherList",
        billno: "supportuserList",
        params: {
          perData: cellValue
        }
      },
      viewModel
    );
  });