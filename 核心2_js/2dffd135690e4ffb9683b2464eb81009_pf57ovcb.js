//供应商同步sap脚本
viewModel.get("button28sf") &&
  viewModel.get("button28sf").on("click", function (data) {
    // 同步sap--单击
    let selectRows = viewModel.getGridModel().getSelectedRows();
    let result = cb.rest.invokeFunction("GZTBDM.shibin.syncSupplierSap", { rows: selectRows }, function (err, res) {
      if (typeof res != "undefined") {
        let responseStr = res.responseObj;
        let responseArr = JSON.parse(responseStr);
        let resCode = responseArr.code;
        if (resCode != "200") {
          alert("存在同步失败的数据：" + responseArr.message + "！");
        }
      }
    });
    alert("同步中，请稍后查看列表");
  });