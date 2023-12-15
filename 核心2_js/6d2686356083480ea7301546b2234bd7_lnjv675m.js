viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  // 启用按钮
  let enablebtn = "button11xg";
  // 停用按钮
  let stopbtn = "button9bf";
  // 编辑按钮
  let editbtn = "btnEdit";
  // 授权按钮
  // 删除按钮
  let delbtn = "button18af";
  // 判断启用字段编码
  let enablecode = "enable";
  // 删除标志编码
  // 审核按钮
  let audit = "button14sj";
  // 弃审按钮
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
        // 启用停用按钮控制
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
        // 删除按钮控制
        if (!!data.sysOrg) {
          if (action.cItemName === delbtn) {
            actionState[action.cItemName] = { visible: false };
          }
        } else if (data.verifystate === 0 && !data.sysOrg) {
          if (action.cItemName === delbtn) {
            actionState[action.cItemName] = { visible: true };
          }
        }
        // 编辑按钮控制
        if (action.cItemName === editbtn) {
          actionState[action.cItemName] = { visible: true };
        }
        // 审核按钮控制
        if (data.verifystate !== 2) {
          if (action.cItemName === audit) {
            actionState[action.cItemName] = { visible: true };
          }
        }
        // 弃审按钮控制
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 100);
  });
});