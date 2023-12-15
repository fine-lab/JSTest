viewModel.get("orderDetails") &&
  viewModel.get("orderDetails").getEditRowModel() &&
  viewModel.get("orderDetails").getEditRowModel().get("realProductCode") &&
  viewModel
    .get("orderDetails")
    .getEditRowModel()
    .get("realProductCode")
    .on("afterValueChange", function (data) {
      debugger;
      var gridModel = viewModel.getGridModel("orderDetails");
      let product = data.obj.select;
      for (var i = 0; i < product.length; i++) {
        // 获取行号
        let rowIndex = gridModel.__data.focusedRowIndex;
        let productID = product[i].id;
        let agentId = viewModel.get("agentId").getValue();
        let OrgID = viewModel.get("salesOrgId").getValue();
        let res = cb.rest.invokeFunction("SCMSA.API.Stockonhand", { agentId: agentId, OrgID: OrgID, productID: productID }, function (err, res) {}, viewModel, { async: false });
        // 累计现存量
        let currentqty = res.result.currentqty;
        // 累计可用量
        let availableqty = res.result.availableqty;
        if (product.length == 1) {
          gridModel.setCellValue(rowIndex, "bodyFreeItem!define1", currentqty);
          gridModel.setCellValue(rowIndex, "bodyFreeItem!define2", availableqty);
        } else {
          gridModel.setCellValue(rowIndex - 1 + i, "bodyFreeItem!define1", currentqty);
          gridModel.setCellValue(rowIndex - 1 + i, "bodyFreeItem!define2", availableqty);
        }
      }
    });