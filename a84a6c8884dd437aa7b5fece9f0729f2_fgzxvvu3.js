viewModel.on("customInit", function (data) {
  debugger;
  var gridModel = viewModel.getGridModel();
  viewModel.on("beforeBatchpush", function (data) {
    var selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      cb.utils.alert("请选择数据", "warning");
      return false;
    }
    //下推质量复查单
    if (data.params.cSvcUrl.indexOf("targetBillNo=fb4f91ab") > 0) {
      let id = [];
      let verifystate = {};
      let verifystateArr = [];
      for (let i = 0; i < selectData.length; i++) {
        id.push(selectData[i].id); //主表ID
        verifystate[selectData[i].id] = selectData[i].verifystate;
        verifystateArr.push(verifystate);
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.housePushReviewList",
        {
          id: id,
          verifystateArr: verifystateArr
        },
        function (err, res) {
          if (typeof res != "undefined") {
            if (res.error_info.length > 0) {
              cb.utils.alert(res.error_info);
              promise.reject();
            }
            promise.resolve();
          } else if (err !== null) {
            cb.utils.alert(err);
            promise.reject();
          }
        }
      );
    }
    //下推不合格登记单
    else if (data.params.cSvcUrl.indexOf("targetBillNo=3837a6e9") > 0) {
      let id = [];
      let verifystate = {};
      let verifystateArr = [];
      for (let i = 0; i < selectData.length; i++) {
        id.push(selectData[i].id); //主表ID
        verifystate[selectData[i].id] = selectData[i].verifystate;
        verifystateArr.push(verifystate);
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.housePushUnqualList",
        {
          id: id,
          verifystateArr: verifystateArr
        },
        function (err, res) {
          if (typeof res != "undefined") {
            if (res.error_info.length > 0) {
              cb.utils.alert(res.error_info);
              promise.reject();
            }
            promise.resolve();
          } else if (err !== null) {
            cb.utils.alert(err);
            promise.reject();
          }
        }
      );
    }
    return promise;
  });
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
});