viewModel.get("merchant_name") &&
  viewModel.get("merchant_name").on("afterValueChange", function (data) {
    // 客户名称--值改变后
    var pid = data.obj.select.id;
    var date = {
      pid: pid
    };
    var result = cb.rest.invokeFunction(
      "GT2688AT7.backDesignerFunction.QWERTYU",
      { date: date },
      function (err, res) {
        if (err != null) {
          cb.utils.alert("有异常");
        } else {
          cb.utils.alert("正常");
        }
      },
      viewModel,
      { async: false }
    );
    cb.utils.alert(JSON.stringify(result));
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
  });
viewModel.get("button26ve") &&
  viewModel.get("button26ve").on("click", function (data) {
    //测试微猪--单击
    debugger;
    var userRes = cb.rest.invokeFunction("GT2688AT7.backDesignerFunction.testGetWeiZhu", {}, function (err, res) {}, viewModel, { async: false });
  });