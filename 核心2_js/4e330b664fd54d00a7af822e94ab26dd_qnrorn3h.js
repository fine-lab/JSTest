viewModel.get("button24qi") &&
  viewModel.get("button24qi").on("click", function (data) {
    // 导出--单击
    let alldata = viewModel.getAllData();
    let value = viewModel.get("narong").getValue();
    console.log(alldata);
  });