viewModel.get("shoujihao") &&
  viewModel.get("shoujihao").on("afterValueChange", function (data) {
    // 手机号--值改变后
    alert("1");
    alert(JSON.JSON.stringify(data));
    cb.rest.invokeFunction("AT1631132808680009.frontDesignerFunction.aa1234567", {}, function (err, res) {
      if (err != null) {
        cb.utils.alert("异常");
      } else {
        alert(JSON.parse(res.apiResponse).data);
      }
    });
  });