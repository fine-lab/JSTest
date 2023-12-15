viewModel.get("ProjectProductClassification") &&
  viewModel.get("ProjectProductClassification").on("afterValueChange", function (data) {
    // 项目产品分类--值改变后
    viewModel.get("ProductSpecificReport_Model").setValue(null);
  });
viewModel.on("afterMount", function () {
  let id = viewModel.getParams().id;
  let isBrowse = viewModel.getParams().isBrowse;
  if (isBrowse != undefined && isBrowse == true) {
    viewModel.execute("updateViewMeta", { code: "SingleCardRightHeader", visible: false });
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