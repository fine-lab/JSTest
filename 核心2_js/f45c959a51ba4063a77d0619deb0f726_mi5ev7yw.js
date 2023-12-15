viewModel.on("customInit", function (data) {
  var viewModel = this;
  viewModel.on("afterLoadData", function (args) {
    debugger;
    console.log(viewModel.getParams());
    if (viewModel.getParams().mode == "add") {
      viewModel.get("sourcecode").setValue(viewModel.getParams().code);
      viewModel.get("material").setValue(viewModel.getParams().materialId);
      viewModel.get("material_name").setValue(viewModel.getParams().materialName);
      viewModel.get("material_batch_no").setValue(viewModel.getParams().batchcode);
      viewModel.get("conditional_release_num").setValue(viewModel.getParams().nastnum);
    }
    //给日期字段赋值
    let app_project = viewModel.get("app_project").getValue();
    let customer_comment = viewModel.get("customer_comment").getValue();
    let batch_processing_conclusion = viewModel.get("batch_processing_conclusion").getValue();
    if (app_project != 2) {
      viewModel.get("customer_project_no").setState("visible", false);
    }
    if (customer_comment != 2) {
      viewModel.get("customer_reject_comment").setState("visible", false);
    }
    if (batch_processing_conclusion != 2) {
      viewModel.get("batch_processing_reject").setState("visible", false);
    }
  });
  viewModel.get("app_project").on("afterValueChange", function (data) {
    if (data.value.value == 1) {
      viewModel.get("customer_project_no").setState("visible", false);
    } else {
      viewModel.get("customer_project_no").setState("visible", true);
    }
  });
  viewModel.get("customer_comment").on("afterValueChange", function (data) {
    if (data.value.value == 1) {
      viewModel.get("customer_reject_comment").setState("visible", false);
    } else {
      viewModel.get("customer_reject_comment").setState("visible", true);
    }
  });
  viewModel.get("batch_processing_conclusion").on("afterValueChange", function (data) {
    if (data.value.value == 1) {
      viewModel.get("batch_processing_reject").setState("visible", false);
    } else {
      viewModel.get("batch_processing_reject").setState("visible", true);
    }
  });
});