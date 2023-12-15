viewModel.get("button48yf") &&
  viewModel.get("button48yf").on("click", function (data) {
    //增行--单击
    var gridModel = viewModel.get("project_traitList"); //获取实体模型
    gridModel.appendRow({});
  });