const gridModel = viewModel.getGridModel();
viewModel.get("button26ch").on("click", function () {
  //获取选中行的行号
  var line = gridModel.getSelectedRowIndexes();
  //获取选中行id信息
  const abnormalevent = gridModel.getRow(line).define1;
  if (abnormalevent) {
    cb.loader.runCommandLine(
      "bill",
      {
        billtype: "Voucher",
        billno: "5455a6a2",
        domainKey: "yourKeyHere",
        params: {
          mode: "browse",
          readOnly: true,
          id: abnormalevent
        }
      },
      viewModel
    );
  } else {
    cb.utils.alert("请选择一条数据！");
  }
});