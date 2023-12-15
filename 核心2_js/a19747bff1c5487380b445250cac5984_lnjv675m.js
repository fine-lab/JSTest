viewModel.get("button45yi") &&
  viewModel.get("button45yi").on("click", function (data) {
    // 用户权限管理--单击
    let index = data.index;
    let gridModel = viewModel.getGridModel();
    let rowdata = gridModel.getRow(index);
    let obj = {
      billtype: "Voucher", // 单据类型
      billno: "ybade39d6d", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "edit", // (卡片页面区分编辑态edit、新增态add、)
        sysManagerOrg: rowdata.sysManagerOrg, //TODO:填写详情id
        mobile: rowdata.mobile
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", obj, viewModel);
  });
viewModel.get("button49jh") &&
  viewModel.get("button49jh").on("click", function (data) {
    let index = data.index;
    let GxsStaffFk = viewModel.getGridModel().getCellValue(index, "GxsStaffFk");
    let GxsStaffFkArr = [];
    GxsStaffFkArr.push(GxsStaffFk);
    let obj = {
      billtype: "VoucherList", // 单据类型
      billno: "ybc6d436b3List", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        GxsStaffFkArr: GxsStaffFkArr
      }
    };
    cb.loader.runCommandLine("bill", obj, viewModel);
  });
viewModel.on("afterAudit", (data) => {
  setTimeout(function () {
    viewModel.execute("refresh");
  }, 3000);
});
viewModel.get("gxsorgadmin_2759548655063296") &&
  viewModel.get("gxsorgadmin_2759548655063296").on("afterSetDataSource", function (data) {
    //表格--设置数据源后
    for (let i = 0; i < data.length; i++) {
      let item71lb = data[i].item71lb;
      if (item71lb == "1") {
        viewModel.getGridModel().setRowState(i, "disabled", true);
      }
    }
    let refresh = cb.cache.get("refresh");
    if (refresh == "1") {
      setTimeout(function () {
        viewModel.execute("refresh");
      }, 3000);
      cb.cache.clear("refresh");
    }
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
        //已审核
        if (data.SubmitFlag == 2) {
          if (action.cItemName == "button47kj") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.GxsStaffFk_verifystate == "2") {
          if (action.cItemName == "button49jh") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (data.item69wf == "1") {
          if (action.cItemName == "button45yi") {
            actionState[action.cItemName] = { visible: false };
          }
        }
        if (cb.utils.isEmpty(data.GxsStaffFk_name)) {
          if (action.cItemName !== "btnEdit") {
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