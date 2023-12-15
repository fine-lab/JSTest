viewModel.get("gxsstaff_2752356215279872") &&
  viewModel.get("gxsstaff_2752356215279872").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let gridModel = viewModel.getGridModel();
    const rows = gridModel.getRows();
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const actionState = {};
      actions.forEach((action) => {
        actionState[action.cItemName] = { visible: true };
        if (data.verifystate == 0) {
          if (action.cItemName == "button15zh") {
            actionState[action.cItemName] = { visible: false };
          }
        } else if (data.verifystate == 2) {
          //新按钮
          if (action.cItemName == "button26ob") {
            actionState[action.cItemName] = { visible: false };
          }
          //目前我感觉不需要弃审按钮
          if (action.cItemName == "button15zh") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.enable == 0) {
          if (action.cItemName == "button16eh") {
            actionState[action.cItemName] = { visible: false };
          }
        } else if (data.enable == 1) {
          if (action.cItemName == "button20ed") {
            actionState[action.cItemName] = { visible: false };
          }
          if (action.cItemName == "button25uh") {
            actionState[action.cItemName] = { visible: false };
          }
        }
      });
      actionsStates.push(actionState);
    });
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
viewModel.get("button25uh") &&
  viewModel.get("button25uh").on("click", function (data) {
    //删除--单击
    console.log("data", JSON.stringify(data));
    let index = data.index;
    let rowData = viewModel.getGridModel().getRow(index);
    let enable = rowData.enable;
    if (enable == 1) {
      cb.utils.alert("请先停用员工！", "info");
    } else if (enable == 0) {
      cb.rest.invokeFunction("GT34544AT7.GxsStaff.userDeleteStaff", { id: rowData.id }, function (err, res) {
        if (err) {
          cb.utils.alert("删除失败！\n" + err.message, "error");
        }
        if (res) {
          cb.utils.alert("删除成功！", "info");
        }
      });
    }
  });
//停用后修改员工主表相关标识
viewModel.on("afterClose", function (args) {
  if (args.err == null) {
    let id = args.res.id;
    cb.rest.invokeFunction("GT34544AT7.GxsStaff.afterClose", { id: id }, function (err, res) {
      if (err) {
        cb.utils.alert(JSON.stringify(err), "error");
      }
    });
  }
});
viewModel.get("button26ob") &&
  viewModel.get("button26ob").on("click", function (data) {
    //审核--单击
    //选中要审核的行
    let index = data.index;
    let indexs = [];
    indexs.push(index);
    viewModel.getGridModel().unselectAll();
    viewModel.getGridModel().select(indexs);
    let ownStaff = viewModel.getGridModel().getRow(index);
    let bizFlowId = ownStaff.bizFlowId;
    if (bizFlowId) {
      //审核前删除该数据的业务流ID
      let result = cb.rest.invokeFunction("GT34544AT7.GxsStaff.deleteBizFlowId", { id: ownStaff.id, bizFlowId: bizFlowId }, function (err, res) {}, viewModel, { async: false });
      let res = result.result.res;
      if (res.copyBizFlowId) {
        //删除业务流ID后执行审核操作
        // 获取查询区模型
        let filterViewModelInfo = viewModel.getCache("FilterViewModel");
        //获取搜索模型后，使用fireEvent方法触发搜索模型上的点击事件
        filterViewModelInfo.get("search").fireEvent("click");
        setTimeout(function () {
          viewModel.getGridModel().select(indexs);
          viewModel.get("button28of").execute("click");
        }, 500);
      }
    } else {
      viewModel.get("button28of").execute("click");
    }
  });