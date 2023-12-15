viewModel.on("customInit", function (data) {
  var viewModel = this;
  viewModel.on("afterLoadData", function (args) {
    //给日期字段赋值
    let is_platform = viewModel.get("is_platform").getValue();
    let material_source = viewModel.get("material_source").getValue();
    if (is_platform != 2) {
      viewModel.get("customer_code").setState("visible", false);
    }
    if (material_source == 1 || material_source == undefined) {
      viewModel.get("material_source_content").setState("visible", false);
    }
  });
  viewModel.get("material_source").on("afterValueChange", function (data) {
    if (data.value.value == 1) {
      viewModel.get("material_source_content").setState("visible", false);
    } else {
      viewModel.get("material_source_content").setState("visible", true);
    }
  });
  viewModel.get("is_platform").on("afterValueChange", function (data) {
    if (data.value.value == 1) {
      viewModel.get("customer_code").setState("visible", false);
    } else {
      viewModel.get("customer_code").setState("visible", true);
    }
  });
});