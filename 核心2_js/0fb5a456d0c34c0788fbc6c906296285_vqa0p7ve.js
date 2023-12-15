viewModel.get("ref_id") &&
  viewModel.get("ref_id").on("afterValueChange", function (data) {
    // 职配产品id--值改变后
    console.log(data);
  });