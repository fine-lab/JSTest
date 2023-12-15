run = function (event) {
  //采购订单列表页面初始化函数
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  let invokeFunction1 = function (id, data, callback, options) {
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
  gridModel.on("afterSetDataSource", () => {
    let status = gridModel.getEditRowModel().get("status").getValue();
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: true };
        if (action.cCaption == "退货复核" || action.cShowCaption == "入库验收" || action.cShowCaption == "退货复核" || action.cCaption == "入库验收") {
          if (data.status != 1) {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
  viewModel.on("afterMount", function () {
    if (viewModel.get("batchpush14590083-7dd3-11ec-96e4-fa163e3d9426") != undefined) {
      viewModel.get("batchpush14590083-7dd3-11ec-96e4-fa163e3d9426").setVisible(false);
    }
    if (viewModel.get("batchpushf3c65899-7ce8-11ec-96e4-fa163e3d9426") != undefined) {
      viewModel.get("batchpushf3c65899-7ce8-11ec-96e4-fa163e3d9426").setVisible(false);
    }
    if (viewModel.get("batchpush05108d63-a0e4-11ec-9896-6c92bf477043") != undefined) {
      viewModel.get("batchpush05108d63-a0e4-11ec-9896-6c92bf477043").setVisible(false);
    }
  });
  //采购订单列表页下推逻辑
  viewModel.on("beforeBatchpush", function (data) {
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    //判断购进退出复核
    if (data.args.cCaption == "退货复核") {
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderAudit";
      let apiUrl2 = "PU.publicFunction.getBillAndEntry";
      for (let i = 0; i < selectData.length; i++) {
        if (!(selectData[i].state == 1 || selectData[i].verifystate == 2)) {
          errorMsg += selectData[i].code + "未审核,不允许下推\n";
        } else {
          var id = selectData[i].id;
          //判断下游单据是否是已经审核
          let request = { id: id, uri: "GT22176AT10.GT22176AT10.SY01_puroutreviewv2" };
          promises.push(validateLowerState(apiUrl, request).then(handerMessage));
          //判断本单据是否已经下推过(反写字段逻辑)
          let request2 = { id: id, billMetaNo: "pu.purchaseorder.PurchaseOrder", entryMetaNo: "pu.purchaseorder.PurchaseOrders", entryLinkMetaNo: "mainid" };
          promises.push(validateBillsQty(apiUrl2, request2).then(handerMessage));
          //判断自己的每行数据状态
        }
      }
      var returnPromise = new cb.promise();
      Promise.all(promises).then(() => {
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      });
      return returnPromise;
    } else if (data.args.cCaption == "退货入库" || data.args.cCaption == "退库") {
      let apiUrl = "PU.publicFunction.getBillAndEntry";
      for (let i = 0; i < selectData.length; i++) {
        let id = selectData[i].id;
        //判断本单据是否能下推退库单
        let request2 = { id: id, billMetaNo: "pu.purchaseorder.PurchaseOrder", entryMetaNo: "pu.purchaseorder.PurchaseOrders", entryLinkMetaNo: "mainid" };
        promises.push(validate_tk(apiUrl2, request2).then(handerMessage));
        //判断自己的每行数据状态
      }
      var returnPromise = new cb.promise();
      Promise.all(promises).then(() => {
        if (errorMsg.length > 0) {
          cb.utils.alert(errorMsg, "error");
          returnPromise.reject();
        } else {
          returnPromise.resolve();
        }
      });
      return returnPromise;
    }
  });
  viewModel.on("beforeSinglepush", function (data) {
    let returnPromise = new cb.promise();
    try {
      if (data.args.cCaption == "退货入库" || data.args.cCaption == "退库") {
        let errorMsg = "";
        let promises = [];
        let handerMessage = (n) => (errorMsg += n);
        let apiUrl2 = "PU.publicFunction.getBillAndEntry";
        var id = data.params.data[0].id;
        let request2 = { id: id, billMetaNo: "pu.purchaseorder.PurchaseOrder", entryMetaNo: "pu.purchaseorder.PurchaseOrders", entryLinkMetaNo: "mainid" };
        promises.push(validate_tk(apiUrl2, request2).then(handerMessage));
        //判断自己的每行数据状态
        Promise.all(promises).then(() => {
          if (errorMsg.length > 0) {
            cb.utils.alert(errorMsg, "error");
            returnPromise.reject();
          } else {
            returnPromise.resolve();
          }
        });
      }
    } catch (err) {
      cb.utils.alert(err.message, "error");
      returnPromise.reject();
    } finally {
      return returnPromise;
    }
  });
  function validateLowerState(apiUrl, request) {
    return new Promise(function (resolve) {
      invokeFunction1(
        apiUrl,
        request,
        function (err, res) {
          //数量
          let message = "";
          if (typeof res.Info != "undefined") {
            message = res.Info;
          }
          resolve(message);
        },
        { domainKey: "sy01" }
      );
    });
  }
  function validateBillsQty(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          let pushFlag = false;
          for (let i = 0; i < res.entry.length; i++) {
            if (-res.entry[i].qty - res.entry[i].extend_review_qty > 0) {
              pushFlag = true;
            }
          }
          if (pushFlag == false) {
            message += res.code + "无可复核数量";
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
  function validate_tk(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction(apiUrl, request, function (err, res) {
        let message = "";
        if (typeof res !== "undefined") {
          let pushFlag = false;
          for (let i = 0; i < res.entry.length; i++) {
            if (-res.entry[i].qty != res.entry[i].extend_review_qualified_qty + res.entry[i].extend_review_unqualified_qty) {
              errorMsg += res.code + "第" + (i + 1) + "行累计退出复核合格数量+累计退出复核不合格数量!=数量,不允许下推(还有物料没有复核完成)";
            }
            if (res.entry[i].extend_review_qualified_qty - res.entry[i].totalReturnInQty > 0) {
              pushFlag = true;
            }
          }
          if (errorMsg.length == 0 && pushFlag == false) {
            message += res.code + "无可退库数量,已全部退库完成";
          }
        } else if (err !== null) {
          message = err.message;
        }
        resolve(message);
      });
    });
  }
  //采购订单列表页面初始化函数
};