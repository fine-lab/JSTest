viewModel.on("customInit", function (data) {
  // 退货单生单列表--页面初始化
  viewModel.on("beforeBatchpush", function (arges) {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      errorMsg.push("请选择数据");
    }
    for (let i = 0; i < selectData.length; i++) {
      var id = selectData[i].id;
      var code = selectData[i].code;
      var iGsp = selectData[i].extend_gsptype;
      if (iGsp == "1" || iGsp == true || iGsp == "true") {
        promises.push(checkSalesReturn(id, code).then(handerMessage));
      }
    }
    var promise = new cb.promise();
    Promise.all(promises).then(() => {
      if (errorMsg.length > 0) {
        cb.utils.alert(errorMsg, "error");
        return false;
      } else {
        promise.resolve();
      }
    });
    return promise;
  });
  //红字销售出库单
  function checkSalesReturn(id, code) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("aead5997b99a4aa0afa86955115ce273", { id: id, code: code, type: 2 }, function (err, res) {
        let message = "";
        if (err) {
          message += err.message;
        }
        if (res.errInfo && res.errInfo.length > 0) {
          message += res.errInfo;
        }
        resolve(message);
      });
    });
  }
});