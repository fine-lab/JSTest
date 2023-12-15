run = function (event) {
  //采购订单列表页面初始化函数
  var viewModel = this;
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
    var gridModel = viewModel.getGridModel();
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
    }
  });
  function validateLowerState(apiUrl, request) {
    return new Promise(function (resolve) {
      cb.rest.invokeFunction1(
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
  cb.rest.invokeFunction1 = function (id, data, callback, options) {
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
  //采购订单列表页面初始化函数
};