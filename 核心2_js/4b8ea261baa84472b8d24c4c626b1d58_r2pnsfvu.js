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
        yearlyModel.setDisabled(true);
      }
      let gridModel = viewModel.get("sy_factoryplanitemList");
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
    let factoryOrg = refData.id;
    let yearlyModel = viewModel.get("yearly");
    let yearly = yearlyModel.getValue();
    initGridData(viewModel, factoryOrg, yearly);
  });
  let yearlyModel = viewModel.get("yearlypicker");
  yearlyModel.on("afterValueChange", function (event) {
    let { value, oldValue } = event;
    let yearly = value ? new Date(value).getFullYear() : null;
    viewModel.get("yearly").setValue(yearly, false);
    let factoryOrgModel = viewModel.get("org_id");
    let factoryOrg = factoryOrgModel.getValue();
    initGridData(viewModel, factoryOrg, yearly);
  });
  let purchaseOrgModel = viewModel.get("purchaseOrg_name");
  purchaseOrgModel.on("afterValueChange", function (event) {
    let { value: refData, oldValue: oldRefData } = event;
    let purchaseOrg = (refData || {}).id;
    let oldOrg = (oldRefData || {}).id;
    let factoryOrgModel = viewModel.get("org_id");
    let factoryOrg = factoryOrgModel.getValue();
    let yearlyModel = viewModel.get("yearly");
    let yearly = yearlyModel.getValue();
    if (!oldOrg && purchaseOrg) {
      // 新选采购方，需要筛选
      filterGridData(viewModel, purchaseOrg);
    } else if (oldOrg && purchaseOrg && oldOrg !== purchaseOrg) {
      // 替换采购方，提示：采购方更改会导致表体明细数据被清空，您所做的修改将不会被保存，是否确定？
      cb.utils.confirm({
        title: "采购方更改会导致表体明细数据被清空，您所做的修改将不会被保存，是否确定？",
        onOk: filterGridData.bind(this, viewModel, purchaseOrg),
        onCancel: resetPurchaseOrg.bind(this, viewModel, oldRefData)
      });
    } else if (oldOrg && !purchaseOrg) {
      // 清空采购方，提示：采购方清空会重置表体明细数据，您所做的修改将不会被保存，是否确定？
      cb.utils.confirm({
        title: "采购方清空会重置表体明细数据，您所做的修改将不会被保存，是否确定？",
        onOk: initGridData.bind(this, viewModel, factoryOrg, yearly),
        onCancel: resetPurchaseOrg.bind(this, viewModel, oldRefData)
      });
    }
  });
  let gridModel = viewModel.get("sy_factoryplanitemList");
  let gridEditRowModel = gridModel.getEditRowModel();
  gridModel.on("afterCellValueChange", function (event) {
    let { rowIndex, cellName, value, oldValue, childrenField } = event;
    if (cellName === "salePrice" || cellName === "saleNum" || cellName === "saleAmount" || cellName === "confirmDate") {
      bodyCalculator(rowIndex, cellName, value);
    }
    if (cellName !== "approveMemo") {
      gridModel.setCellValue(rowIndex, "isChanged", "Y", false, false);
    }
  });
  gridModel.on("beforeInsertRow", function (event) {
    console.log("beforeInsertRow", event);
    let { row } = event;
    if (!row || !row.purchaseOrg || !row.material) {
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
    let gridModel = viewModel.get("sy_factoryplanitemList");
    if (cellName === "salePrice") {
      let saleNum = gridModel.getCellValue(rowIndex, "saleNum");
      let saleAmount = value * saleNum;
      gridModel.setCellValue(rowIndex, "saleAmount", saleAmount, false, false);
    } else if (cellName === "saleNum") {
      let salePrice = gridModel.getCellValue(rowIndex, "salePrice");
      let saleAmount = value * salePrice;
      gridModel.setCellValue(rowIndex, "saleAmount", saleAmount, false, false);
    } else if (cellName === "saleAmount") {
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
  function initGridData(viewModel, factoryOrg, yearly) {
    if (!factoryOrg || !yearly) {
      return;
    }
    // 查询本组织下需要审批的年度计划-详见#4.后端函数-Api函数：queryBusinessPlan
    cb.rest.invokeFunction("1fd4de992e3b4d36ae29ace2602bb4bc", { isFactory: true, orgid: factoryOrg, yearly: yearly }, function (err, res) {
      console.log("查询本组织下需要审批的年度计划: ", err, res);
      let gridModel = viewModel.get("sy_factoryplanitemList");
      gridModel.clear();
      gridModel.insertRows(0, res.annualPlans);
      hideGridDelAction(gridModel);
      setCellReadOnly(gridModel);
    });
  }
  function filterGridData(viewModel, purchaseOrg) {
    let gridModel = viewModel.get("sy_factoryplanitemList");
    let rows = gridModel.getRows();
    if (!rows || rows.length <= 0) {
      return;
    }
    let filterRows = rows.filter(function (row) {
      return row.purchaseOrg === purchaseOrg;
    });
    gridModel.clear();
    gridModel.insertRows(0, filterRows);
    hideGridDelAction(gridModel);
    setCellReadOnly(gridModel);
  }
  function resetPurchaseOrg(viewModel, oldValue) {
    let purchaseOrgName = viewModel.get("purchaseOrg_name");
    purchaseOrgName.setValue([oldValue], false);
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
    const readOnlyFields = ["purchaseOrg_name", "material_name", "material_code", "specs", "approvalUnit", "manufacturer"];
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