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