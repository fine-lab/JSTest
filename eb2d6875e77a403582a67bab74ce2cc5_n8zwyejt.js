viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", function (data) {
    if (viewModel.get("button19jh") != undefined) {
      viewModel.get("button19jh").setVisible(true);
    }
    const rows = gridModel.getRows();
    //获取动作集合
    const actions = gridModel.getCache("actions");
    const actionsStates = [];
    //动态处理每行动作按钮展示情况
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        if (action.cItemName == "btnEdit" || action.cItemName == "btnDelete") {
          if (data.verifystate == 2 || data.verifystate == 1) {
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
  viewModel.get("button19jh").on("click", function (data) {
    let selectData = gridModel.getSelectedRows();
    if (selectData.length < 1) {
      errorMsg.push("请选择数据");
    }
    for (let i = 0; i < selectData.length; i++) {
      let id = selectData[i].id;
      batchAudit(id).then(
        (res) => {
          cb.utils.alert(res);
        },
        (err) => {
          cb.utils.alert(err, "error");
        }
      );
    }
  });
  let batchAudit = function (id) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.publicFunction.batchAuditSyKh", { id: id }, function (err, res) {
        if (res != undefined) {
          resolve("成功");
        } else if (err !== null) {
          reject(JSON.stringify(err));
        }
      });
    });
  };
});