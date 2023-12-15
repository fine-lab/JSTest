viewModel.get("button22gi") &&
  viewModel.get("button22gi").on("click", function (data) {
    // 生成凭证--单击
    debugger;
    var girdModel = viewModel.getGridModel();
    // 获取grid中已选中行的数据
    const extant = girdModel.getSelectedRows();
    var returnValue = cb.rest.invokeFunction("AT17604A341D580008.backOpenApiFunction.CostAllocation", { data: extant }, function (err, res) {}, girdModel, { async: false });
    var resul = returnValue.result;
    if (resul.jsonALL.code == 200) {
      cb.utils.alert(" -- 生成凭证号成功 -- ");
    } else {
      cb.utils.alert(" -- 生成凭证号失败 -- ");
    }
  });