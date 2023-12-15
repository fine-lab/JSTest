const cBillNo = "yb909fb2aeMobileArchive_ProductScanOutboundMobileArchive";
const orders_no_code = "orders_no";
const product_code = "dctl1698281624414_7";
const orders_no_fieldid = cBillNo + "|" + orders_no_code + "_";
const product_fieldid = cBillNo + "|" + product_code + "_undefined";
let blur_flg = true;
function string_nothing(value) {
  if (value) return value;
  return "";
}
function yy_to_yyyy(param) {
  if (param == "") return "";
  let date = "20" + param;
  let reg = /^(\d{4})(\d{2})(\d{2})$/;
  return date.replace(reg, "$1-$2-$3");
}
function udiFormat(scanResult) {
  return scanResult.parsedCodeItems
    .map((item) => {
      if (typeof item.data == "object") {
        return "(" + item.ai + ")" + item.orignData;
      }
      return "(" + item.ai + ")" + item.data;
    })
    .join("");
}
function getElementByFieldid(fieldid) {
  let elements = document.getElementsByTagName("input");
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute("fieldid") == fieldid) {
      return elements[i];
    }
  }
}
function loadJs(viewModel) {
  let element = document.createElement("script");
  element.setAttribute("type", "text/javascript");
  element.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/BarcodeParser.js?domainKey=developplatform`);
  document.body.insertBefore(element, document.body.lastChild);
}
viewModel.on("afterMount", function () {
  loadJs();
  window.setTimeout(function () {
    viewModel.get("orders_no").fireEvent("focus");
    window.scanInput.focus();
  }, 50);
});
function alertErrorMessage(msg) {
  cb.utils.alert({
    title: msg,
    type: "error",
    duration: "5",
    mask: false
  });
}
function input_clear(control_code) {
  blur_flg = false;
  window.scanInput.blur();
  viewModel.get(control_code).setValue("");
  window.scanInput.focus();
  blur_flg = true;
}
viewModel.get("orders_no").on("focus", function () {
  window.scanInput = getElementByFieldid(orders_no_fieldid);
  window.scanInput.addEventListener("keydown", orders_no_keydown);
});
viewModel.get("orders_no").on("blur", function () {
  if (blur_flg) window.scanInput.removeEventListener("keydown", orders_no_keydown);
});
function orders_no_keydown(event) {
  if (event.keyCode == 9 || event.keyCode == 13) {
    if (event.keyCode == 9) {
      event.keyCode = 0;
      event.returnValue = false;
    }
    let scanInput = string_nothing(window.scanInput.value);
    if (scanInput == "") {
      return;
    }
    let isOk = orders_no_check(scanInput);
    if (isOk) {
      let element = getElementByFieldid(product_fieldid);
      element.focus();
      viewModel.get("orders_no").setState("readOnly", true);
    } else {
      input_clear(orders_no_code);
    }
  }
}
function orders_no_check(orders_no) {
  let res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.scanCheckOrderNo", { orders_no: orders_no }, function (err, res) {}, viewModel, { async: false });
  if (res.error) {
    alertErrorMessage(res.error.message);
    return false;
  }
  if (res.result) {
    if (res.result.err) {
      alertErrorMessage(res.result.err);
      return false;
    }
  }
  return true;
}
viewModel.get("dctl1698281624414_7").on("focus", function () {
  window.scanInput = getElementByFieldid(product_fieldid);
  window.scanInput.addEventListener("keydown", product_keydown);
});
viewModel.get("dctl1698281624414_7").on("blur", function () {
  if (blur_flg) window.scanInput.removeEventListener("keydown", product_keydown);
});
let scanUDISet = {};
let const_di = "";
function product_keydown(event) {
  if (event.keyCode == 9 || event.keyCode == 13) {
    if (event.keyCode == 9) {
      event.keyCode = 0;
      event.returnValue = false;
    }
    let scanInput = string_nothing(window.scanInput.value);
    input_clear(product_code);
    let orders_no = string_nothing(viewModel.get("orders_no").getValue());
    if (orders_no == "") {
      let element = getElementByFieldid(orders_no_fieldid);
      element.focus();
      alertErrorMessage("请先扫描出库单号");
      return;
    }
    if (scanInput == "") {
      return;
    }
    scanInput = scanInput.replaceAll("(", "");
    scanInput = scanInput.replaceAll(")", "");
    debugger;
    //扫描类型 3:UDI;2:DI;1:PI
    try {
      let scan_type = 0;
      let scanResult = parseBarcode(scanInput);
      if (scanResult.parsedCodeItems.length > 0) {
        let UDI = "";
        let DI = "";
        let PI = "";
        let batch_number = "";
        let serial_number = "";
        let production_date = "";
        let expiration_date = "";
        scanResult.parsedCodeItems.forEach((item) => {
          if (item.ai == "01") {
            if (scan_type == 0 || scan_type == 1) {
              scan_type += 2;
            }
            DI = item.data;
          } else {
            if (scan_type == 0 || scan_type == 2) {
              scan_type += 1;
            }
            if (item.ai == "10") {
              batch_number = item.data;
            } else if (item.ai == "21") {
              serial_number = item.data;
            } else if (item.ai == "11") {
              production_date = yy_to_yyyy(item.orignData);
            } else if (item.ai == "17") {
              expiration_date = yy_to_yyyy(item.orignData);
            }
          }
        });
        if (scan_type == 1) {
          if (const_di == "") {
            alertErrorMessage("扫码失败,请确认需要扫描的条形码/二维码");
            return;
          }
          UDI = "(01)" + const_di + udiFormat(scanResult);
          DI = const_di;
          PI = scanInput;
        } else if (scan_type == 2) {
          const_di = DI;
          return;
        } else if (scan_type == 3) {
          UDI = udiFormat(scanResult);
          PI = scanInput.replace("01" + DI, "");
          const_di = DI;
        }
        scanUDISet = { UDI: UDI, DI: DI, PI: PI, batch_number: batch_number, serial_number: serial_number, production_date: production_date, expiration_date: expiration_date };
      }
    } catch (e) {
      alertErrorMessage("扫码失败,请确认需要扫描的条形码/二维码");
      return;
    }
    add_product_scan_detailsList(orders_no);
  }
}
function get_filter_list(list, UDI) {
  return list.filter((item) => item.UDI == UDI);
}
function add_product_scan_detailsList(orders_no) {
  let UDI = scanUDISet.UDI;
  let DI = scanUDISet.DI;
  let PI = scanUDISet.PI;
  let batch_number = scanUDISet.batch_number;
  let serial_number = scanUDISet.serial_number;
  let production_date = scanUDISet.production_date;
  let expiration_date = scanUDISet.expiration_date;
  let param = {
    orders_no: orders_no,
    DI: DI,
    batch_number: batch_number,
    serial_number: serial_number,
    production_date: production_date,
    expiration_date: expiration_date
  };
  let res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.ScanCheckDIOut", param, function (err, res) {}, viewModel, { async: false });
  if (res.error) {
    alertErrorMessage(res.error.message);
    return;
  }
  let batch_or_serial_number = res.result.batch_number;
  let quantity = res.result.PackagingSpecifications;
  let retrieval_product_scan_details = {
    from: "addrow",
    hasDefaultInit: true,
    show: true,
    _status: "Insert",
    UDI: UDI,
    DI: DI,
    PI: PI,
    batch_number: batch_or_serial_number,
    production_date: production_date,
    expiration_date: expiration_date,
    quantity: quantity
  };
  let retrieval_product_scan_detailsList = viewModel.getGridModel("retrieval_product_scan_detailsList").getData();
  let retrieval_product_scan_detailsList_filter = get_filter_list(retrieval_product_scan_detailsList, UDI);
  if (retrieval_product_scan_detailsList_filter.length == 0) {
    if (res.result.warn) {
      blur_flg = false;
      cb.utils.confirm(
        res.result.warn,
        () => {
          retrieval_product_scan_detailsList.unshift(retrieval_product_scan_details);
          viewModel.getGridModel("retrieval_product_scan_detailsList").setData([]);
          window.setTimeout(function () {
            viewModel.getGridModel("retrieval_product_scan_detailsList").setData(retrieval_product_scan_detailsList);
          }, 50);
          window.scanInput.focus();
          blur_flg = true;
          return;
        },
        () => {
          window.scanInput.focus();
          blur_flg = true;
          return;
        }
      );
    } else {
      retrieval_product_scan_detailsList.unshift(retrieval_product_scan_details);
      viewModel.getGridModel("retrieval_product_scan_detailsList").setData([]);
      viewModel.getGridModel("retrieval_product_scan_detailsList").setData(retrieval_product_scan_detailsList);
    }
  } else {
    retrieval_product_scan_detailsList.unshift(retrieval_product_scan_details);
    viewModel.getGridModel("retrieval_product_scan_detailsList").setData([]);
    viewModel.getGridModel("retrieval_product_scan_detailsList").setData(retrieval_product_scan_detailsList);
  }
}
viewModel.get("btnSave").on("click", function () {
  viewModel.get("scan_status").setValue("1");
});
viewModel.get("btnAbandon").on("click", function () {
  let retrieval_product_scan_detailsList = viewModel.getGridModel("retrieval_product_scan_detailsList").getData();
  if (retrieval_product_scan_detailsList.length == 0) {
    viewModel.biz.do("closePage", viewModel);
  } else {
    viewModel.get("scan_status").setValue("2");
    viewModel.biz.do("Save", viewModel);
  }
});