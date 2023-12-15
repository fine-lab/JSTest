viewModel.on("customInit", function (data) {
  // 销售发货列表--页面初始化
  var viewModel = this;
  let gridModel = viewModel.getGridModel();
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
  // 下推出库复核数量校验
  let checkOutStockCheckNum = (id, code) => {
    return new Promise(function (resolve) {
      let msg = "";
      // 校验发货数量-累计复核数量
      cb.rest.invokeFunction("SCMSA.deliveryBackFuncion.pushCheck", { id: id, code: code, type: 2 }, function (err, res) {
        if (err) {
          msg = err.message;
        } else if (res.errInfo && res.errInfo.length > 0) {
          msg = res.errInfo;
        }
        resolve(msg);
      });
    });
  };
  let lowerOrderAudit = (data) => {
    return new Promise(function (resovle) {
      let message = "";
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderAudit",
        data,
        function (err, res) {
          if (err) {
            message = err.message;
          } else if (res.Info && res.Info.length > 0) {
            message = res.Info;
          }
          resovle(message);
        },
        undefined,
        { domainKey: "sy01" }
      );
    });
  };
  viewModel.on("beforeBatchpush", function (args) {
    if (args.args.cCaption.indexOf("出库复核") > -1) {
      var selectData = gridModel.getSelectedRows();
      if (selectData.length < 1) {
        cb.utils.alert("请选择数据", "warning");
        return false;
      }
      let errorMsg = "";
      let handerMessage = (n) => (errorMsg += n);
      let promiseArray = [];
      for (let i = 0; i < selectData.length; i++) {
        let id = selectData[i].id;
        let code = selectData[i].code;
        let extendGspType = selectData[i].extendGspType;
        //判断状态是否符合
        if (selectData[i].statusCode != "DELIVERING") {
          cb.utils.alert("没有符合条件可生单的单据。");
          return false;
        }
        if (extendGspType !== true && extendGspType != "true" && extendGspType != "1") {
          cb.utils.alert("发货单" + code + "非GSP类型，不允许下推出库复核", "error");
          return false;
        }
        //下游出库复核单据未审核，不允许下推
        let data = { id: selectData[i].id, uri: "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6" };
        promiseArray.push(lowerOrderAudit(data).then(handerMessage));
        promiseArray.push(checkOutStockCheckNum(id, code).then(handerMessage));
      }
      let promiseRes = new cb.promise();
      Promise.all(promiseArray).then(() => {
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          promiseRes.reject();
        } else {
          promiseRes.resolve();
        }
      });
      return promiseRes;
    }
  });
  viewModel.on("beforeSinglepush", function (data) {
    let returnPromise = new cb.promise();
    if (data.args.cCaption == "出库复核") {
      let errorMsg = "";
      let handerMessage = (n) => (errorMsg += n);
      let promiseArray = [];
      let id = data.params.data[0].id;
      let code = data.params.data[0].code;
      let extendGspType = data.params.data[0].extendGspType;
      //判断状态是否符合
      if (data.params.data[0].statusCode != "DELIVERING") {
        cb.utils.alert("没有符合条件可生单的单据。");
        return false;
      }
      //下游出库复核单据未审核，不允许下推
      let pushData = { id: id, uri: "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6" };
      promiseArray.push(lowerOrderAudit(pushData).then(handerMessage));
      promiseArray.push(checkOutStockCheckNum(id, code).then(handerMessage));
      let promiseRes = new cb.promise();
      Promise.all(promiseArray).then(() => {
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          promiseRes.reject();
        } else {
          promiseRes.resolve();
        }
      });
      return promiseRes;
    }
  });
  //下推出库校验
  viewModel.on("beforeBatchPush", function (args) {
    if (args.args.cItemName == "btnbatchPush") {
      var selectData = gridModel.getSelectedRows();
      if (selectData.length < 1) {
        cb.utils.alert("请选择数据", "warning");
        return false;
      }
      for (let i = 0; i < selectData.length; i++) {
        var id = selectData[i].id;
        var code = selectData[i].code;
        let extendGspType = selectData[i].extendGspType;
        if (extendGspType === true || extendGspType == "true" || extendGspType == "1") {
          var returnPromise = new cb.promise();
          //如果开启GSP类型，检查累计复核数量是否等于主计量数量，如果不等于则下推出库报错，提示需要进行出库复核。
          cb.rest.invokeFunction("SCMSA.deliveryBackFuncion.pushCheck", { id: id, code: code, type: 1 }, function (err, res) {
            if (err) {
              cb.utils.alert(err.message, "error");
              return false;
            }
            if (res.errInfo && res.errInfo.length > 0) {
              cb.utils.alert(res.errInfo, "error");
              return false;
            }
            returnPromise.resolve();
          });
          return returnPromise;
        }
      }
    }
  });
  //弃审校验 batchunaudit
  viewModel.on("beforeBatchunaudit", function (args) {
    var selectData = gridModel.getSelectedRows();
    for (let i = 0; i < selectData.length; i++) {
      let extendGspType = selectData[i].extendGspType;
      if (extendGspType === true || extendGspType == "true" || extendGspType == "1") {
        var returnPromise = new cb.promise();
        let data = { id: selectData[i].id, uri: "GT22176AT10.GT22176AT10.sy01_saleoutstofhv6" };
        //判断是否有下游单据
        cb.rest.invokeFunction1(
          "GT22176AT10.publicFunction.checkChildOrderUnAud",
          data,
          function (err, res) {
            if (err) {
              cb.utils.alert(selectData[i].code + err.message, "error");
              return false;
            }
            if (res.Info && res.Info.length > 0) {
              cb.utils.alert(selectData[i].code + res.Info, "error");
              return false;
            }
            returnPromise.resolve();
          },
          undefined,
          { domainKey: "sy01" }
        );
        return returnPromise;
      }
    }
  });
  viewModel.on("afterMount", function () {
    let listGridModel = viewModel.getGridModel("voucher_deliverylist");
    debugger;
    //根据审核状态控制按钮显示
    listGridModel.on("afterSetDataSource", function (data) {
      //获取行数据集合
      const rows = listGridModel.getRows();
    });
  });
});