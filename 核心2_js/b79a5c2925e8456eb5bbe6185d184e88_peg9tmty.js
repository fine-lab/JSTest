var lastASN = "";
viewModel.on("afterMount", function () {
  debugger;
  viewModel.get("end_number").setDisabled(true);
  viewModel.getParams().templateType = 1;
  viewModel.getParams().query.busiObj = "barcodeprint";
  var asn = viewModel.getParams().asn;
  if (asn != null && asn) {
    viewModel.get("asn").setValue(asn);
    initASN(asn);
    checkASN();
  } else {
    init();
  }
});
viewModel.get("asn") &&
  viewModel.get("asn").on("blur", function (args) {
    //预到货通知单号(ASN)--失去焦点的回调
    checkASN();
  });
viewModel.on("afterSave", function (args) {
  debugger;
  var printId = viewModel.get("id").getValue();
  var paramObj = { billno: "yb305f16b7", printcountswitch: true, printrefreshinterval: 1000, ids: [printId] };
  console.log("param", paramObj);
  var jsonString = JSON.stringify(paramObj);
  var encodedString = encodeURIComponent(jsonString);
  console.log("encodedString", encodedString);
  var tenantId = cb.utils.getTenantId("developplatform");
  var yht_access_token = cb.utils.getToken("developplatform");
  var printcode = "u8c1873911686158090242";
  var printUrl = "https://www.example.com/";
  printUrl += "?appSource=developplatform";
  printUrl += "&domainDataBaseByCode=YYGJFW";
  printUrl += "&tenantId=" + tenantId;
  printUrl += "&meta=5";
  printUrl += "&sendType=6";
  printUrl += "&lang=zh_CN";
  printUrl += "&yht_access_token=" + yht_access_token;
  printUrl += "&printcode=" + printcode;
  printUrl += "&domainKey=developplatform";
  printUrl += "&params=" + encodedString;
  printUrl += "&newArch=true";
  window.open(printUrl);
});
function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
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
  var asn = viewModel.getParams().asn ? viewModel.getParams().asn : viewModel.get("asn").getValue();
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
    viewModel.get("asn").setValue(asn);
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
          init();
        }
      );
    } else {
      init();
    }
  });
}
viewModel.on("beforeSave", function (args) {
  debugger;
  cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.searchInStorage", { asn: viewModel.get("asn").getValue() }, function (err, resp) {
    var res = resp.res;
    if (res.length == 0) {
      cb.utils.alert("输入的ASN不存在", "error");
      return false;
    }
    if (viewModel.get("end_number").getValue() > 999) {
      cb.utils.alert("托盘号最大到999，请检查！", "error");
      return false;
    }
  });
});
function init() {
  viewModel.get("pallet_quanlity").setValue(10);
  viewModel.get("start_number").setValue(1);
  resetEndNumber();
  isInitASN = false;
}
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