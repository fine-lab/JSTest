// 取消
viewModel.get("button1ph").on("click", (params) => {
  viewModel.communication({
    type: "return"
  });
});
// 确认
viewModel.get("button6ti").on("click", (params) => {
  const grid = viewModel.getGridModel();
  if (grid.getSelectedRows().length <= 0) {
    cb.utils.alert("请选择数据", "info");
    return false;
  }
  const pvm = viewModel.getCache("parentViewModel");
  pvm.execute("afterPwRefClick", grid.getSelectedRows());
  viewModel.communication({
    type: "return"
  });
});