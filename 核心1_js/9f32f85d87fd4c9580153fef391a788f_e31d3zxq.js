viewModel.on("customInit", function (data) {
  // 仓库档案--页面初始化inTemperature
  viewModel.get("extend_humidity_up").on("beforeValueChange", function (data) {
    let extend_humidity_down = viewModel.get("extend_humidity_down").getValue();
    if (extend_humidity_down != undefined && data.value != undefined && data.value <= extend_humidity_down) {
      cb.utils.alert("湿度上限不能小于等于湿度下限", "error");
      return false;
    }
  });
  viewModel.get("extend_humidity_down").on("beforeValueChange", function (data) {
    let extend_humidity_up = viewModel.get("extend_humidity_up").getValue();
    if (extend_humidity_up != undefined && data.value != undefined && data.value >= extend_humidity_up) {
      cb.utils.alert("湿度下限不能大于等于湿度上限", "error");
      return false;
    }
  });
  viewModel.get("extend_temperature_up").on("beforeValueChange", function (data) {
    let extend_temperature_down = viewModel.get("extend_temperature_down").getValue();
    if (extend_temperature_down != undefined && data.value != undefined && data.value <= extend_temperature_down) {
      cb.utils.alert("温度上限不能小于等于温度下限", "error");
      return false;
    }
  });
  viewModel.get("extend_temperature_down").on("beforeValueChange", function (data) {
    let extend_temperature_up = viewModel.get("extend_temperature_up").getValue();
    if (extend_temperature_up != undefined && data.value != undefined && data.value >= extend_temperature_up) {
      cb.utils.alert("温度下限不能大于等于温度上限", "error");
      return false;
    }
  });
});