viewModel.on("customInit", function (data) {
  // 退货单列表--页面初始化
  var viewModel = this;
  const m_gspTransation = "GSP销售退货";
  cb.rest.invokeFunction1 = function (id, data, callback, viewModel, options) {
    var proxy = cb.rest.DynamicProxy.create({
      doProxy: {
        url: "/web/function/invoke/" + id,
        method: "POST",
        options: options
      }
    });
    if (options.async == false) {
      return proxy.doProxy(data, callback);
    } else {
      proxy.doProxy(data, callback);
    }
  };
  viewModel.on("beforeEdit", function (args) {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var promise = new cb.promise();
    var data = args.carry.rowData;
    if (data == null) return false;
    var id = data.id;
    promises.push(checkChildOrderUnAudit(id, "GT22176AT10.GT22176AT10.sy01_gspsalereturn").then(handerMessage));
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
  viewModel.on("beforeBatchdo", function (args) {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var promise = new cb.promise();
    var data = JSON.parse(args.data.data);
    if (data == null) return false;
    if (args.params.cCommand == "cmdBatchUnApprove") {
      var id = data[0].id;
      var code = data[0].code;
      promises.push(checkChildOrderUnAudit(id, "GT22176AT10.GT22176AT10.sy01_gspsalereturn").then(handerMessage));
      Promise.all(promises).then(() => {
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          return false;
        } else {
          promise.resolve();
        }
      });
    } else {
      return true;
    }
    return promise;
  });
  viewModel.on("beforeBatchpush", function (args) {
    debugger;
    let errorMsg = "";
    const promises = [];
    let handerMessage = (n) => (errorMsg += n);
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      errorMsg.push("请选择数据");
    }
    if (args.args.cCaption == "退回验收") {
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        var code = selectData[i].code;
        var iGsp = selectData[i].extend_gsptype;
        var transactionTypeId_name = selectData[i].transactionTypeId_name;
        if (iGsp == "1" || iGsp == true || iGsp == "true") {
          if (transactionTypeId_name != m_gspTransation) {
            errorMsg.push("GSP类型开启时，交易类型必须为【GSP销售退货】");
          }
          promises.push(checkChildOrderAudit(id, "GT22176AT10.GT22176AT10.sy01_gspsalereturn").then(handerMessage));
          promises.push(checkqty(id, code).then(handerMessage));
        }
      }
    }
    //红字销售出库单
    if (args.args.cItemName == "btnSalesReturnPush") {
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        var code = selectData[i].code;
        var iGsp = selectData[i].extend_gsptype;
        if (iGsp == "1" || iGsp == true || iGsp == "true") {
          promises.push(checkSalesReturn(id, code).then(handerMessage));
        }
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
  viewModel.on("afterLoadData", function () {
    if (viewModel.get("bizflowpush008ee5d3-8a41-11ec-96e4-fa163e3d9426")) {
      viewModel.get("bizflowpush008ee5d3-8a41-11ec-96e4-fa163e3d9426").setVisible(false);
    }
  });
  function checkChildOrderUnAudit(id, uri) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderUnAud",
        { id: id, uri: uri },
        function (err, res) {
          let message = "";
          if (err) {
            message += err.message;
          }
          if (res.Info && res.Info.length > 0) {
            message += res.Info;
          }
          resolve(message);
        },
        undefined,
        { domainKey: "sy01" }
      );
    });
  }
  function checkChildOrderAudit(id, uri) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderAudit",
        { id: id, uri: uri },
        function (err, res) {
          let message = "";
          if (err) {
            message += err.message;
          }
          if (res.Info && res.Info.length > 0) {
            message += res.Info;
          }
          resolve(message);
        },
        undefined,
        { domainKey: "sy01" }
      );
    });
  }
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
  function checkqty(id, code) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction("aead5997b99a4aa0afa86955115ce273", { id: id, code: code, type: 1 }, function (err, res) {
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