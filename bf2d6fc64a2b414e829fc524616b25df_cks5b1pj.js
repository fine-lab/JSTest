viewModel.on("afterMount", function (args) {
  document.getElementsByClassName("close dnd-cancel")[0].style.display = "none";
});
viewModel.get("button19uf") &&
  viewModel.get("button19uf").on("click", function (data) {
    // 确定--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
  });
viewModel.get("button15he") &&
  viewModel.get("button15he").on("click", function (data) {
    // 取消--单击
    var parentViewModel = viewModel.getCache("parentViewModel"); //模态框中获取父页面
    viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
  });