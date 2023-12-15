viewModel.get("button27mf") &&
  viewModel.get("button27mf").on("click", function (data) {
    //弹窗--单击
    cb.utils.alert(viewModel.get("remark").getValue());
  });