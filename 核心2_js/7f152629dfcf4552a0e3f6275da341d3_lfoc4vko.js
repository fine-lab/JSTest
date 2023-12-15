let billitems = [];
let totalp = 0;
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
      // 传参
      var param = {
        vbillcode: vbillcode
      };
      proxy.queryData(param, function (err, result) {
        if (!err.success) {
          cb.utils.alert(err.msg, "error");
          return;
        }
        totalp = err.data.totalPackage;
        viewModel.get("total_package").setValue(totalp + 1);
        viewModel.get("current_package").setValue(totalp + 1);
        billitems = [...err.data.list];
      });
    } else {
      billitems = [];
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
      gridModel.setCellValue(index, "casscustid_name", gridData.agentId_name);
      gridModel.setCellValue(index, "nnum", gridData.qty);
      gridModel.setCellValue(index, "nassistnum", gridData.subQty);
      gridModel.setCellValue(index, "vchangerate", gridData.invExchRate);
      gridModel.setCellValue(index, "pk_rack", vbatchcode);
      gridModel.setCellValue(index, "pk_rack_name", vbatchcode);
      gridModel.setCellValue(index, "def1", gridData.id);
      gridModel.setCellValue(index, "def2", gridData.orderDetailId);
    } else {
      alert("物料【" + cinvcode + "】未在销售订单内，请核实！");
    }
  }
});
viewModel.on("beforeSave", function (args) {
  // 保存前校验
  var curDate = formatDate(new Date());
  let data = JSON.parse(args.data.data);
  data.def1 = curDate;
  args.data.data = JSON.stringify(data);
  var xmbarcode = viewModel.get("xmbarcode").getValue();
  if (xmbarcode == null || xmbarcode == undefined) {
    var proxy = viewModel.setProxy({
      queryData: {
        url: "/scmbc/stockzx/genXmbarcode",
        method: "get"
      }
    });
    // 传参
    var param = {};
    proxy.queryData({}, function (err, result) {
      viewModel.get("xmbarcode").setValue(err.msg);
    });
    return false;
  }
});
function formatDate(date) {
  var month = date.getMonth() + 1;
  return date.getFullYear() + "-" + month + "-" + date.getDate();
}
viewModel.on("afterSave", function (args) {
  var vbillcode = viewModel.get("vbillcode").getValue();
  var proxy = viewModel.setProxy({
    queryData: {
      url: "/scmbc/stockzx/updateTotalPackage",
      method: "get"
    }
  });
  // 传参
  var param = {
    vbillcode: vbillcode,
    totalp: totalp
  };
  proxy.queryData(param, function (err, result) {});
});
viewModel.get("stock_zx_bList") &&
  viewModel.get("stock_zx_bList").getEditRowModel() &&
  viewModel.get("stock_zx_bList").getEditRowModel().get("nnum") &&
  viewModel
    .get("stock_zx_bList")
    .getEditRowModel()
    .get("nnum")
    .on("valueChange", function (data) {
      // 主数量--值改变
    });