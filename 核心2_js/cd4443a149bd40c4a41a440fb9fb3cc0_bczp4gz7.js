//核心2
const WAV_ALERT = "https://www.example.com/"; //消息提示声音文件
//核心1
var gridModel = viewModel.getGridModel();
viewModel.get("button20jh") &&
  viewModel.get("button20jh").on("click", function (data) {
    // 出库--单击
    let allCheck = gridModel.getSelectedRows();
    if (allCheck == null || allCheck == undefined || allCheck.length == 0) {
      alert("请选择要出库的数据！");
      return false;
    }
    if (!valitBillCode()) {
      return false;
    }
    let doSaleOut = true;
    for (let i = 0; i < allCheck.length; i++) {
      if (allCheck[i].def2 == "已出库") {
        soundAlert();
        doSaleOut = false;
        cb.utils.confirm(
          "所选装箱单前面已做过出库，确认需要重新出库吗？",
          function () {
            doCheckAndMakeSaleOutBill(allCheck);
          },
          function (args) {}
        );
        break;
      }
    }
    if (doSaleOut) {
      doCheckAndMakeSaleOutBill(allCheck);
    }
  });
function doCheckAndMakeSaleOutBill(allCheck) {
  let doSaleOut = true;
  for (let i = 0; i < allCheck.length; i++) {
    if (!allCheck[i].def4) {
      soundAlert();
      doSaleOut = false;
      cb.utils.confirm(
        "所选装箱单中存在尚未打印运单的，确认要出库吗？",
        function () {
          makeSaleOutBill(allCheck);
        },
        function (args) {}
      );
      break;
    }
  }
  if (doSaleOut) {
    makeSaleOutBill(allCheck);
  }
}
function makeSaleOutBill(allCheck) {
  var proxy = viewModel.setProxy({
    queryData: {
      url: "/scmbc/stockzx/genXsckBill",
      method: "POST"
    }
  });
  // 传参
  var param = allCheck;
  proxy.queryData(param, function (err, result) {
    if (!err.success) {
      alert(err.msg);
      return;
    }
    if (err.msg == "操作成功") {
      cb.utils.alert("出库完成！");
    } else {
      cb.utils.alert(err.msg + "；出库完成！");
    }
    viewModel.execute("refresh");
  });
}
function soundAlert() {
  if (!document.getElementById("audioPlay")) {
    let ad = document.createElement("audio");
    ad.innerHTML = "<audio id='youridHere' src='" + WAV_ALERT + "' hidden='true'>";
    document.body.appendChild(ad);
  }
  document.getElementById("audioPlay").play();
}
window.alert = function (msg, callback) {
  soundAlert();
  var div = document.createElement("div");
  div.innerHTML =
    '<style type="text/css">' +
    ".nbaMask { position: fixed; z-index: 10000; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); } " +
    ".nbaMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; } " +
    ".nbaDialog { position: fixed; z-index: 50000; width: 80%; max-width: 500px; top: 35%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; }" +
    ".nbaDialog .nbaDialogHd { text-align: left; margin: 0.9rem; }  " +
    ".nbaDialog .nbaDialogHd .nbaDialogTitle { font-size: 17px; font-weight: 400; color: black;} " +
    ".nbaDialog .nbaDialogBd { text-align: left; padding: 0rem 0.9rem; font-size: 16px; line-height: 1.4; word-wrap: break-word; word-break: break-all; color: #000000; } " +
    ".nbaDialog .nbaDialogFt { position: relative; float: right; margin:0.9rem; } " +
    ".nbaDialog .nbaDialogBtn { display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #09BB07; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; } " +
    '.nbaDialog .nbaDialogBtn:after { content: " "; position: absolute; left: 0; top: 0; width: 1px; bottom: 0; border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5); }  ' +
    ".nbaDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }" +
    "</style>" +
    '<div id="youridHere" style="display: none">' +
    '<div class="nbaMask"></div>' +
    '<div class="nbaDialog">' +
    ' <div class="nbaDialogHd"><strong class="nbaDialogTitle">提示</strong></div>' +
    ' <div class="nbaDialogBd" id="youridHere">尽量控制在三行内</div>' +
    ' <div class="nbaDialogFt">' +
    "   <input type='button' value='确定' id='youridHere' style='background: #1A73E8; color: white; border: none; border-radius: 5px; padding: 0.4rem 0.9rem 0.6rem;'>" +
    " </div></div></div>";
  document.body.appendChild(div);
  var dialogs2 = document.getElementById("dialogs2");
  dialogs2.style.display = "block";
  var dialog_msg = document.getElementById("dialog_msg");
  dialog_msg.innerHTML = msg;
  var dialog_btn = document.getElementById("dialog_btn");
  dialog_btn.onclick = function () {
    dialogs2.style.display = "none";
    callback();
  };
};
viewModel.get("button24uf") &&
  viewModel.get("button24uf").on("click", function (data) {
    // 运单打印--单击
    let allCheck = gridModel.getSelectedRows();
    if (allCheck == null || allCheck == undefined || allCheck.length == 0) {
      alert("请选择要打印快递单的数据！");
      return false;
    }
    for (let i = 0; i < allCheck.length; i++) {
      if (!!allCheck[i].def4) {
        var kdflag = confirm("该装箱单已生成快递单，是否重新打印快递面单？");
        if (!kdflag) {
          return false;
        }
      }
    }
    if (!valitBillCode()) {
      return false;
    }
    //正确交付方式
    var strideOver = allCheck[0].stride_over;
    var printUrl = "";
    if (strideOver != undefined && (strideOver == "跨越速运" || strideOver == "跨越物流")) {
      printUrl = "/scmbc/stockzx/printKYBill";
    } else {
      printUrl = "/scmbc/stockzx/printSFBill";
    }
    var proxy = viewModel.setProxy({
      queryData: {
        url: printUrl,
        method: "POST"
      }
    });
    // 传参
    var param = allCheck;
    proxy.queryData(param, function (err, result) {
      if (!err.success) {
        alert(!!err.message ? err.message : err.msg);
        return;
      }
      if (err.code != 0) {
        alert(err.msg);
      } else {
        if (strideOver != undefined && (strideOver == "跨越速运" || strideOver == "跨越物流")) {
          var msg = !!err.message ? err.message : err.msg;
          if (msg != undefined && msg != null && msg.indexOf("https://") != -1) {
            window.open(msg);
          }
        } else {
          viewModel.execute("refresh");
          for (var i = 0; i < err.data.length; i++) {
            windowOpen(err.data[i].url, err.data[i].waybillNo, err.data[i].token);
          }
        }
      }
    });
  });
function windowOpen(url, fileName, token) {
  var xhr = new XMLHttpRequest();
  fileName = fileName + ".pdf"; // 文件名称
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.setRequestHeader("X-Auth-token", token);
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.onload = function (res) {
    if (this.status === 200) {
      var type = xhr.getResponseHeader("Content-Type");
      var blob = new Blob([this.response], { type: type });
      const iframe = document.createElement("iframe");
      iframe.style.visibility = "hidden";
      iframe.style.display = "none";
      var URL = window.URL || window.webkitURL;
      iframe.src = URL.createObjectURL(blob);
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
    }
  };
  xhr.send();
}
viewModel.on("beforeBatchdelete", function (args) {
  var allCheck = gridModel.getSelectedRows();
  for (var i = 0; i < allCheck.length; i++) {
    var def2 = allCheck[i].def2;
    if (def2 == "已出库") {
      alert("已出库数据不能删除！");
      return false;
    }
  }
});
viewModel.on("afterBatchdelete", function (args) {
  let datas = args.res.infos;
  let vbillcodes = [];
  for (var i = 0; i < datas.length; i++) {
    let data = datas[i];
    if (!vbillcodes.includes(data.vbillcode)) {
      vbillcodes[vbillcodes.length == 0 ? 0 : vbillcodes.length - 1] = data.vbillcode;
    }
  }
  for (var i = 0; i < vbillcodes.length; i++) {
    updatePackageNum(vbillcodes[i]);
  }
});
function updatePackageNum(vbillcode) {
  var proxy = viewModel.setProxy({
    queryData: {
      url: "/scmbc/stockzx/updateTotalPackage",
      method: "get"
    }
  });
  // 传参
  var param = {
    vbillcode: vbillcode
  };
  proxy.queryData(param, function (err, result) {});
}
viewModel.on("customInit", function (data) {
  viewModel.get("button35oe")._set_data("cmdParameter", '{"printcode":"temp","meta":1,"classifyCode":"357a4b42","params":{"billno":"357a4b42"}}');
});
// 打印校验
viewModel.on("beforePrintnow", function (args) {
  if (!valitBillCode()) {
    return false;
  }
  return valiZx();
});
// 打印预览校验
viewModel.get("button35oe") &&
  viewModel.get("button35oe").on("beforeclick", (params = {}) => {
    if (!valitBillCode()) {
      return false;
    }
    return valiZx();
  });
function valitBillCode() {
  let allCheck = gridModel.getSelectedRows();
  let vcode = allCheck[0].vbillcode;
  let valitResult = true;
  for (let i in allCheck) {
    if (vcode != allCheck[i].vbillcode) {
      valitResult = false;
    }
  }
  if (!valitResult) {
    alert("请选择出库指示单号相同的单据进行操作！");
  }
  return valitResult;
}
// 请求验证接口
function valiZx() {
  var allCheck = gridModel.getSelectedRows();
  if (allCheck == null || allCheck == undefined || allCheck.length == 0) {
    alert("请选择要打印的数据！");
    return false;
  }
  var proxy = viewModel.setProxy({
    queryData: {
      url: "/scmbc/stockzx/validateZx?vazx=false",
      method: "POST",
      options: {
        mask: true,
        async: false
      }
    }
  });
  // 传参
  var param = allCheck;
  const reData = proxy.queryData(param);
  if (!!reData.result && reData.result.status != 200) {
    alert(result.error);
    return false;
  }
  if (!reData.error.success) {
    alert(reData.error.msg);
    return false;
  }
  return true;
}