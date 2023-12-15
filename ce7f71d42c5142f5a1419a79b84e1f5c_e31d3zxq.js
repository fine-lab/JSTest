viewModel.on("customInit", function (data) {
  invokeFunction1 = function (id, data, callback, options) {
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
  var gridModel = viewModel.getGridModel(); //获取ListModel
  viewModel.setCache("isSum", true);
  viewModel.on("beforeBatchpush", function (data) {
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    if (data.params.cSvcUrl.indexOf("targetBillNo=41a58682") > 0) {
      var id = [];
      let apiUrl = "GT22176AT10.publicFunction.existChildOrder";
      let errorMsg = "";
      let promises = [];
      let handerMessage = (n) => (errorMsg += n);
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].verifystate != 2) {
          cb.utils.alert("编码为" + selectData[i].code + "单据未审核");
          return false;
        }
        id.push(selectData[i].id); //主表ID
        let request = { id: selectData[i].id, uri: "GT22176AT10.GT22176AT10.SY01_commodity_plan" };
        //判断下游单据是否存在
        promises.push(existChildOrder(apiUrl, request).then(handerMessage));
      }
      let returnPromise = new cb.promise();
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
  function mainProPushCheckList(request) {
    return new Promise(function (resolve) {
      invokeFunction1(
        "GT22176AT10.backDefaultGroup.mainProPushCheckList",
        request,
        function (err, res) {
          let message = "";
          if (res.error_info != undefined) {
            message = res.error_info;
          }
          resolve(message);
        },
        { domainKey: "sy01" }
      );
    });
  }
  gridModel.on("afterSetDataSource", function (data) {
    const rows = gridModel.getRows();
    console.log(rows);
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      console.log(data);
      const actionState = {};
      actions.forEach((action) => {
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data.verifystate == 2 || data.verifystate == "2") {
            actionState[action.cItemName] = { visible: false };
          } else {
            actionState[action.cItemName] = { visible: true };
          }
        } else {
          actionState[action.cItemName] = { visible: true };
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  });
  function existChildOrder(apiUrl, request) {
    return new Promise(function (resolve) {
      invokeFunction1(
        apiUrl,
        request,
        function (err, res) {
          let message = "";
          if (res.Info != undefined) {
            message = res.Info;
          }
          resolve(message);
        },
        { domainKey: "sy01" }
      );
    });
  }
});