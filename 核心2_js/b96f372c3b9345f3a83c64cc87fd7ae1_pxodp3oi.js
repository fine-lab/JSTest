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
//客户来源 隐藏值
viewModel.on("afterLoadData", function () {
  debugger;
  var EnquiriesAreSource = viewModel.get("EnquiriesAreSource");
  let data = EnquiriesAreSource.__data.dataSource;
  let newData = [];
  data.forEach((item, index) => {
    if (item.value != "17" && item.value != "1" && item.value != "7" && item.value != "8" && item.value != "13" && item.value != "14" && item.value != "15" && item.value != "16") {
      newData.push(item);
    }
  });
  EnquiriesAreSource.setDataSource(newData);
});