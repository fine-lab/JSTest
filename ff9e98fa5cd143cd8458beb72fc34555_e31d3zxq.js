viewModel.on("customInit", function (data) {
  //诊疗范围
  viewModel.on("afterLoadData", function () {
    if (viewModel.getParams().mode == "add") {
      let parent = viewModel.getParams().parent;
      let parentName = viewModel.getParams().parentName;
      viewModel.get("parent").setValue(parent);
      viewModel.get("parent_name").setValue(parentName);
    }
  });
});