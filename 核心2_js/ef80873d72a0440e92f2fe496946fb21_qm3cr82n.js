viewModel.get("duration") &&
  viewModel.get("duration").on("afterValueChange", function (data) {
    // 课程时长--值改变后
    if (data.value) {
      viewModel.setData("duration_m", (data.value / 60).toFixed(1));
    }
  });