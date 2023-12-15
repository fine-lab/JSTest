var cardCode = "yb744d5a98";
viewModel.on("afterMount", function () {
  //加载前端js
  loadJs();
  window.setTimeout(function () {
    viewModel.get("dctl1693695766224_1").fireEvent("focus");
    window.scanInput.focus();
  }, 1000);
  // 父标签点击禁用初始化
  document.querySelectorAll("." + cardCode + "MobileArchive .voucherdetail-container").forEach(function (element) {
    element.style.pointerEvents = "none";
  });
  // 所有删除按钮可点击初始化
  document.querySelectorAll("." + cardCode + "MobileArchive .yonui-img-icon").forEach(function (element) {
    element.style.pointerEvents = "all";
  });
});
function loadJs(viewModel) {
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  secScript.setAttribute("type", "text/javascript");
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/AT161E5DFA09D00001/BarcodeParser.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function mergeResult(result) {
  return result.parsedCodeItems
    .map((item) => {
      if (typeof item.data == "object") {
        return "(" + item.ai + ")" + item.orignData;
      }
      return "(" + item.ai + ")" + item.data;
    })
    .join("");
}
function appendScanData(scanCode) {
  var result = parseBarcode(scanCode);
  try {
    var parseData = mergeResult(result);
  } catch (e) {
    alert("扫描内容非UDI");
  }
  let gridModel = viewModel.getGridModel();
  let oldData = gridModel.getDataSourceRows();
  let rowsDataState = gridModel.__data.rowsDataState;
  rowsDataState.push("Insert");
  oldData.unshift({ scan_data: scanCode, parse_data: parseData });
  gridModel.__data.rowsDataState = rowsDataState;
  gridModel.setDataSource(oldData);
  window.scanInput.blur();
  viewModel.get("dctl1693695766224_1").setValue("");
  window.scanInput.focus();
}
viewModel.get("dctl1693695766224_1").on("focus", function () {
  if (!window.scanInput) {
    window.scanInput = findScanInput();
    window.scanInput.addEventListener("keydown", function (event) {
      if (event.keyCode == 13) {
        appendScanData(window.scanInput.value);
      } else if (event.keyCode == 9) {
        event.returnValue = false;
        appendScanData(window.scanInput.value);
      }
    });
  }
});
function findScanInput() {
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].getAttribute("fieldid") == "yb744d5a98MobileArchive|dctl1693695766224_1_undefined") {
      return inputs[i];
    }
  }
}
viewModel.get("dctl1693698508734_1").on("click", (data) => {
  try {
    appendScanData(window.scanInput.value);
  } catch (e) {
    console.log("step2", e);
  }
  try {
    viewModel.get("dctl1693695766224_1").fireEvent("focus");
    window.scanInput.focus();
  } catch (e) {
    console.log("step3", e);
  }
});
viewModel.get("btnAbandon").on("click", (data) => {
  viewModel.get("saomiaozhuangtai").setValue("取消扫描");
});
viewModel.get("btnSave").on("click", (data) => {
  viewModel.get("saomiaozhuangtai").setValue("完成扫描");
});
// 子页面【保存】按钮点击事件
viewModel.get("btnSubSave_1").on("click", (data) => {
  // 关闭子页面
  viewModel.biz.do("closePage", viewModel);
  // 所有删除按钮可点击
  document.querySelectorAll("." + cardCode + "MobileArchive .yonui-img-icon").forEach(function (element) {
    element.style.pointerEvents = "all";
  });
  // 取消第二条点击禁用START
  var parentEle = document.querySelector("." + cardCode + "MobileArchive .voucherdetail-container"); // 获取父元素
  parentEle.querySelectorAll(".scan_detailList-list-1")[0].style.pointerEvents = "all"; // 设置子元素style属性
  // 取消第二条点击禁用END
});