viewModel.get("button19ma") &&
  viewModel.get("button19ma").on("click", function (data) {
    //测试--单击
    const id = viewModel.get("id").getValue();
    const name = viewModel.get("name").getValue();
    if (id != null && name != null) {
      cb.utils.alert(id + ":" + name);
    } else {
      cb.utils.alert("必须填写信息!");
    }
  });