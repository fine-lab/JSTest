let billitems = [];
viewModel.get("vbillcode") &&
  viewModel.get("vbillcode").on("afterValueChange", function (data) {
    // 单据号--值改变后
    var vbillcode = data.value;
    if (vbillcode != null && vbillcode != "") {
      var proxy = viewModel.setProxy({
        queryData: {
          url: "/scmbc/stockzx/findXSBillByCode",
          method: "get"
        }
      });
      //传参
      var param = {
        vbillcode: vbillcode
      };
      proxy.queryData({}, function (err, result) {
        if (!err.success) {
          cb.utils.alert(err.msg, "error");
          return;
        }
        billitems = [...err.data];
      });
    }
  });
var gridModel = viewModel.getGridModel();
var gridRowModel = gridModel.getEditRowModel();
gridRowModel.get("vbarcode").on("valueChange", function (data) {
  // 条码值--值改变
  var barcodes = data.split("[#]");
  var cinvcode = barcodes[0];
  var vbatchcode = barcodes[1];
  const index = gridModel.getFocusedRowIndex();
  var gridData = null;
  if (billitems.length > 0) {
    for (var i = 0; i < billitems.length; i++) {
      let rowdata = billitems[i];
      var billcinvcode = rowdata.productCode;
      if (cinvcode == billcinvcode) {
        gridData = rowdata;
        break;
      }
    }
    debugger;
    if (gridData != null) {
      gridModel.setCellValue(index, "pk_material", gridData.productId);
      gridModel.setCellValue(index, "pk_material_name", gridData.productName);
      gridModel.setCellValue(index, "cinvcode", cinvcode);
      gridModel.setCellValue(index, "cinvname", gridData.productName);
      gridModel.setCellValue(index, "skuid_name", gridData.skuName);
      gridModel.setCellValue(index, "skuid", gridData.skuId);
      gridModel.setCellValue(index, "skucode", gridData.skuCode);
      gridModel.setCellValue(index, "skuidName", gridData.skuName);
      gridModel.setCellValue(index, "pk_measdoc", gridData.masterUnitId);
      gridModel.setCellValue(index, "measdoc", gridData.qtyName);
      gridModel.setCellValue(index, "castunitid", gridData.iProductAuxUnitId);
      gridModel.setCellValue(index, "castunitname", gridData.productAuxUnitName);
      gridModel.setCellValue(index, "vbatchcode", vbatchcode);
      gridModel.setCellValue(index, "casscustid", gridData.agentId);
      gridModel.setCellValue(index, "nnum", gridData.qty);
      gridModel.setCellValue(index, "nassistnum", gridData.subQty);
      gridModel.setCellValue(index, "vchangerate", gridData.invExchRate);
    } else {
      alert("物料【" + cinvcode + "】未在销售订单内，请核实！");
    }
  }
});