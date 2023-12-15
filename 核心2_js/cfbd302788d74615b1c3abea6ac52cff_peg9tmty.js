debugger;
var lastASN = "";
viewModel.on("afterMount", function () {
  viewModel.get("end_number").setDisabled(true);
  viewModel.getParams().templateType = 1;
  viewModel.getParams().query.busiObj = "barcodeprint";
  var asn = viewModel.getParams().asn;
  if (asn != null && asn) {
    viewModel.get("asn").setValue(asn);
    initASN(asn);
    checkASN();
  } else {
    viewModel.get("pallet_quanlity").setValue(10);
    viewModel.get("start_number").setValue(1);
    resetEndNumber();
  }
});
viewModel.get("asn") &&
  viewModel.get("asn").on("blur", function (args) {
    //预到货通知单号(ASN)--失去焦点的回调
    checkASN();
  });
viewModel.on("afterSave", function (args) {
  debugger;
  viewModel.biz.do("printtemplates", viewModel);
  window.setTimeout(function () {
    viewModel.get("btnPrintPreview").fireEvent("click");
    const isBaseModel = viewModel.get("id") instanceof cb.models.BaseModel;
    viewModel.communication({ type: "return", payload: { id: isBaseModel && viewModel.get("id")?.getValue(), cParameter: viewModel.getParams().params?.cParameter } });
  }, 1000);
});
viewModel.get("start_number") &&
  viewModel.get("start_number").on("afterValueChange", function (data) {
    resetEndNumber();
  });
viewModel.get("asn") &&
  viewModel.get("asn").on("afterValueChange", function (data) {
    //值改变后
    resetChild();
  });
viewModel.get("pallet_quanlity") &&
  viewModel.get("pallet_quanlity").on("afterValueChange", function (data) {
    //值改变后
    resetEndNumber();
  });
function checkASN() {
  debugger;
  var asn = viewModel.get("asn").getValue();
  if (!asn || asn == null || asn == "") {
    return;
  }
  if (lastASN == asn) {
    return;
  }
  cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.searchInStorage", { asn: asn }, function (err, resp) {
    var res = resp.res;
    if (res.length == 0) {
      cb.utils.alert("输入的ASN不存在", "error");
      lastASN = "";
    } else {
      if (lastASN != asn) {
        lastASN = asn;
        initASN(asn);
      }
    }
  });
}
var isInitASN = false;
function initASN(asn) {
  if (isInitASN) {
    return;
  }
  isInitASN = true;
  cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.searchPallet", { asn: asn }, function (err, resp) {
    var res = resp.res;
    if (res.length > 0) {
      cb.utils.confirm(
        "ASN:" + asn + "已打印过,是否从上一次继续打印？",
        function () {
          var start_number = res[0].end_number + 1;
          viewModel.get("pallet_quanlity").setValue(res[0].end_number - res[0].start_number + 1);
          viewModel.get("start_number").setValue(start_number);
          resetEndNumber();
          isInitASN = false;
        },
        function () {
          isInitASN = false;
        }
      );
    } else {
      viewModel.get("pallet_quanlity").setValue(10);
      viewModel.get("start_number").setValue(1);
      resetEndNumber();
      isInitASN = false;
    }
  });
}
viewModel.on("beforeSave", function (args) {
  debugger;
  if (lastASN == "") {
    cb.utils.alert("输入的ASN不存在", "error");
    return false;
  }
  if (viewModel.get("end_number").getValue() > 999) {
    cb.utils.alert("托盘号最大到999，请检查！", "error");
    return false;
  }
});
function resetEndNumber() {
  viewModel.get("end_number").setValue(viewModel.get("start_number").getValue() + viewModel.get("pallet_quanlity").getValue() - 1);
  resetChild();
}
function resetChild() {
  var asn = viewModel.get("asn").getValue();
  if (!asn) {
    return;
  }
  var gridModel = viewModel.get("pallet_itemList");
  var rows = gridModel.getRows();
  let deleteRowIndexes = [];
  rows.forEach((row, index) => {
    deleteRowIndexes.push(index);
  });
  //清空
  gridModel.deleteRows(deleteRowIndexes);
  var startNumber = viewModel.get("start_number").getValue();
  var endNumber = viewModel.get("end_number").getValue();
  endNumber = endNumber + 1;
  for (var i = startNumber; i < endNumber; i++) {
    var palletno = prefixInteger(i, 3);
    var barcode = asn + "-" + palletno;
    gridModel.appendRow({ asn: asn, palletno: palletno, barcode: barcode });
  }
}
function prefixInteger(num, length) {
  return (num / Math.pow(10, length)).toFixed(length).substr(2);
}