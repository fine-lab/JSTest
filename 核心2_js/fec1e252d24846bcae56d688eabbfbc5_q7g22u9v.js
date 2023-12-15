function init(event) {
  var viewModel = this;
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", function (event) {
    let gridModel = this;
    let names = [];
    for (var i = 0; i < event.length; i++) {
      let name = event[i].categoryparent_classificationname;
      if (typeof name != "undefined") {
        names.push(name);
      } else {
        continue;
      }
    }
    classificationButtonControl(gridModel, names);
    EnableStatusRule(gridModel);
    let a = 1;
  });
  //根据name设置行内按钮不可用
  function classificationButtonControl(gridModel, names) {
    var rows = gridModel.getRows();
    var actions = gridModel.getCache("actions");
    if (!actions) return;
    var actionsStates = [];
    rows.forEach(function (row) {
      const actionState = {};
      actions.forEach(function (action) {
        actionState[action.cItemName] = { visible: true };
        if (row.enable === 1 && action.cItemName === "btnUnstop") {
          actionState[action.cItemName] = { visible: false };
        } else if (row.enable === 0 && action.cItemName === "btnStop") {
          actionState[action.cItemName] = { visible: false };
        }
        for (var i = 0; i < names.length; i++) {
          if (row.classificationname === names[i]) {
            //设置按钮可用不可用
            if (action.cItemName === "button69299311447vb" || action.cItemName === "btnDelete" || action.cItemName === "btnEdit") {
              actionState[action.cItemName] = { visible: false };
            }
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  }
  //父类启用状态带入到子类
  function EnableStatusRule(gridModel) {
    var rows = gridModel.getRows();
    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < rows.length; j++) {
        if (rows[i].classificationname === rows[j].categoryparent_classificationname) {
          rows[j].enable == rows[i].enable;
          var parentRow = rows[i].enable;
          var sonRow = rows[j].enable;
          console.log("parentRow:" + parentRow + "," + "sonRow:" + sonRow);
        }
      }
    }
  }
}