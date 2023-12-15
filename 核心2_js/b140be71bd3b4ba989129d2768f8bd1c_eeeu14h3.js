viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织/销售--值改变后
    var envUrl = viewModel.getAppContext().serviceUrl;
    var params = viewModel.getParams();
    cb.rest.invokeFunction("AT1598793A09B00005.openAPI.sales", { params: params, envUrl: envUrl }, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });