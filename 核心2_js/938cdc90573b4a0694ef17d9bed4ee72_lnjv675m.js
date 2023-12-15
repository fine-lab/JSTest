viewModel.get("position") &&
  viewModel.get("position").on("afterValueChange", function (data) {
    // 地理位置--值改变后
    let v = JSON.parse(data.value);
    viewModel.get("longitude").setValue(v.longitude);
    viewModel.get("latitude").setValue(v.latitude);
  });