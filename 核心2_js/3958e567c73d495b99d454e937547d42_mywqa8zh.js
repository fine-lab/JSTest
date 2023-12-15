viewModel.get("button57ri") &&
  viewModel.get("button57ri").on("click", function (data) {
    // 开票情况--单击
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const datum = gridModel.getSelectedRows();
    if (datum.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    debugger;
    for (var i = 0; i < datum.length; i++) {
      var result = cb.rest.invokeFunction("SCMSA.backDesignerFunction.KaipiaoCondition", { resId: datum[i] }, function (err, res) {}, viewModel, { async: false });
    }
  });
viewModel.get("button115vd") &&
  viewModel.get("button115vd").on("click", function (data) {
    // 订单销售--单击
    debugger;
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const resuu = gridModel.getSelectedRows();
    if (resuu.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < resuu.length; i++) {
      var resId = resuu[i].id;
      var resCode = resuu[i].code;
      var result = cb.rest.invokeFunction("SCMSA.rule.BodyResult", { resId: resId, resCode: resCode }, function (err, res) {}, viewModel, { async: false });
    }
  });
viewModel.on("customInit", function (data) {
  // 订单列表--页面初始化
});
viewModel.get("button176ih") &&
  viewModel.get("button176ih").on("click", function (data) {
    // 客商额度查询--单击
    var gridModel = viewModel.getGridModel();
    //获取grid中已选中行的数据
    const datum = gridModel.getSelectedRows();
    if (datum.length <= 0) {
      cb.utils.alert("请选择行！");
      return;
    }
    for (var i = 0; i < datum.length; i++) {
      var json = cb.rest.invokeFunction("SCMSA.backDesignerFunction.queryClientED", { datum: datum[i] }, function (err, res) {}, viewModel, { async: false });
      cb.utils.alert(JSON.stringify(json.error.message));
    }
  });