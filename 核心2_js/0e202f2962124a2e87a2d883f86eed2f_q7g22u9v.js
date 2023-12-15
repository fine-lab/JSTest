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
        for (var i = 0; i < names.length; i++) {
          if (row.classificationname === names[i]) {
            //设置按钮可用不可用
            if (action.cItemName === "button5kb" || action.cItemName === "btnDelete" || action.cItemName === "btnEdit") {
              actionState[action.cItemName] = { visible: false };
            }
          }
        }
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  }
}