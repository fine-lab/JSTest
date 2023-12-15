viewModel.get("sales_ReportDetailsList") &&
  viewModel.get("sales_ReportDetailsList").getEditRowModel() &&
  viewModel.get("sales_ReportDetailsList").getEditRowModel().get("product_code") &&
  viewModel
    .get("sales_ReportDetailsList")
    .getEditRowModel()
    .get("product_code")
    .on("afterValueChange", function (data) {
      // 物料--值改变
      var orgId = viewModel.get("org_id").getValue();
      var gridModel = viewModel.getGridModel();
      var data = gridModel.__data;
      var ds = data.dataSource[0];
      var id = ds.product;
      var params = {
        pro_id: id,
        org_id: orgId
      };
      var rsu = cb.rest.invokeFunction("GT5646AT1.apifunction.selectMaterial", { sku: params }, function (err, res) {}, viewModel, { async: false });
    });
viewModel.get("button30hd") &&
  viewModel.get("button30hd").on("click", function (data) {
    // 销售出库保存--单击
    debugger;
    var dataAll = viewModel.getAllData();
    var sid = dataAll.id;
    var ps = dataAll.pushDown;
    if (ps == "true") {
      cb.utils.alert("该销售日报已经保存销售出库不可重复保存");
    } else {
      var path = "1538829126668386383";
      let res = cb.rest.invokeFunction("GT5646AT1.apifunction.pathList", { path: path }, function (err, res) {}, viewModel, { async: false });
      if (res.error == undefined) {
        var list = res.result.res.data.recordList;
      } else {
        cb.utils.confirm(res.error.message);
      }
      let req = cb.rest.invokeFunction("GT5646AT1.apifunction.selectAll", { sid: sid, sendDataObj: dataAll, priceList: list }, function (err, res) {}, viewModel, { async: false });
      if (req.error) {
        cb.utils.confirm(req.error.message);
        return false;
      }
      cb.utils.confirm("下推销售出库成功！");
      // 销售出库保存成功之后改变下推状态为'是'
      viewModel.execute("refresh");
    }
  });
viewModel.on("modeChange", function (data) {
  if (data == "add" || data == "edit") {
    viewModel.get("button30hd").setVisible(false);
  } else {
    viewModel.get("button30hd").setVisible(true);
  }
});