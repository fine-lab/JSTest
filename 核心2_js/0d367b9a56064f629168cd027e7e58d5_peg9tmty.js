const cBillNo = "yb8055fdfd_ProductScanWarehousingMobileArchive";
const pallet_no_code = "pallet_no";
const product_code = "dctl1698025155444_7";
const pallet_no_fieldid = cBillNo + "|" + pallet_no_code + "_";
const product_fieldid = cBillNo + "|" + product_code + "_undefined";
let blur_flg = true;
function getCurrentTime() {
  let currentTime = new Date();
  let date = currentTime.toISOString().substr(0, 10);
  let time = currentTime.toTimeString().substr(0, 8);
  return date + " " + time;
}
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
    viewModel.get("pallet_no").fireEvent("focus");
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
viewModel.get("pallet_no").on("focus", function () {
  window.scanInput = getElementByFieldid(pallet_no_fieldid);
  window.scanInput.addEventListener("keydown", pallet_no_keydown);
});
viewModel.get("pallet_no").on("blur", function () {
  if (blur_flg) window.scanInput.removeEventListener("keydown", pallet_no_keydown);
});
function pallet_no_keydown(event) {
  if (event.keyCode == 9 || event.keyCode == 13) {
    if (event.keyCode == 9) {
      event.keyCode = 0;
      event.returnValue = false;
    }
    let scanInput = string_nothing(window.scanInput.value);
    if (scanInput == "") {
      return;
    }
    let res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.CheckPalletNo", { pallet_no: scanInput }, function (err, res) {}, viewModel, { async: false });
    if (res.error) {
      alertErrorMessage(res.error.message);
      return;
    }
    if (res.result.err) {
      alertErrorMessage(res.result.err);
      return;
    }
    if (res.result.asn_no) {
      let asn_no = res.result.asn_no;
      viewModel.get("asn_no").setValue(asn_no);
      let element = getElementByFieldid(product_fieldid);
      element.focus();
      viewModel.get("pallet_no").setState("readOnly", true);
    } else {
      input_clear(pallet_no_code);
    }
  }
}
viewModel.get("dctl1698025155444_7").on("focus", function () {
  window.scanInput = getElementByFieldid(product_fieldid);
  window.scanInput.addEventListener("keydown", product_keydown);
});
viewModel.get("dctl1698025155444_7").on("blur", function () {
  if (blur_flg) window.scanInput.removeEventListener("keydown", product_keydown);
});
function product_keydown(event) {
  if (event.keyCode == 9 || event.keyCode == 13) {
    if (event.keyCode == 9) {
      event.keyCode = 0;
      event.returnValue = false;
    }
    let scanInput = string_nothing(window.scanInput.value);
    input_clear(product_code);
    let asn_no = string_nothing(viewModel.get("asn_no").getValue());
    if (asn_no == "") {
      let element = getElementByFieldid(pallet_no_fieldid);
      element.focus();
      alertErrorMessage("请先扫描托盘号");
      return;
    }
    if (scanInput == "") {
      return;
    }
    scanInput = scanInput.replaceAll("(", "");
    scanInput = scanInput.replaceAll(")", "");
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
    add_product_scan_detailsList(asn_no);
  }
}
let scanUDISet = {};
let const_di = "";
function get_filter_list(list, UDI) {
  return list.filter((item) => item.UDI == UDI);
}
function newPseudoGuid() {
  let guid = "";
  for (let i = 1; i <= 32; i++) {
    let n = Math.floor(Math.random() * 16.0).toString(16);
    guid += n;
    if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
  }
  return guid;
}
function add_product_scan_detailsList(asn_no) {
  let UDI = scanUDISet.UDI;
  let DI = scanUDISet.DI;
  let PI = scanUDISet.PI;
  let batch_number = scanUDISet.batch_number;
  let serial_number = scanUDISet.serial_number;
  let production_date = scanUDISet.production_date;
  let expiration_date = scanUDISet.expiration_date;
  let param = {
    asn_no: asn_no,
    DI: DI,
    batch_number: batch_number,
    serial_number: serial_number,
    production_date: production_date,
    expiration_date: expiration_date
  };
  let res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.ScanCheckDI", param, function (err, res) {}, viewModel, { async: false });
  if (res.error) {
    alertErrorMessage(res.error.message);
    return;
  }
  let batch_or_serial_number = res.result.batch_number;
  let PackagingSpecifications = res.result.PackagingSpecifications;
  let record_key = newPseudoGuid();
  let product_scan_details = {
    from: "addrow",
    hasDefaultInit: true,
    show: true,
    _status: "Insert",
    UDI: UDI,
    DI: DI,
    PI: PI,
    batch_or_serial_number: batch_or_serial_number,
    production_date: production_date,
    expiration_date: expiration_date,
    quantity: PackagingSpecifications,
    record_key: record_key
  };
  let product_scan_detailsList = viewModel.getGridModel("product_scan_detailsList").getData();
  let product_scan_detailsList_filter = get_filter_list(product_scan_detailsList, UDI);
  if (product_scan_detailsList_filter.length == 0) {
    if (res.result.warn) {
      blur_flg = false;
      cb.utils.confirm(
        res.result.warn,
        () => {
          product_scan_detailsList.unshift(product_scan_details);
          viewModel.getGridModel("product_scan_detailsList").setData([]);
          window.setTimeout(function () {
            viewModel.getGridModel("product_scan_detailsList").setData(product_scan_detailsList);
          }, 50);
          add_product_scan_recordList(product_scan_details);
          window.scanInput.focus();
          blur_flg = true;
          return;
        },
        () => {
          cancel_product_scan_recordList(product_scan_details);
          window.scanInput.focus();
          blur_flg = true;
          return;
        }
      );
    } else {
      product_scan_detailsList.unshift(product_scan_details);
      viewModel.getGridModel("product_scan_detailsList").setData([]);
      viewModel.getGridModel("product_scan_detailsList").setData(product_scan_detailsList);
      add_product_scan_recordList(product_scan_details);
    }
  } else {
    product_scan_detailsList.unshift(product_scan_details);
    viewModel.getGridModel("product_scan_detailsList").setData([]);
    viewModel.getGridModel("product_scan_detailsList").setData(product_scan_detailsList);
    add_product_scan_recordList(product_scan_details);
  }
}
function add_product_scan_recordList(product_scan_details) {
  let record_key = product_scan_details.record_key;
  let UDI = product_scan_details.UDI;
  let DI = product_scan_details.DI;
  let PI = product_scan_details.PI;
  let batch_or_serial_number = product_scan_details.batch_or_serial_number;
  let production_date = product_scan_details.production_date;
  let expiration_date = product_scan_details.expiration_date;
  let quantity = product_scan_details.quantity;
  let scan_time = getCurrentTime();
  let product_scan_record = {
    from: "addrow",
    hasDefaultInit: true,
    show: true,
    _status: "Insert",
    record_key: record_key,
    UDI: UDI,
    DI: DI,
    PI: PI,
    batch_or_serial_number: batch_or_serial_number,
    production_date: production_date,
    expiration_date: expiration_date,
    quantity: quantity,
    detail_scan_status: "1",
    scan_time: scan_time
  };
  viewModel.getGridModel("product_scan_recordList").insertRow(0, product_scan_record);
}
function cancel_product_scan_recordList(product_scan_details) {
  let UDI = product_scan_details.UDI;
  let DI = product_scan_details.DI;
  let PI = product_scan_details.PI;
  let batch_or_serial_number = product_scan_details.batch_or_serial_number;
  let production_date = product_scan_details.production_date;
  let expiration_date = product_scan_details.expiration_date;
  let quantity = product_scan_details.quantity;
  let record_key = product_scan_details.record_key;
  let scan_time = getCurrentTime();
  let product_scan_record = {
    from: "addrow",
    hasDefaultInit: true,
    show: true,
    _status: "Insert",
    record_key: record_key,
    UDI: UDI,
    DI: DI,
    PI: PI,
    batch_or_serial_number: batch_or_serial_number,
    production_date: production_date,
    expiration_date: expiration_date,
    quantity: quantity,
    detail_scan_status: "2",
    scan_time: scan_time
  };
  viewModel.getGridModel("product_scan_recordList").insertRow(0, product_scan_record);
}
viewModel.get("btnSave").on("click", function () {
  viewModel.get("scan_status").setValue("1");
  UpdateRecord();
});
viewModel.get("btnAbandon").on("click", function () {
  let product_scan_detailsList = viewModel.getGridModel("product_scan_detailsList");
  let product_scan_detailsList_data = product_scan_detailsList.getData();
  let product_scan_recordList = viewModel.getGridModel("product_scan_recordList");
  let product_scan_recordList_data = product_scan_recordList.getData();
  if (product_scan_detailsList_data.length == 0 && product_scan_recordList_data.length == 0) {
    viewModel.biz.do("closePage", viewModel);
  } else {
    viewModel.get("scan_status").setValue("2");
    UpdateRecord();
    viewModel.biz.do("Save", viewModel);
  }
});
viewModel.getGridModel("product_scan_detailsList").on("afterDeleteRows", function (args) {
  let record_key = args[0].record_key;
  let UDI = args[0].UDI;
  let quantity = args[0].quantity;
  product_scan_detailsList_deleteRows(record_key, UDI, quantity);
});
function product_scan_detailsList_deleteRows(record_key, UDI, quantity) {
  let product_scan_recordList = viewModel.getGridModel("product_scan_recordList").getData();
  for (let i = 0; i < product_scan_recordList.length; i++) {
    if (product_scan_recordList[i].record_key == record_key && product_scan_recordList[i].UDI == UDI) {
      product_scan_recordList[i].quantity = quantity;
      product_scan_recordList[i].detail_scan_status = "3";
      let product_scan_record = product_scan_recordList[i];
      product_scan_recordList.splice(i, 1);
      product_scan_recordList.unshift(product_scan_record);
      viewModel.getGridModel("product_scan_recordList").setData(product_scan_recordList);
      return;
    }
  }
}
function UpdateRecord() {
  let product_scan_detailsList = viewModel.getGridModel("product_scan_detailsList").getData();
  let product_scan_recordList = viewModel.getGridModel("product_scan_recordList").getData();
  if (product_scan_detailsList.length > 0 && product_scan_recordList.length > 0) {
    for (let i = 0; i < product_scan_detailsList.length; i++) {
      for (let j = 0; j < product_scan_recordList.length; j++) {
        if (product_scan_detailsList[i].record_key == product_scan_recordList[j].record_key && product_scan_detailsList[i].UDI == product_scan_recordList[j].UDI) {
          product_scan_recordList[j].quantity = product_scan_detailsList[i].quantity;
        }
      }
    }
    viewModel.getGridModel("product_scan_recordList").setData(product_scan_recordList);
  }
}