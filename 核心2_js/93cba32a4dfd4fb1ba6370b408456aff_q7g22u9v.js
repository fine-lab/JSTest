function init(event) {
  var viewModel = this;
  viewModel.get("button6012jd").on("click", function (event) {
    let FilterViewModel = viewModel.getCache("FilterViewModel");
    let parentViewModel = FilterViewModel.getCache("parentViewModel");
    let parentRows = parentViewModel.getGridModel().getRows();
    //新建子类所在的父类名字
    let name = parentRows[event.index].name;
    let data = {
      billtype: "Voucher", // 单据类型
      billno: "8d43c614", // 单据号
      params: {
        mode: "add", // (edit编辑态、新增态、browse浏览态)
        selectRows: name
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
  });
  var gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", function (event) {
    let gridModel = this;
    let names = [];
    for (var i = 0; i < event.length; i++) {
      let name = event[i].parent_name;
      if (typeof name != "undefined") {
        names.push(name);
      } else {
        continue;
      }
    }
    classificationButtonControl(gridModel, names);
    EnableStatusRule(gridModel);
  });
  gridModel.on("BeforeCellValueChange", function (event) {
    let gridModel = this;
    EnableStatusRule(gridModel);
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
        //停用启用按钮根据状态隐藏
        if (row.enable === 1 && action.cItemName === "btnUnstop") {
          actionState[action.cItemName] = { visible: false };
        } else if (row.enable === 0 && action.cItemName === "btnStop") {
          actionState[action.cItemName] = { visible: false };
        }
        for (var i = 0; i < names.length; i++) {
          if (row.name === names[i]) {
            //设置按钮可用不可用
            if (action.cItemName === "button6012jd" || action.cItemName === "btnDelete" || action.cItemName === "btnEdit") {
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
        var num = 0;
        if (rows[i].name === rows[j].parent_name) {
          gridModel.setCellValue(j, "enable", rows[i].enable);
        }
      }
    }
  }
}