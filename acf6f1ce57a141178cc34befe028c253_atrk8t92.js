viewModel.get("detail!destination") &&
  viewModel.get("detail!destination").on("blur", function (data) {
    // 出差地点--失去焦点的回调
    let id = viewModel.get("extend42").getValue();
    let name = viewModel.get("extend42").getValue();
    console.log("id", id);
    console.log("extend42_name", name);
  });