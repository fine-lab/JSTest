viewModel.get("button2lf") &&
  viewModel.get("button2lf").on("click", function (data) {
    // 取消--单击
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
viewModel.get("button6ik") &&
  viewModel.get("button6ik").on("click", function (data) {
    // 确定--单击
    var parentViewModel = viewModel.getCache("parentViewModel");
    var columns = parentViewModel.get("childrendataList").getColumns();
    alert("ok");
    columns.forEach((col) => {
      console.log(col.cCaption);
    });
    var data = viewModel.get("new1").getValue();
    parentViewModel.get("childrendataList").appendRow({ new1: data });
    viewModel.communication({ type: "modal", payload: { data: false } });
  });