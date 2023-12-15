viewModel.get("type") &&
  viewModel.get("type").on("afterValueChange", function (data) {
    // 设备类型--值改变后
    console.log(data);
    var selectValue = data.value.value;
    var selectTypeName = data.value.text;
    if (selectValue == 0) {
      cb.utils.alert("您选择的设备类型为：【" + selectTypeName + "】 请在 「设备标识」 内输入标识。", "warning");
    }
    if (selectValue == 1 || selectValue == 2) {
      cb.utils.alert("您选择的设备类型为：【" + selectTypeName + "】 请在 「设备标识」 内输入IP地址。", "warning");
    }
    if (selectValue == 3 || selectValue == 4 || selectValue == 5) {
      cb.utils.alert("您选择的设备类型为：【" + selectTypeName + "】 请在 「设备标识」 内输入MAC地址。", "warning");
    }
    viewModel.get("devicecode").setValue(newPseudoGuid());
    function newPseudoGuid() {
      var guid = "";
      for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
      }
      return guid;
    }
  });
viewModel.on("customInit", function (data) {
  viewModel.on("beforeSave", function (args) {
    let pageType = data.originalParams.mode;
    var value = viewModel.get("type").getValue();
    var ipOrMac = viewModel.get("deviceinfo").getValue();
    console.log(value);
    var checkFlag = false;
    if (value == 1 || value == 2) {
      checkFlag = validateIp(ipOrMac);
      if (checkFlag == false) {
        checkFlag = validateIpAndPort(ipOrMac);
        console.log(checkFlag);
        if (checkFlag == false) {
          cb.utils.alert("您输入的IP地址有误，请检查后重新输入", "error");
          return false;
        }
      }
    }
    if (value == 3 || value == 4 || value == 5) {
      checkFlag = validateMac(ipOrMac);
      if (checkFlag == false) {
        cb.utils.alert("您输入的MAC地址有误，请检查后重新输入", "error");
        return false;
      }
    }
    if (pageType == "add") {
      console.log("this check");
      var locationCodeCheck = cb.rest.invokeFunction("2671d4e0d1ae4141a2ebe8ae684cafe3", { deviceinfo: ipOrMac }, function (err, res) {}, viewModel, { async: false });
      const res = locationCodeCheck.result.rst;
      if (res.length > 0) {
        console.log(false);
        cb.utils.alert("当前输入的IP地址或MAC地址在系统中已经存在，请确认后重新输入！", "error");
        return false;
      }
    }
  });
  const validateIp = (str) => /^(((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/.test(str);
  const validateIpAndPort = (str) =>
    /^(((25[0-5]|2[0-4]d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/.test(str);
  const validateMac = (str) => /^[A-Fa-f0-9]{2}([-:]?[A-Fa-f0-9]{2})([-:.]?[A-Fa-f0-9]{2})([-:]?[A-Fa-f0-9]{2})([-:.]?[A-Fa-f0-9]{2})([-:]?[A-Fa-f0-9]{2})$/.test(str);
});