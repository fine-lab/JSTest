viewModel.get("address_name") &&
  viewModel.get("address_name").on("beforeBrowse", function (data) {
    // 乡镇--参照弹窗打开前
    let area_name = viewModel.get("area_name").getValue();
    if (area_name == null) {
      cb.utils.alert("请先选择区县！", "error");
      return false;
    }
  });
viewModel.get("area_name") &&
  viewModel.get("area_name").on("beforeBrowse", function (data) {
    // 地区--参照弹窗打开前
    let city_name = viewModel.get("city_name").getValue();
    if (city_name == null) {
      cb.utils.alert("请先选择城市！", "error");
      return false;
    }
  });
viewModel.get("city_name") &&
  viewModel.get("city_name").on("beforeBrowse", function (data) {
    // 所在市--参照弹窗打开前
    let province_name = viewModel.get("province_name").getValue();
    if (province_name == null) {
      cb.utils.alert("请先选择省份！", "error");
      return false;
    }
  });
viewModel.get("province_name") &&
  viewModel.get("province_name").on("afterValueChange", function (data) {
    // 所在省份--值改变后
    viewModel.get("address_name").setValue("");
    viewModel.get("city_name").setValue();
    viewModel.get("area_name").setValue();
    viewModel.get("area").setValue();
    viewModel.get("address").setValue();
  });
viewModel.get("address_name") &&
  viewModel.get("address_name").on("afterBrowse", function (data) {
    // 乡镇--参照弹窗加载后
    let area_name = viewModel.get("area_name").getValue();
    let area = viewModel.get("area").getValue();
    debugger;
    if (data == null) {
      viewModel.get("address_name").setValue(area_name);
      viewModel.get("address").setValue(area);
    }
  });
viewModel.get("btnSave").on("beforeSave", function (data) {
  // 保存前会写数据到U订货界面
});
viewModel.on("afterMount", function () {
  debugger;
  viewModel.get("cusname").setValue(viewModel.getParams().query.agentId);
  viewModel.get("cusname_name").setValue(viewModel.getParams().query.retailAgentName);
});