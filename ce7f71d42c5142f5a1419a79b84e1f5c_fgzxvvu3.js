viewModel.on("customInit", function (data) {
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
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].verifystate != 2) {
          cb.utils.alert("编码为" + selectData[i].code + "单据未审核");
          return false;
        }
        id.push(selectData[i].id); //主表ID
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.mainProPushCheckList",
        {
          id: id
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
      return promise;
    }
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