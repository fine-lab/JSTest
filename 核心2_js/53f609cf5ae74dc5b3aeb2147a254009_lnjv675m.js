viewModel.get("position") &&
  viewModel.get("position").on("afterValueChange", function (data) {
    // 地理位置--值改变后
    data = JSON.parse(data.value);
    let longitude = data.longitude; //经度
    let latitude = data.latitude; //纬度
    viewModel.get("longitude").setValue(longitude);
    viewModel.get("latitude").setValue(latitude);
  });
viewModel.get("position") &&
  viewModel.get("position").on("beforeValueChange", function (data) {
    // 地理位置--值改变前
  });