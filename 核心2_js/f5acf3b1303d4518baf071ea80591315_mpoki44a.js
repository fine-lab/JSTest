let qrcode = null;
viewModel.get("wl_name").on("beforeBrowse", function (data) {
  debugger;
  var condition = {
    isExtend: false,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "code",
    op: "like",
    value1: "LY01"
  });
  this.setFilter(condition);
});
viewModel.on("modeChange", function (data) {
  debugger;
  if (data == "add" || data == "edit") {
    viewModel.get("item50ke").setVisible(false);
  } else {
    viewModel.get("item50ke").setVisible(true);
  }
});
//页面数据加载完成后触发
viewModel.on("afterLoadData", function () {
  debugger;
  var dt = viewModel.getAllData();
  var value = dt.sampleNo + ";" + dt.sampleTime + ";" + dt.sampleAddress_name + ";" + dt.wl_name + ";" + dt.supplier_name + ";" + dt.carNo;
  if (!value.includes("undefined")) {
    if (qrcode == null) {
      qrcode = new QRCode(document.getElementsByClassName("am-flexbox yonui-mobile-flex-runtime am-flexbox-dir-row am-flexbox-nowrap am-flexbox-justify-center am-flexbox-align-center")[0], {
        text: value,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      qrcode.makeCode(value);
    }
    var src = qrcode._oDrawing._elCanvas.toDataURL("image/png");
    viewModel.setCache("src", src);
  }
});