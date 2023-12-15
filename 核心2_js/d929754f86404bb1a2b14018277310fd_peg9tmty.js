viewModel.on("customInit", function (args) {
  let mode = viewModel.getParams().mode;
  if (mode == "browse") {
    viewModel.get("btnSubAbandon_2").setVisible(false);
    viewModel.get("btnSubSave_2").setVisible(false);
  }
});
viewModel.on("afterLoadMeta", function (args) {
  let mode = viewModel.getParams().mode;
  if (mode == "browse") {
    debugger;
    console.log(args.view.view.containers);
    args.view.view.containers[1].containers[4].containers[0].containers[0].containers[0].displayStyle = "normal";
  }
});
const orders_no_fieldid = "youridHere";
const product_fieldid = "youridHere";
const batch_fieldid = "youridHere";
const orders_no_code = "orders_no";
const product_code = "dctl1695199911805_17";
const batch_code = "dctl1695200411861_33";
let blur_flg = true;
viewModel.on("afterLoadData", (args) => {
  viewModel.getGridModel("retrieval_product_scan_detailsList").getEditRowModel().get("DI").setState("bCanModify", false);
});
viewModel.on("afterMount", function () {
  loadJs();
  window.setTimeout(function () {
    viewModel.get("orders_no").fireEvent("focus");
    window.scanInput.focus();
  }, 500);
});
function loadJs(viewModel) {
  let element = document.createElement("script");
  element.setAttribute("type", "text/javascript");
  element.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/BarcodeParser.js?domainKey=developplatform`);
  document.body.insertBefore(element, document.body.lastChild);
}
viewModel.get("orders_no").on("focus", function () {
  window.scanInput = getElementByFieldid(orders_no_fieldid);
  window.scanInput.addEventListener("keydown", orders_no_keydown);
});
viewModel.get("orders_no").on("blur", function () {
  if (blur_flg) window.scanInput.removeEventListener("keydown", orders_no_keydown);
});
function getElementByFieldid(fieldid) {
  let elements = document.getElementsByTagName("input");
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].getAttribute("fieldid") == fieldid) return elements[i];
  }
}
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
function string_nothing(param) {
  if (param == undefined) {
    return "";
  }
  if (param == null) {
    return "";
  }
  return param;
}
function orders_no_check(orders_no) {
  let res = cb.rest.invokeFunction("AT161E5DFA09D00001.apiFunction.scanCheckOrderNo", { orders_no: orders_no }, function (err, res) {}, viewModel, { async: false });
  if (res.error != undefined) {
    cb.utils.alert({
      title: res.error.message, // 弹窗文本内容
      type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
      duration: "5", // 自动关闭的延时，单位秒
      mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
    });
    return false;
  }
  if (res.result) {
    if (res.result.err) {
      cb.utils.alert({
        title: res.result.err, // 弹窗文本内容
        type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
        duration: "5", // 自动关闭的延时，单位秒
        mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
      });
      return false;
    }
  }
  return true;
}
function input_clear(control_code) {
  blur_flg = false;
  window.scanInput.blur();
  viewModel.get(control_code).setValue("");
  window.scanInput.focus();
  blur_flg = true;
}
viewModel.get("dctl1695199911805_17").on("focus", function () {
  window.scanInput = getElementByFieldid(product_fieldid);
  window.scanInput.addEventListener("keydown", product_keydown);
});
viewModel.get("dctl1695199911805_17").on("blur", function () {
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
    let orders_no = string_nothing(viewModel.get("orders_no").getValue());
    if (orders_no == "") {
      let element = getElementByFieldid(orders_no_fieldid);
      element.focus();
      cb.utils.alert({
        title: "请先输入/扫描出库单号", // 弹窗文本内容
        type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
        duration: "5", // 自动关闭的延时，单位秒
        mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
      });
      return;
    }
    if (scanInput == "") {
      return;
    }
    //扫描类型 3:UDI;2:DI;1:PI;0:异常
    let scan_type = checkScanCode(scanInput);
    if (scan_mode == "0") {
      if (scan_type == 1 || scan_type == 0) {
        cb.utils.alert({
          title: "扫码失败,请确认需要扫描的条形码/二维码", // 弹窗文本内容
          type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
          duration: "5", // 自动关闭的延时，单位秒
          mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
        });
        return;
      }
      if (scan_type == 2) {
        scan_mode = "1";
        return;
      }
    } else if (scan_mode == "1") {
      if (scan_type == 1) {
        scan_mode = "0";
      } else {
        cb.utils.alert({
          title: "扫码失败,请确认需要扫描的条形码/二维码", // 弹窗文本内容
          type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
          duration: "5", // 自动关闭的延时，单位秒
          mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
        });
        return;
      }
    }
    add_retrieval_product_scan_details(orders_no);
  }
}
var scan_mode = "0";
var scanUDISet = {};
var scanDISet = {};
function checkScanCode(scanInput) {
  let returnValue = 0;
  try {
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
          if (returnValue == 0 || returnValue == 1) {
            returnValue += 2;
          }
          DI = item.data;
        } else {
          if (returnValue == 0 || returnValue == 2) {
            returnValue += 1;
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
      if (returnValue == 3) {
        UDI = udiFormat(scanResult);
        PI = scanInput.replace("01" + DI, "");
      } else if (returnValue == 2 && scan_mode == 0) {
        scanDISet = { UDI: udiFormat(scanResult), DI: DI };
      } else if (returnValue == 1 && scan_mode == "1") {
        UDI = scanDISet.UDI + udiFormat(scanResult);
        DI = scanDISet.DI;
        PI = scanInput;
      }
      scanUDISet = { UDI: UDI, DI: DI, PI: PI, batch_number: batch_number, serial_number: serial_number, production_date: production_date, expiration_date: expiration_date };
    }
  } catch (e) {
    returnValue = 0;
  }
  return returnValue;
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
function add_retrieval_product_scan_details(orders_no) {
  debugger;
  let UDI = scanUDISet.UDI;
  let DI = scanUDISet.DI;
  let PI = scanUDISet.PI;
  let batch_number = scanUDISet.batch_number;
  let serial_number = scanUDISet.serial_number;
  let production_date = scanUDISet.production_date;
  let expiration_date = scanUDISet.expiration_date;
  let batch_number_temp = batch_number;
  if (batch_number_temp == "") {
    batch_number_temp = serial_number;
  }
  let retrieval_batch_scan_details = {
    from: "addrow",
    hasDefaultInit: true,
    show: true,
    _status: "Insert",
    UDI: UDI,
    DI: DI,
    PI: PI,
    batch_number: batch_number_temp,
    production_date: production_date,
    expiration_date: expiration_date
  };
  let retrieval_product_scan_detailsList = viewModel.getGridModel("retrieval_product_scan_detailsList");
  let retrieval_product_scan_details_data = retrieval_product_scan_detailsList.getData();
  if (retrieval_product_scan_details_data.length != 0) {
    for (let i = 0; i < retrieval_product_scan_details_data.length; i++) {
      if (retrieval_product_scan_details_data[i].UDI == UDI) {
        let product_control_method = retrieval_product_scan_details_data[i].product_control_method;
        if (product_control_method == "0") {
          retrieval_product_scan_details_data[i].retrieval_batch_scan_detailsList.unshift(retrieval_batch_scan_details);
        }
        retrieval_product_scan_details_data[i].quantity += 1;
        let retrieval_product_scan_details = retrieval_product_scan_details_data[i];
        retrieval_product_scan_details_data.splice(i, 1);
        retrieval_product_scan_details_data.unshift(retrieval_product_scan_details);
        retrieval_product_scan_detailsList.setData(retrieval_product_scan_details_data);
        return;
      }
    }
  }
  let res = cb.rest.invokeFunction(
    "AT161E5DFA09D00001.apiFunction.retrievalChkUDI",
    {
      mode: "0",
      orders_no: orders_no,
      DI: scanUDISet.DI,
      batch_number: scanUDISet.batch_number,
      serial_number: scanUDISet.serial_number,
      production_date: scanUDISet.production_date,
      expiration_date: scanUDISet.expiration_date
    },
    function (err, res) {},
    viewModel,
    { async: false }
  );
  if (res.error != undefined) {
    cb.utils.alert({
      title: res.error.message, // 弹窗文本内容
      type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
      duration: "5", // 自动关闭的延时，单位秒
      mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
    });
    return;
  }
  if (res.result) {
    if (res.result.err) {
      cb.utils.alert({
        title: res.result.err, // 弹窗文本内容
        type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
        duration: "5", // 自动关闭的延时，单位秒
        mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
      });
      return;
    }
    if (res.result.product_control_method) {
      let batch_number = "";
      let product_control_method = "";
      if (res.result.product_control_method == "0") {
        if (scanUDISet.batch_number == "") {
          batch_number = scanUDISet.serial_number;
        } else {
          batch_number = scanUDISet.batch_number;
        }
        product_control_method = "0";
      } else if (res.result.product_control_method == "1") {
        if (scanUDISet.serial_number == "") {
          batch_number = scanUDISet.batch_number;
        } else {
          batch_number = scanUDISet.serial_number;
        }
        product_control_method = "1";
      }
      let retrieval_product_scan_details = {
        from: "addrow",
        hasDefaultInit: true,
        show: true,
        _status: "Insert",
        UDI: scanUDISet.UDI,
        DI: scanUDISet.DI,
        PI: scanUDISet.PI,
        batch_number: batch_number,
        production_date: scanUDISet.production_date,
        expiration_date: scanUDISet.expiration_date,
        quantity: 1,
        product_control_method: product_control_method
      };
      if (product_control_method == "0") {
        retrieval_product_scan_details["retrieval_batch_scan_detailsList"] = [retrieval_batch_scan_details];
      }
      if (res.result.warn) {
        blur_flg = false;
        cb.utils.confirm(
          res.result.warn,
          () => {
            viewModel.getGridModel("retrieval_product_scan_detailsList").insertRow(0, retrieval_product_scan_details);
            if (product_control_method == "0") {
              cb.utils.confirm(
                "扫描到的产品为批次产品,是否继续扫描详细产品",
                () => {
                  document.getElementsByClassName("rows")[0].click();
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
              window.scanInput.focus();
              blur_flg = true;
              return;
            }
          },
          () => {
            window.scanInput.focus();
            blur_flg = true;
            return;
          }
        );
      } else {
        viewModel.getGridModel("retrieval_product_scan_detailsList").insertRow(0, retrieval_product_scan_details);
        if (product_control_method == "0") {
          blur_flg = false;
          cb.utils.confirm(
            "扫描到的产品为批次产品,是否继续扫描详细产品",
            () => {
              document.getElementsByClassName("rows")[0].click();
              blur_flg = true;
              return;
            },
            () => {
              window.scanInput.focus();
              blur_flg = true;
              return;
            }
          );
          return;
        }
      }
    }
  }
}
viewModel.get("dctl1695200411861_33").on("focus", function () {
  window.scanInput = getElementByFieldid(batch_fieldid);
  window.scanInput.addEventListener("keydown", batch_keydown);
});
viewModel.get("dctl1695200411861_33").on("blur", function () {
  if (blur_flg) window.scanInput.removeEventListener("keydown", batch_keydown);
});
function batch_keydown(event) {
  if (event.keyCode == 9 || event.keyCode == 13) {
    if (event.keyCode == 9) {
      event.keyCode = 0;
      event.returnValue = false;
    }
    let scanInput = string_nothing(window.scanInput.value);
    input_clear(batch_code);
    if (scanInput == "") {
      return;
    }
    let product_control_method = viewModel.getGridModel("retrieval_product_scan_detailsList").getEditRowModel().get("product_control_method").getValue();
    if (product_control_method == "1") {
      return;
    }
    let scan_type = checkSonScanCode(scanInput);
    if (scan_type == 2 || scan_type == 0) {
      cb.utils.alert({
        title: "扫码失败,请确认需要扫描的条形码/二维码", // 弹窗文本内容
        type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
        duration: "5", // 自动关闭的延时，单位秒
        mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
      });
      return;
    }
    let PUDI = viewModel.getGridModel("retrieval_product_scan_detailsList").getEditRowModel().get("UDI").getValue();
    let PPI = viewModel.getGridModel("retrieval_product_scan_detailsList").getEditRowModel().get("PI").getValue();
    let batch_number = viewModel.getGridModel("retrieval_product_scan_detailsList").getEditRowModel().get("batch_number").getValue();
    if (scan_type == 3) {
      if (scanUDISet.UDI == PUDI) {
        let retrieval_batch_scan_details = {
          from: "addrow",
          hasDefaultInit: true,
          show: true,
          _status: "Insert",
          UDI: scanUDISet.UDI,
          DI: scanUDISet.DI,
          PI: scanUDISet.PI,
          batch_number: batch_number,
          production_date: scanUDISet.production_date,
          expiration_date: scanUDISet.expiration_date
        };
        add_retrieval_batch_scan_detailsList(PUDI, retrieval_batch_scan_details);
        return;
      } else {
        let retrieval_batch_scan_detailsList = viewModel.getGridModel("retrieval_batch_scan_detailsList");
        let retrieval_batch_scan_detailsList_data = retrieval_batch_scan_detailsList.getData();
        if (retrieval_batch_scan_detailsList_data.length != 0) {
          for (let i = 0; i < retrieval_batch_scan_detailsList_data.length; i++) {
            if (retrieval_batch_scan_detailsList_data[i].UDI == scanUDISet.UDI) {
              let retrieval_batch_scan_details = {
                from: "addrow",
                hasDefaultInit: true,
                show: true,
                _status: "Insert",
                UDI: retrieval_batch_scan_detailsList_data[i].UDI,
                DI: retrieval_batch_scan_detailsList_data[i].DI,
                PI: retrieval_batch_scan_detailsList_data[i].PI,
                batch_number: retrieval_batch_scan_detailsList_data[i].batch_number,
                production_date: retrieval_batch_scan_detailsList_data[i].production_date,
                expiration_date: retrieval_batch_scan_detailsList_data[i].expiration_date
              };
              add_retrieval_batch_scan_detailsList(PUDI, retrieval_batch_scan_details);
              return;
            }
          }
        }
      }
    } else if (scan_type == 1) {
      if (scanUDISet.PI == PPI) {
        let retrieval_batch_scan_details = {
          from: "addrow",
          hasDefaultInit: true,
          show: true,
          _status: "Insert",
          UDI: scanUDISet.UDI,
          DI: scanUDISet.DI,
          PI: scanUDISet.PI,
          batch_number: batch_number,
          production_date: scanUDISet.production_date,
          expiration_date: scanUDISet.expiration_date
        };
        add_retrieval_batch_scan_detailsList(PUDI, retrieval_batch_scan_details);
        return;
      } else {
        let retrieval_batch_scan_detailsList = viewModel.getGridModel("retrieval_batch_scan_detailsList");
        let retrieval_batch_scan_detailsList_data = retrieval_batch_scan_detailsList.getData();
        if (retrieval_batch_scan_detailsList_data.length != 0) {
          for (let i = 0; i < retrieval_batch_scan_detailsList_data.length; i++) {
            if (retrieval_batch_scan_detailsList_data[i].DI == scanUDISet.DI && retrieval_batch_scan_detailsList_data[i].PI == scanUDISet.PI) {
              let retrieval_batch_scan_details = {
                from: "addrow",
                hasDefaultInit: true,
                show: true,
                _status: "Insert",
                UDI: "",
                DI: retrieval_batch_scan_detailsList_data[i].DI,
                PI: retrieval_batch_scan_detailsList_data[i].PI,
                batch_number: retrieval_batch_scan_detailsList_data[i].batch_number,
                production_date: retrieval_batch_scan_detailsList_data[i].production_date,
                expiration_date: retrieval_batch_scan_detailsList_data[i].expiration_date
              };
              add_retrieval_batch_scan_detailsList(PUDI, retrieval_batch_scan_details);
              return;
            }
          }
        }
      }
    }
    let orders_no = string_nothing(viewModel.get("orders_no").getValue());
    let res = cb.rest.invokeFunction(
      "AT161E5DFA09D00001.apiFunction.retrievalChkUDI",
      {
        mode: "1",
        orders_no: orders_no,
        DI: scanUDISet.DI,
        batch_number: scanUDISet.batch_number,
        serial_number: scanUDISet.serial_number,
        production_date: scanUDISet.production_date,
        expiration_date: scanUDISet.expiration_date
      },
      function (err, res) {},
      viewModel,
      { async: false }
    );
    if (res.error != undefined) {
      cb.utils.alert({
        title: res.error.message, // 弹窗文本内容
        type: "error", // 默认’info‘。可选 'error', 'fail', 'success', 'warning', 'info', 'noIcon'
        duration: "5", // 自动关闭的延时，单位秒
        mask: false // 是否显示透明蒙层，防止触摸穿透。false时不阻塞页面操作
      });
      return;
    }
    if (res.result) {
      if (res.result.batch_number) {
        blur_flg = false;
        let retrieval_batch_scan_details = {
          from: "addrow",
          hasDefaultInit: true,
          show: true,
          _status: "Insert",
          UDI: scanUDISet.UDI,
          DI: scanUDISet.DI,
          PI: scanUDISet.PI,
          batch_number: res.result.batch_number,
          production_date: scanUDISet.production_date,
          expiration_date: scanUDISet.expiration_date
        };
        cb.utils.confirm(
          "扫描到的产品信息在此批次中不存在，是否保留？",
          () => {
            add_retrieval_batch_scan_detailsList(PUDI, retrieval_batch_scan_details);
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
      }
    }
  }
}
function checkSonScanCode(scanInput) {
  let returnValue = 0;
  try {
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
          if (returnValue == 0 || returnValue == 1) {
            returnValue += 2;
          }
          DI = item.data;
        } else {
          if (returnValue == 0 || returnValue == 2) {
            returnValue += 1;
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
      if (returnValue == 3) {
        UDI = udiFormat(scanResult);
        PI = scanInput.replace("01" + DI, "");
      } else if (returnValue == 1) {
        DI = viewModel.getGridModel("retrieval_product_scan_detailsList").getEditRowModel().get("DI").getValue();
        PI = scanInput;
      }
      scanUDISet = { UDI: UDI, DI: DI, PI: PI, batch_number: batch_number, serial_number: serial_number, production_date: production_date, expiration_date: expiration_date };
    }
  } catch (e) {
    returnValue = 0;
  }
  return returnValue;
}
function add_retrieval_batch_scan_detailsList(UDI, retrieval_batch_scan_details) {
  let retrieval_product_scan_detailsList = viewModel.getGridModel("retrieval_product_scan_detailsList");
  let retrieval_product_scan_details_data = retrieval_product_scan_detailsList.getData();
  if (retrieval_product_scan_details_data.length != 0) {
    for (let i = 0; i < retrieval_product_scan_details_data.length; i++) {
      if (retrieval_product_scan_details_data[i].UDI == UDI) {
        retrieval_product_scan_details_data[i].retrieval_batch_scan_detailsList.unshift(retrieval_batch_scan_details);
        retrieval_product_scan_details_data[i].quantity += 1;
        let retrieval_product_scan_details = retrieval_product_scan_details_data[i];
        retrieval_product_scan_details_data.splice(i, 1);
        retrieval_product_scan_details_data.unshift(retrieval_product_scan_details);
        retrieval_product_scan_detailsList.setDataSource(retrieval_product_scan_details_data);
        return;
      }
    }
  }
}
viewModel.get("btnSave").on("click", function () {
  viewModel.get("scan_status").setValue("1");
});
viewModel.get("btnAbandon").on("click", function () {
  let retrieval_product_scan_detailsList = viewModel.getGridModel("retrieval_product_scan_detailsList");
  let retrieval_product_scan_details_data = retrieval_product_scan_detailsList.getData();
  if (retrieval_product_scan_details_data.length == 0) {
    viewModel.biz.do("closePage", viewModel);
  } else {
    viewModel.get("scan_status").setValue("2");
    viewModel.biz.do("Save", viewModel);
  }
});
viewModel.getGridModel("retrieval_batch_scan_detailsList").on("afterDeleteRows", function (args) {
  let retrieval_product_scan_detailsList = viewModel.getGridModel("retrieval_product_scan_detailsList");
  let retrieval_product_scan_details_data = retrieval_product_scan_detailsList.getData();
  if (retrieval_product_scan_details_data.length != 0) {
    let UDI = viewModel.getGridModel("retrieval_product_scan_detailsList").getEditRowModel().get("UDI").getValue();
    for (let i = 0; i < retrieval_product_scan_details_data.length; i++) {
      if (retrieval_product_scan_details_data[i].UDI == UDI) {
        let quantity = retrieval_product_scan_details_data[i].quantity;
        retrieval_product_scan_details_data[i].quantity = quantity - 1;
        retrieval_product_scan_detailsList.setData(retrieval_product_scan_details_data);
        return;
      }
    }
  }
});