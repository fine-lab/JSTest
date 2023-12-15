// 同步富通--单击
viewModel.get("button24qi") &&
  viewModel.get("button24qi").on("click", function (data) {
    cb.rest.invokeFunction("GT3734AT5.APIFunc.synStaffToCrmApi", {}, function (err, res) {
      debugger;
      console.log("err=" + err);
      console.log("res=" + res);
      var rst = res.rst;
      if (rst) {
        cb.utils.alert("温馨提示！同步档案已生成[" + res.customerId + "]", "info");
      } else {
        cb.utils.alert("温馨提示！同步档案生成失败[" + res.msg + "]", "error");
      }
    });
  });