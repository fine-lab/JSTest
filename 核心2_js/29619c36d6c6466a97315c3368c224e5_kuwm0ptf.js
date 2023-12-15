viewModel.get("button27qc") &&
  viewModel.get("button27qc").on("click", function (data) {
    //提交--单击
    var gridModel = viewModel.get("testson0913_1List");
    console.log("===============>", gridModel);
    var list = gridModel.getData();
    console.log("===============>", list);
  });