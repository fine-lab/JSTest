viewModel.on("afterLoadData", function (data) {
  let gridModel = viewModel.getGridModel("XMPZList");
  if (gridModel.getRows().length == 0) {
    let rowDatas = [{}];
    gridModel.insertRows(0, rowDatas);
  }
  let gridModel2 = viewModel.getGridModel("BZDPFAXXList");
  if (gridModel2.getRows().length == 0) {
    let rowDatas = [{}];
    gridModel2.insertRows(0, rowDatas);
  }
});
viewModel.get("CustomerName_MingChen") &&
  viewModel.get("CustomerName_MingChen").on("afterValueChange", function (data) {
    // 客户名称--值改变后
  });
viewModel.on("afterMount", function () {
  let id = viewModel.getParams().id;
  let isBrowse = viewModel.getParams().isBrowse;
  if (isBrowse != undefined && isBrowse == true) {
    viewModel.execute("updateViewMeta", { code: "CardTableRightHeader", visible: false });
  }
});