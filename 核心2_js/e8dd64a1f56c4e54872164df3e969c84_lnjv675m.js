viewModel.get("MadeIn") &&
  viewModel.get("MadeIn").on("afterValueChange", function (data) {
    // 生产地址--值改变后
    data = JSON.parse(data.value);
    let longitude = data.longitude; //经度
    let latitude = data.latitude; //纬度
    viewModel.get("longitude").setValue(longitude);
    viewModel.get("latitude").setValue(latitude);
  });