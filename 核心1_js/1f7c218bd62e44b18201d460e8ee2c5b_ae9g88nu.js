viewModel.get("button34bk").setVisible(false);
if (viewModel.getParams().mode !== "add") {
  viewModel.get("button34bk").setVisible(true);
}
viewModel.get("button34bk") &&
  viewModel.get("button34bk").on("click", function (data) {
    // 上传国家医疗器械标识库--单击
    alert("国家医疗器械标识库维护中...");
  });