viewModel.get("accparameter_1670911362570125321") &&
  viewModel.get("accparameter_1670911362570125321").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        if (data.EndFlag == "1" && data.item31wi == data.AccYear) {
          if (action.cItemName == "button18xg") {
            actionState[action.cItemName] = { visible: true };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
viewModel.get("button18xg") &&
  viewModel.get("button18xg").on("click", function (data) {
    // 反结转--单击
    let AccParameterFk = viewModel.getGridModel().getCellValue(data.index, "AccParameterFk");
    let item31wi = viewModel.getGridModel().getCellValue(data.index, "item31wi");
    let id = viewModel.getGridModel().getCellValue(data.index, "id");
    let newAccYear = parseInt(item31wi) - 1;
    newAccYear = newAccYear.toString();
    cb.rest.invokeFunction("GT104180AT23.AccParameter.fanCheckout", { AccParameterFk: AccParameterFk, AccYear: newAccYear, id: id }, function (err, res) {
      if (err) {
        cb.utils.alert("反结转失败！" + err.message, "error");
      } else {
        viewModel.execute("refresh");
        cb.utils.alert("反结转成功！", "success");
      }
    });
  });