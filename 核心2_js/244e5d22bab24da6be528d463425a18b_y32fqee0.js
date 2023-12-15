viewModel.on("afterMount", function () {
  loadJs();
});
function loadJs(viewModel) {
  var secScript = document.createElement("script");
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/BarcodeParser.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function TrayNoScanInput() {
  var element = document.getElementsByTagName("input");
  for (var i = 0; i < element.length; i++) {
    if (element[i].getAttribute("fieldid") == "yb2508ff43MobileArchive|tray_no_") {
      return element[i];
    }
  }
}
function ProductScanInput() {
  var element = document.getElementsByTagName("input");
  for (var i = 0; i < element.length; i++) {
    if (element[i].getAttribute("fieldid") == "yb2508ff43MobileArchive|dctl1694156302712_5_undefined") {
      return element[i];
    }
  }
}
//托盘号输入框键入事件
function TrayNoKeyDown(event) {
  if (event.keyCode == 13) {
    cb.utils.alert(window.scanInput.value, "success");
  }
}
function getUDI(ScanAnalysisResult) {
  return ScanAnalysisResult.parsedCodeItems
    .map((item) => {
      if (typeof item.data == "object") {
        return "(" + item.ai + ")" + item.orignData;
      }
      return "(" + item.ai + ")" + item.data;
    })
    .join("");
}
var modeFlg = "0";
var di_save = "";
var di_temp_save = "";
function ProductKeyDown(event) {
  if (event.keyCode == 13) {
    debugger;
    var ScanAnalysisResult = parseBarcode(window.scanInput.value);
    var di_flg = false;
    var pi_flg = false;
    var di_temp = "";
    var batch_number_temp = "";
    var production_date_temp = "";
    var expiration_date_temp = "";
    ScanAnalysisResult.parsedCodeItems.forEach((item) => {
      if (item.ai == "01") {
        di_flg = true;
        if (typeof item.data == "object") {
          di_temp = item.orignData;
        } else {
          di_temp = item.data;
        }
      } else if (item.ai == "11") {
        pi_flg = true;
        if (typeof item.data == "object") {
          production_date_temp = item.orignData;
        } else {
          production_date_temp = item.data;
        }
      } else if (item.ai == "17") {
        pi_flg = true;
        if (typeof item.data == "object") {
          expiration_date_temp = item.orignData;
        } else {
          expiration_date_temp = item.data;
        }
      } else if (item.ai == "10") {
        pi_flg = true;
        if (typeof item.data == "object") {
          batch_number_temp = item.orignData;
        } else {
          batch_number_temp = item.data;
        }
      } else if (item.ai == "21") {
        pi_flg = true;
        if (typeof item.data == "object") {
          batch_number_temp = item.orignData;
        } else {
          batch_number_temp = item.data;
        }
      }
    });
    if (modeFlg == "0") {
      if (di_flg && pi_flg) {
        modeFlg = "0";
        di_save = "";
        di_temp_save = "";
        var udi = getUDI(ScanAnalysisResult);
        if (production_date_temp != "") {
          production_date_temp = "20" + production_date_temp;
          var reg = /^(\d{4})(\d{2})(\d{2})$/;
          production_date_temp = production_date_temp.replace(reg, "$1-$2-$3");
        }
        if (expiration_date_temp != "") {
          expiration_date_temp = "20" + expiration_date_temp;
          var reg = /^(\d{4})(\d{2})(\d{2})$/;
          expiration_date_temp = expiration_date_temp.replace(reg, "$1-$2-$3");
        }
        InsertSonData("mobile_scan_detailList", {
          udi: udi,
          di: di_temp,
          batch_no_or_serial_no: batch_number_temp,
          production_date: production_date_temp,
          expiration_date: expiration_date_temp,
          qty: "1"
        });
      } else if (di_flg && pi_flg == false) {
        modeFlg = "1";
        di_save = getUDI(ScanAnalysisResult);
        di_temp_save = di_temp;
        cb.utils.alert("DI扫描成功，请扫描PI。", "success");
      } else if (di_flg == false && pi_flg) {
        cb.utils.alert("扫描PI前需要先扫描DI。", "error");
      }
    } else if (modeFlg == "1") {
      if (di_flg && pi_flg) {
        cb.utils.alert("请扫描PI。", "error");
      } else if (di_flg && pi_flg == false) {
        cb.utils.alert("请扫描PI。", "error");
      } else if (di_flg == false && pi_flg) {
        var pi_temp = getUDI(ScanAnalysisResult);
        var uid = di_save + pi_temp;
        debugger;
        if (production_date_temp != "") {
          production_date_temp = "20" + production_date_temp;
          var reg = /^(\d{4})(\d{2})(\d{2})$/;
          production_date_temp = production_date_temp.replace(reg, "$1-$2-$3");
        }
        if (expiration_date_temp != "") {
          expiration_date_temp = "20" + expiration_date_temp;
          var reg = /^(\d{4})(\d{2})(\d{2})$/;
          expiration_date_temp = expiration_date_temp.replace(reg, "$1-$2-$3");
        }
        InsertSonData("mobile_scan_detailList", {
          udi: uid,
          di: di_temp_save,
          batch_no_or_serial_no: batch_number_temp,
          production_date: production_date_temp,
          expiration_date: expiration_date_temp,
          qty: "1"
        });
        modeFlg = "0";
        di_save = "";
        di_temp_save = "";
      }
    }
    window.scanInput.value = "";
    viewModel.get("dctl1694156302712_5").setValue("");
  }
}
function InsertSonData(viewModelId, DataSource) {
  viewModel.get(viewModelId).insertRow(0, DataSource);
}
viewModel.get("tray_no").on("focus", function () {
  window.scanInput = TrayNoScanInput();
  window.scanInput.addEventListener("keydown", TrayNoKeyDown);
});
viewModel.get("tray_no").on("blur", function () {
  window.scanInput.removeEventListener("keydown", TrayNoKeyDown);
  window.scanInput = null;
});
viewModel.get("dctl1694156302712_5").on("focus", function () {
  window.scanInput = ProductScanInput();
  window.scanInput.addEventListener("keydown", ProductKeyDown);
});
viewModel.get("dctl1694156302712_5").on("blur", function () {
  window.scanInput.removeEventListener("keydown", ProductKeyDown);
  window.scanInput = null;
});
viewModel.get("btnSave").on("click", function () {
  viewModel.get("scan_status").setValue("1");
  cb.utils.alert("OK", "success");
});