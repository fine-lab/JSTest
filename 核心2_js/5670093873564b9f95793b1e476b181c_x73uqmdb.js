viewModel.on("afterMount", function () {
  debugger;
  let filterViewModel = viewModel.getCache("FilterViewModel");
  filterViewModel.on("afterInit", function () {
    let dateV = filterViewModel.get("new4");
    let fromModel = dateV.getFromModel();
    let toModel = dateV.getToModel();
  });
});
viewModel.on("beforeSearch", function (data) {
  let filterViewModel = viewModel.getCache("FilterViewModel");
  let dateV = filterViewModel.get("new4");
  let begin = dateV.getFromModel().getValue();
  let end = dateV.getToModel().getValue();
});
viewModel.get("button18yh") &&
  viewModel.get("button18yh").on("click", function (args) {
    let groupCode = "modal6he";
    viewModel.communication({
      type: "modal",
      payload: {
        mode: "inner",
        groupCode: groupCode,
        viewModel: viewModel
      }
    });
  });
viewModel.get("button18yh") &&
  viewModel.get("button18yh").on("click", function (data) {
    // 按钮--单击
  });