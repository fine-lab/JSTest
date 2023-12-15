viewModel.get("vendorCharacterDefine") &&
  viewModel.get("vendorCharacterDefine").get("legalBody") &&
  viewModel
    .get("vendorCharacterDefine")
    .get("legalBody")
    .on("afterValueChange", function (data) {
      //法定代表人--值改变后
      cb.utils.alert("测试", "warning");
    });