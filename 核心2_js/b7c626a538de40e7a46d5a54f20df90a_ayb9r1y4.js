viewModel.get("hetonghao") &&
  viewModel.get("hetonghao").on("afterValueChange", function (data) {
    // 合同号--值改变后
    debugger;
    if (data.value == null) {
      viewModel.get("leixing").clear();
    }
    var DateType = data.value.substring(0, 5);
    var dataType = data.value.substring(0, 2);
    // 判断合同号前缀是否符合保修等效的类型
    if (dataType == "AH") {
      viewModel.get("leixing").setValue("1");
    }
    // 判断合同号前缀是否符合保养有效的类型
    if (DateType == "BA_AG") {
      viewModel.get("leixing").setValue("2");
    }
    // 判断合同号前缀是否符合维改有效的类型
    if (DateType == "BA_AY" || DateType == "BA_AX" || DateType == "BA_AZ" || DateType == "BA_AB") {
      viewModel.get("leixing").setValue("3");
    }
  });