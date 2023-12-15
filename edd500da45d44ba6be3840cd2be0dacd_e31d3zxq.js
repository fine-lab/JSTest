viewModel.on("customInit", function (data) {
  // 调出单列表--页面初始化
  return;
  viewModel.on("beforeSinglepush", function (data) {
    return;
    let returnPromise = new cb.promise();
    try {
      if (data.args.cCaption == "入库") {
        let errorMsg = "";
        let promises = [];
        //必须要有对应的复核单，才能下推入库
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
  //到货单列表页下推逻辑
  viewModel.on("beforeBatchpush", function (data) {
    debugger;
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    if (data.args.cCaption == "出库复核") {
      let apiUrl = "GT22176AT10.publicFunction.checkChildOrderUnAud";
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].status != 1) {
          errorMsg += selectData[i].code + "未审核,不允许下推\n";
          cb.utils.alert(errorMsg);
          return false;
        } else {
          //判断下游单据状态
          var id = selectData[i].id;
          promises.push(unauditValidate(id, "GT22176AT10.GT22176AT10.SY01_purinstockysv2").then(handerMessage));
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
  //到货单列表页反审核逻辑
  viewModel.on("beforeBatchunaudit", function (data) {
    var gridModel = viewModel.getGridModel();
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    let errorMsg = "";
    let promises = [];
    let handerMessage = (n) => (errorMsg += n);
    for (let i = 0; i < selectData.length; i++) {
      promises.push(unauditValidate(selectData[i].id, "GT22176AT10.GT22176AT10.SY01_purinstockysv2").then(handerMessage));
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
  });
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
  let unauditValidate = function (id, uri) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "GT22176AT10.publicFunction.checkChildOrderUnAud",
        { id: id, uri: uri },
        function (err, res) {
          if (err) {
            resolve("checkChildOrderUnAud方法报错");
          }
          if (res) {
            resolve(res.Info == undefined ? "" : res.info);
          } else {
            resolve("");
          }
        },
        { domainKey: "sy01" }
      );
    });
  };
});