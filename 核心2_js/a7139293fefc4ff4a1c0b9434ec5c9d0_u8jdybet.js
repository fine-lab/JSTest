viewModel.get("button26lh") &&
  viewModel.get("button26lh").on("click", function (data) {
    // 增加地址--单击
    var data = {
      billtype: "voucher",
      billno: "ybeeb15fef",
      params: {
        mode: "edit"
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
  });
viewModel.get("button32fg") &&
  viewModel.get("button32fg").on("click", function (data) {
    // 按钮--单击
  });
viewModel.get("Address2List") &&
  viewModel.get("Address2List").on("afterCellValueChange", function (data) {
    // 表格-送达地址2--单元格值改变后
    console.log("afterCellValueChange---------------------");
    console.log(data);
  });