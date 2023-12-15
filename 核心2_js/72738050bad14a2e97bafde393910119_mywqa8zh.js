viewModel.get("name") &&
  viewModel.get("name").on("afterValueChange", function (data) {
    // 姓名--值改变后
    console.log(data);
    let name = data.value;
    if (name.trim() != "") {
      console.log(name);
      console.log(viewModel);
      console.log(viewModel.get("org_id_name").getValue());
    }
  });
viewModel.get("name") &&
  viewModel.get("name").on("blur", function (data) {
    // 姓名--失去焦点的回调
  });