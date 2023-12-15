function initExt(event) {
  var viewModel = this;
  // 卡片态附件改为文件列表形式，只需要修改此参数即可支持浏览态上传文件
  viewModel.getParams().uploadInBrowse = true;
  // 界面状态改变
  viewModel.on("modeChange", function (mode) {
    console.info("%cmodeChange -> ", "background:#EFE4B0;color:red", event);
    if (mode === "add") {
      !initOrgInfoByUser.inited && initOrgInfoByUser.call(null, viewModel);
    } else if (mode === "edit") {
      let id = viewModel.get("id").getValue();
      if (id) {
        let yearlyModel = viewModel.get("yearly");
        yearlyModel.setDisabled(true);
      }
      let gridModel = viewModel.get("sy_businessplanitemList");
      setCellReadOnly(gridModel);
    }
  });
  viewModel.on("afterLoadData", function (event) {
    let currentMode = viewModel.getParams().mode;
    let yearlypickerShow = false;
    console.log("%cViewModel-AfterLoadData%o%o", "color:red", this, event);
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
  viewModel.on("afterRule", function (event) {
    console.log("%cViewModel-AfterRule: %o, %o", "color:green", this, event);
    viewModel.get("btnBizFlowPush").setVisible(false);
  });
  let orgRefModel = viewModel.get("org_id_name");
  orgRefModel.on("afterValueChange", function (event) {
    let refData = event.value || {};
    let purchaseOrg = refData.id;
    let yearlyModel = viewModel.get("yearly");
    let yearly = yearlyModel.getValue();
    if (!purchaseOrg || !yearly) {
      return;
    }
    initGridData(viewModel, purchaseOrg, yearly);
  });
  let yearlyModel = viewModel.get("yearlypicker");
  yearlyModel.on("afterValueChange", function (event) {
    let { value, oldValue } = event;
    let yearly = value ? new Date(value).getFullYear() : null;
    viewModel.get("yearly").setValue(yearly, false);
    let purchaseOrgModel = viewModel.get("org_id");
    let purchaseOrg = purchaseOrgModel.getValue();
    if (!purchaseOrg || !yearly) {
      return;
    }
    initGridData(viewModel, purchaseOrg, yearly);
  });
  viewModel.get("btnSave").on("beforeclick", function (event) {
    let gridModel = viewModel.get("sy_businessplanitemList");
    let rows = gridModel.getRows();
    let emptyRows = [];
    rows.forEach(function (row, index) {
      !row.factoryOrg && emptyRows.push(index);
    });
    gridModel.deleteRows(emptyRows);
  });
  viewModel.get("btnSaveAndAdd").on("beforeclick", function (event) {
    let gridModel = viewModel.get("sy_businessplanitemList");
    let rows = gridModel.getRows();
    let emptyRows = [];
    rows.forEach(function (row, index) {
      !row.factoryOrg && emptyRows.push(index);
    });
    gridModel.deleteRows(emptyRows);
  });
  let gridModel = viewModel.get("sy_businessplanitemList");
  let gridEditRowModel = gridModel.getEditRowModel();
  let materialModel = gridEditRowModel.get("material_code");
  materialModel.on("beforeBrowse", function (event) {
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    var org_id = viewModel.get("org_id").getValue();
    condition.simpleVOs.push({
      field: "productApplyRange.orgId",
      op: "eq",
      value1: org_id
    });
    this.setFilter(condition);
  });
  gridModel.on("beforeCellValueChange", function (event) {
    let { rowIndex, cellName, value, oldValue, childrenField } = event;
    if (cellName === "material_code" || cellName === "factoryOrg_name") {
      return checkRepeat(rowIndex, cellName, value);
    }
    return true;
  });
  gridModel.on("afterCellValueChange", function (event) {
    let { rowIndex, cellName, value, oldValue, childrenField } = event;
    if (cellName === "internalPrice" || cellName === "purchaseNum" || cellName === "purchaseAmount" || cellName === "confirmDate" || cellName === "confirmRatio") {
      bodyCalculator(rowIndex, cellName, value);
    }
    if (cellName !== "approveMemo") {
      gridModel.setCellValue(rowIndex, "isChanged", "Y", false, false);
    }
  });
  gridModel.on("afterStateRuleRunGridActionStates", function (event) {
    let gridModel = this;
    hideGridDelAction(gridModel);
  });
  gridModel.on("beforeInsertRow", function (event) {
    let { row } = event;
    let budgetSign = viewModel.get("budgetSign").getValue();
    let lastBudgetSign = viewModel.get("lastBudgetSign").getValue();
    row.budgetSign = budgetSign;
    row.lastBudgetSign = lastBudgetSign;
  });
  function checkRepeat(rowIndex, cellName, value) {
    // 计算逻辑
    let gridModel = viewModel.get("sy_businessplanitemList");
    let rows = gridModel.getRows();
    let factoryOrg = null,
      material = null;
    if (cellName === "material_code") {
      factoryOrg = gridModel.getCellValue(rowIndex, "factoryOrg");
      material = value.id;
    } else if (cellName === "factoryOrg_name") {
      factoryOrg = value.id;
      material = gridModel.getCellValue(rowIndex, "material");
    }
    let noRepeat = true;
    for (let i = 0; i < rows.length; i++) {
      if (i !== rowIndex && rows[i].factoryOrg === factoryOrg && rows[i].material === material) {
        cb.utils.alert({ type: "error", title: "表体明细数据中已经有相同维度[销售方+商品]的条目！！！" });
        noRepeat = false;
        break;
      }
    }
    return noRepeat;
  }
  function bodyCalculator(rowIndex, cellName, value) {
    // 计算逻辑
    let gridModel = viewModel.get("sy_businessplanitemList");
    if (cellName === "internalPrice") {
      let purchaseNum = gridModel.getCellValue(rowIndex, "purchaseNum");
      let purchaseAmount = value * (purchaseNum || 0);
      gridModel.setCellValue(rowIndex, "purchaseAmount", purchaseAmount, false, false);
    } else if (cellName === "purchaseNum") {
      let internalPrice = gridModel.getCellValue(rowIndex, "internalPrice");
      let purchaseAmount = value * (internalPrice || 0);
      gridModel.setCellValue(rowIndex, "purchaseAmount", purchaseAmount, false, false);
    } else if (cellName === "purchaseAmount") {
      let internalPrice = gridModel.getCellValue(rowIndex, "internalPrice");
      if (internalPrice) {
        let purchaseNum = value / internalPrice;
        gridModel.setCellValue(rowIndex, "purchaseNum", purchaseNum, false, false);
      }
    } else if (cellName === "confirmDate") {
      let confirmDate = new Date(value);
      let month = confirmDate.getMonth();
      let confirmRatio = 12 - month;
      let monthlyRatio = 100 / confirmRatio;
      gridModel.setCellValue(rowIndex, "confirmRatio", confirmRatio, false, false);
      gridModel.setCellValue(rowIndex, "monthlyRatio", monthlyRatio, false, false);
    } else if (cellName === "confirmRatio") {
      let month = 12 - value;
      let yearly = viewModel.get("yearly").getValue();
      let confirmDate = `${yearly}-${month + 1}-01`;
      let monthlyRatio = 100 / value;
      gridModel.setCellValue(rowIndex, "confirmDate", confirmDate, false, false);
      gridModel.setCellValue(rowIndex, "monthlyRatio", monthlyRatio, false, false);
    }
  }
  function initGridData(viewModel, purchaseOrg, yearly) {
    // 查询本组织下需要审批的年度计划-详见#4.后端函数-Api函数：queryBusinessPlan
    cb.rest.invokeFunction("177dafefdad94a5c9cc863e8e186b030", { isFactory: false, orgid: purchaseOrg, yearly: yearly }, function (err, res) {
      console.log("查询本组织下需要审批的年度计划, err: ", err, " data: ", res);
      if (err) {
        cb.utils.alert("查询本组织下需要审批的年度计划出错: " + err);
        return;
      }
      let { annualPlans, isReformulate } = res || {};
      let { budgetSign, lastBudgetSign } = annualPlans.length > 0 ? annualPlans[0] : {};
      viewModel.get("isReformulate").setValue(isReformulate);
      viewModel.get("budgetSign").setValue(budgetSign);
      viewModel.get("lastBudgetSign").setValue(lastBudgetSign);
      let gridModel = viewModel.get("sy_businessplanitemList");
      gridModel.clear();
      gridModel.insertRows(0, annualPlans);
      // 无明细信息的增行按钮不可用
      if (!annualPlans || annualPlans.length <= 0) {
        viewModel.get("btnAddRowsy_businessplanitem").setDisabled(true);
      } else {
        viewModel.get("btnAddRowsy_businessplanitem").setDisabled(false);
      }
      hideGridDelAction(gridModel);
      setCellReadOnly(gridModel);
    });
  }
  function hideGridDelAction(gridModel) {
    //获取列表所有数据
    let rows = gridModel.getRows();
    //从缓存区获取按钮
    let actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach(function (row) {
      const actionState = {};
      actions.forEach(function (action) {
        //设置按钮可用不可用
        if (action.cItemName == "btnDeleteRowsy_businessplanitem" && row.sourcePlan) {
          actionState[action.cItemName] = { visible: false };
        } else {
          actionState[action.cItemName] = { visible: true };
        }
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