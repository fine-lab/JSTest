viewModel.get("button19ei") &&
  viewModel.get("button19ei").on("click", function (data) {
    //下载--单击
    let text = viewModel.get("text").getValue();
    console.log(text);
    if (!text) {
      cb.utils.alert("发票下载链接不存在!", "error");
      return false;
    }
    window.open(text, "_self");
  });