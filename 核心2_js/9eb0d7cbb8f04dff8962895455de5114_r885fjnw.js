viewModel.get("button20dh") &&
  viewModel.get("button20dh").on("click", function (data) {
    //全选--单击
    var gridModel2 = viewModel.get("dome02List");
    gridModel2.selectAll("showCheckBox", true);
  });
viewModel.get("button23dh") &&
  viewModel.get("button23dh").on("click", function (data) {
    //全消--单击
    var gridModel2 = viewModel.get("dome02List");
    gridModel2.unselectAll("showCheckBox", false);
  });