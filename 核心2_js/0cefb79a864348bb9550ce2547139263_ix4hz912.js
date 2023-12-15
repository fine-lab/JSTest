viewModel.get("cellPhone") &&
  viewModel.get("cellPhone").on("afterValueChange", function (data) {
    // 手机--值改变后
    var telStr = viewModel.get("cellPhone").getValue();
    if (telStr == null || telStr.trim() == "") {
      return;
    }
    cb.rest.invokeFunction("SFA.serviceFunc.checkTelExisted", { reqEmail: telStr }, function (err, res) {
      console.log("err=" + err);
      console.log("res=" + res);
      var rst = res.rst;
      if (rst) {
        var clueInfo = res.data[0];
        cb.utils.alert("温馨提示，手机号有重复数据，请查询确认", "error");
      } else {
        cb.utils.alert("温馨提示，没有重复数据，请放心录入！！！", "info");
      }
    });
  });