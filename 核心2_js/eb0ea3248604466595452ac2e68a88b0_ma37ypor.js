viewModel.get("ProjectProductClassification") &&
  viewModel.get("ProjectProductClassification").on("afterValueChange", function (data) {
    // 项目产品分类--值改变后
    viewModel.get("ProductSpecificReport_Model").setValue(null);
  });