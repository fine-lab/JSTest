viewModel.getGridModel().on("beforeSetActionsState", (actionState) => {
  let gridModel = viewModel.getGridModel();
  //获取列表所有数据
  const rows = gridModel.getRows();
  //从缓存区获取按钮
  const actions = gridModel.getCache("actions");
  if (!actions) return;
  const actionsStates = [];
  rows.forEach((row, i) => {
    let ruleEnable = row.ruleEnable;
    actions.forEach((action) => {
      let cItemName = action.cItemName;
      //设置按钮是否显示
      if (ruleEnable == 1) {
        if (cItemName == "button27df") {
          let btn = actionState[i];
          btn.button27df = { visible: false };
        }
      } else {
        if (cItemName == "button32ih") {
          let btn = actionState[i];
          btn.button32ih = { visible: false };
        }
      }
    });
  });
});
viewModel.get("button27df") &&
  viewModel.get("button27df").on("click", function (data) {
    // 启用规则--单击
    //修改规则为启用
    let gridModel = viewModel.getGridModel();
    //获取列表所有数据
    const rows = gridModel.getRows();
    let row = rows[data.index];
    row.ruleEnable = true;
    //更新数据库
    cb.rest.invokeFunction("GT80750AT4.orderRule.alterRuleStatu", { row }, function (err, res) {
      if (err) {
        cb.utils.alert("更新失败,请重试" + err);
      }
      if (res) {
        viewModel.execute("refresh");
      }
    });
  });
viewModel.get("button32ih") &&
  viewModel.get("button32ih").on("click", function (data) {
    // 禁用规则--单击
    //修改规则为启用
    let gridModel = viewModel.getGridModel();
    //获取列表所有数据
    const rows = gridModel.getRows();
    let row = rows[data.index];
    row.ruleEnable = false;
    //更新数据库
    cb.rest.invokeFunction("GT80750AT4.orderRule.alterRuleStatu", { row }, function (err, res) {
      if (err) {
        cb.utils.alert("更新失败,请重试" + err);
      }
      if (res) {
        viewModel.execute("refresh");
      }
    });
  });