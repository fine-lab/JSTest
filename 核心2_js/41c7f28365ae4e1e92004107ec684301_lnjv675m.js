viewModel.on("customInit", function (data) {
  //供销云老邻居部门管理--页面初始化
  let gridModel = viewModel.getGridModel();
  // 启用按钮
  let enablebtn = "btnUnstop";
  // 停用按钮
  let stopbtn = "btnStop";
  // 编辑按钮
  let editbtn = "btnEdit";
  // 授权按钮
  let authbtn = "button19ah";
  // 删除按钮
  let delbtn = "btnDelete";
  // 判断启用字段编码
  let enablecode = "enable";
  // 删除标志编码
  let delcode = "userdel";
  // 审核按钮
  let audit = "button28ki";
  // 弃审按钮
  let test = "button36xj";
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: false };
        if (data.enable === 1 && data.verifystate == 2) {
          if (action.cItemName === enablebtn) {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName === stopbtn) {
            actionState[action.cItemName] = { visible: true };
          }
        } else if (data.enable === 0 && data.verifystate == 2) {
          if (action.cItemName === enablebtn) {
            actionState[action.cItemName] = { visible: true };
          }
          if (action.cItemName === stopbtn) {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (!!data.sysDept) {
          if (action.cItemName === delbtn) {
            actionState[action.cItemName] = { visible: false };
          }
        } else if (data.verifystate === 0 && !data.sysDept) {
          if (action.cItemName === delbtn) {
            actionState[action.cItemName] = { visible: true };
          }
        }
        if (action.cItemName === editbtn) {
          actionState[action.cItemName] = { visible: true };
        }
        if (data.verifystate !== 2) {
          if (action.cItemName === audit) {
            actionState[action.cItemName] = { visible: true };
          }
        }
        if (action.cItemName === test) {
          if (data.verifystate === 2) {
            actionState[action.cItemName] = { visible: true };
          } else {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 100);
  });
});