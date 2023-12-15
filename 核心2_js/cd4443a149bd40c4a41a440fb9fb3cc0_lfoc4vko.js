var gridModel = viewModel.getGridModel();
viewModel.get("button20jh") &&
  viewModel.get("button20jh").on("click", function (data) {
    // 出库--单击
    var allCheck = gridModel.getSelectedRows();
    if (allCheck == null || allCheck == undefined || allCheck.length == 0) {
      alert("请选择要出库的数据！");
      return false;
    }
    var xm = "";
    for (var i = 0; i < allCheck.length; i++) {
      debugger;
      var def2 = allCheck[i].def2;
      if (def2 == "已出库") {
        if (i == 0) {
          xm = allCheck[i].xmbarcode;
        } else {
          xm = xm + "," + allCheck[i].xmbarcode;
        }
      }
    }
    if (xm != "") {
      alert("装箱单【" + xm + "】已出库，不允许再出库");
      return false;
    }
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
        cb.utils.alert(err.msg, "error");
        return;
      }
    });
  });
viewModel.get("button24uf") &&
  viewModel.get("button24uf").on("click", function (data) {
    // 顺丰快递--单击
  });