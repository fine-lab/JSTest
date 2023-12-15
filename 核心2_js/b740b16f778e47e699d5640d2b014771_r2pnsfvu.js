function initExt(event) {
  var viewModel = this;
  // 卡片态附件改为文件列表形式，只需要修改此参数即可支持浏览态上传文件
  viewModel.getParams().uploadInBrowse = true;
  // 界面状态改变
  viewModel.on("modeChange", function (mode) {
    if (mode === "add") {
      !initOrgInfoByUser.inited && initOrgInfoByUser.call(null, viewModel);
    } else if (mode === "edit") {
      let id = viewModel.get("id").getValue();
      if (id) {
        let yearlyModel = viewModel.get("yearly");
        let monthlyModel = viewModel.get("monthly");
        yearlyModel.setDisabled(true);
        monthlyModel.setDisabled(true);
      }
      let gridModel = viewModel.get("sy_busiorderitemList");
      setCellReadOnly(gridModel);
    }
  });
  viewModel.on("afterLoadData", function (event) {
    let currentMode = viewModel.getParams().mode;
    let yearlypickerShow = false;
    if (currentMode === "browse") {
      let id = viewModel.get("id").getValue();
      let verifystate = viewModel.get("verifystate").getValue();
      // 浏览态，审批过程中的单据不允许修改
      // 隐藏复制、下推按钮
      viewModel.get("btnCopy").setVisible(false);
      viewModel.get("btnBizFlowPush").setVisible(false);
    } else if (currentMode === "add") {
      yearlypickerShow = true;
    }
    viewModel.get("yearlypicker").setVisible(yearlypickerShow);
    viewModel.get("yearly").setVisible(!yearlypickerShow);
  });
  let orgRefModel = viewModel.get("org_id_name");
  orgRefModel.on("afterValueChange", function (event) {
    let refData = event.value || {};
    let purchaseOrg = refData.id;
    let yearlyModel = viewModel.get("yearly");
    let monthlyModel = viewModel.get("monthly");
    let yearly = yearlyModel.getValue();
    let monthly = monthlyModel.getValue();
    initGridData(viewModel, purchaseOrg, yearly, monthly);
  });
  let yearlyModel = viewModel.get("yearlypicker");
  yearlyModel.on("afterValueChange", function (event) {
    let { value, oldValue } = event;
    let yearly = value ? new Date(value).getFullYear() : null;
    viewModel.get("yearly").setValue(yearly, false);
    let purchaseOrgModel = viewModel.get("org_id");
    let monthlyModel = viewModel.get("monthly");
    let purchaseOrg = purchaseOrgModel.getValue();
    let monthly = monthlyModel.getValue();
    initGridData(viewModel, purchaseOrg, yearly, monthly);
  });
  let monthlyModel = viewModel.get("monthly");
  monthlyModel.on("afterValueChange", function (event) {
    let monthlyEnum = event.value || {};
    let monthly = monthlyEnum.value;
    let purchaseOrgModel = viewModel.get("org_id");
    let yearlyModel = viewModel.get("yearly");
    let purchaseOrg = purchaseOrgModel.getValue();
    let yearly = yearlyModel.getValue();
    initGridData(viewModel, purchaseOrg, yearly, monthly);
  });
  let gridModel = viewModel.get("sy_busiorderitemList");
  let gridEditRowModel = gridModel.getEditRowModel();
  gridModel.on("afterCellValueChange", function (event) {
    let { rowIndex, cellName, value, oldValue, childrenField } = event;
    if (cellName === "purchaseNum" || cellName === "purchaseAmount" || cellName === "nextMonthNum" || cellName === "nextMonthAmount" || cellName === "manxNum" || cellName === "manxAmount") {
      bodyCalculator(rowIndex, cellName, value);
    }
    if (cellName !== "approveMemo") {
      gridModel.setCellValue(rowIndex, "isChanged", "Y", false, false);
    }
  });
  gridModel.on("beforeInsertRow", function (event) {
    console.log("beforeInsertRow", event);
    let { row } = event;
    if (!row || !row.factoryOrg || !row.material) {
      return false;
    }
    return true;
  });
  gridModel.on("afterStateRuleRunGridActionStates", function (event) {
    let gridModel = this;
    hideGridDelAction(gridModel);
  });
  function bodyCalculator(rowIndex, cellName, value) {
    // 计算逻辑
    let gridModel = viewModel.get("sy_busiorderitemList");
    let internalPrice = gridModel.getCellValue(rowIndex, "internalPrice");
    if (cellName === "purchaseNum") {
      let purchaseAmount = value * (internalPrice || 0);
      gridModel.setCellValue(rowIndex, "purchaseAmount", purchaseAmount, false, false);
    } else if (cellName === "purchaseAmount") {
      if (internalPrice) {
        let purchaseNum = value / internalPrice;
        gridModel.setCellValue(rowIndex, "purchaseNum", purchaseNum, false, false);
      }
    } else if (cellName === "nextMonthNum") {
      let nextMonthAmount = value * (internalPrice || 0);
      gridModel.setCellValue(rowIndex, "nextMonthAmount", nextMonthAmount, false, false);
    } else if (cellName === "nextMonthAmount") {
      if (internalPrice) {
        let nextMonthNum = value / internalPrice;
        gridModel.setCellValue(rowIndex, "nextMonthNum", nextMonthNum, false, false);
      }
    } else if (cellName === "manxNum") {
      let manxAmount = value * (internalPrice || 0);
      gridModel.setCellValue(rowIndex, "manxAmount", manxAmount, false, false);
    } else if (cellName === "manxAmount") {
      if (internalPrice) {
        let manxNum = value / internalPrice;
        gridModel.setCellValue(rowIndex, "manxNum", manxNum, false, false);
      }
    }
  }
  function initGridData(viewModel, purchaseOrg, yearly, monthly) {
    if (!purchaseOrg || !yearly || !monthly) {
      return;
    }
    // 查询本组织下需要审批的年度计划-详见#4.后端函数-Api函数：queryBusinessPlan
    cb.rest.invokeFunction("47a2c21df7254c8888e9f01b3a1a339f", { orgid: purchaseOrg, yearly: yearly, monthly: monthly }, function (err, res) {
      console.log("查询本组织下需要审批的月度计划, err: ", err, " data: ", res);
      if (err) {
        cb.utils.alert("查询本组织下需要审批的月度计划出错: " + err);
        return;
      }
      let { monthlyPlans } = res || {};
      let gridModel = viewModel.get("sy_busiorderitemList");
      gridModel.clear();
      gridModel.insertRows(0, monthlyPlans);
      hideGridDelAction(gridModel);
      setCellReadOnly(gridModel);
    });
  }
  function hideGridDelAction(gridModel) {
    //获取列表所有数据
    let rows = gridModel.getRows();
    //从缓存区获取按钮
    let actions = gridModel.getCache("actions");
    if (!actions) {
      return;
    }
    const actionsStates = [];
    rows.forEach(function (row) {
      const actionState = {};
      actions.forEach(function (action) {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: false };
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
  }
  function setCellReadOnly(gridModel) {
    //获取列表所有数据
    let rows = gridModel.getRows();
    if (!rows || rows.length <= 0) {
      return;
    }
    const readOnlyFields = ["factoryOrg_name", "material_name", "material_code", "specs", "approvalUnit", "manufacturer"];
    let len = rows.length;
    const cellStates = [];
    for (let i = 0; i < len; i++) {
      for (let field of readOnlyFields) {
        cellStates.push({ rowIndex: i, cellName: field, propertyName: "readOnly", value: true });
      }
    }
    gridModel.setCellStates(cellStates);
  }
  function initOrgInfoByUser(viewModel) {
    initOrgInfoByUser.inited = true;
    cb.rest.invokeFunction("bad326b458f54d31ab2594eb36f61e7b", {}, function (err, res) {
      let { userInfo } = res;
      if (!userInfo || !userInfo.orgId) {
        cb.utils.alert({ type: "error", title: "获取用户及其组织信息失败！！！" });
      } else {
        viewModel.get("org_id_name").setValue([{ id: userInfo.orgId, name: userInfo.orgName }], true);
      }
    });
  }
  function initBillAttachment(viewModel) {
    let billAttachment = viewModel.get("billAttachment").getValue();
    if (!billAttachment && !initBillAttachment.init) {
      initBillAttachment.init = true;
      viewModel.get("billAttachment").doPropertyChange("onChange", null, null);
      initBillAttachment.init = false;
    }
  }
}