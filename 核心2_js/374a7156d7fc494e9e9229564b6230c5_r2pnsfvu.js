function initExt(event) {
  var viewModel = this;
  const colorLog = function (msg, ...obj) {
    console.log(`%c${msg}: `, "background:#EFE4B0;color:red", obj);
  };
  // 页面初始化后禁用自动查询
  viewModel.getParams().autoLoad = false;
  viewModel.getGridModel().setState("rowKeyField", "id");
  viewModel.setCache("afterBudgetImported", {
    doCreateBudgetVersion: doCreateBudgetVersion.bind(null, viewModel)
  });
  viewModel.on("afterMount", function (event) {
    changeBillComment();
  });
  viewModel.on("beforeSearch", function (event) {
    let { data, params } = event || {};
    if (!data || !params) {
      return false;
    }
    let { commonVOs } = data.condition || [];
    if (!cb.utils.isArray(commonVOs)) {
      return false;
    }
    let importMark = null;
    for (let i = 0; i < commonVOs.length; i++) {
      let filter = commonVOs[i];
      if (filter.itemName === "importMark") {
        importMark = filter.value1;
      }
    }
    return !!importMark;
  });
  viewModel.on("beforeBatchdelete", function (event) {
    let selecedRows = viewModel.getGridModel().getSelectedRows();
    viewModel.getParams().oldCaption = viewModel.getParams().caption;
    viewModel.getParams().caption = ": 已选中" + selecedRows.length + "条";
    return true;
  });
  viewModel.on("afterBatchdelete", function (event) {
    let selecedRows = viewModel.getGridModel().getSelectedRows();
    viewModel.getParams().caption = viewModel.getParams().oldCaption;
    viewModel.getParams().oldCaption = undefined;
    return true;
  });
  viewModel.on("beforeBatchimport", function (event) {
    let beforeBatchimport = viewModel.getCache("beforeBatchimport");
    if (beforeBatchimport) {
      viewModel.setCache("beforeBatchimport", false);
      return beforeBatchimport;
    }
    cb.utils.confirm({
      title: "全部数据导入完成后请务必进行版本化",
      onOk: function (viewModel) {
        viewModel.setCache("beforeBatchimport", true);
        viewModel.get("btnImport").execute("click");
      }.bind(null, viewModel),
      okCancel: false,
      okText: "知道了"
    });
    return false;
  });
  viewModel.get("createVersion").on("click", function (event) {
    viewModel.setCache("budgetGoingDone", "createVersion");
    let data = {
      billtype: "Voucher", // 单据类型
      billno: "bcc5dc10", // 单据号
      params: {
        mode: "add" // (edit编辑态、新增态、browse浏览态)
      }
    };
    viewModel.addListener(viewModel.getCache("afterBudgetImported"));
    cb.loader.runCommandLine("bill", data, viewModel);
  });
  let gridModel = viewModel.getGridModel();
  gridModel.on("beforedblClick", function () {
    return false;
  });
  function doCreateBudgetVersion(viewModel, importInfo) {
    let { importMark, count, groups } = importInfo;
    createBudgetVersion(viewModel, importMark, count, groups);
  }
  function createBudgetVersion(viewModel, importMark, count, groups, index, nextStageCode, err, result) {
    colorLog("createBudgetVersion", { importMark, count, groups, index, nextStageCode }, { err, result });
    if (index === null || index === undefined) {
      index = 0;
    }
    let { successCount, stageCode } = result || {};
    let combinedCount = 0;
    let createdCount = 0;
    if (stageCode === "combinePlanInfo") {
      groups[index - 1].successCount = successCount;
    } else if (stageCode === "createVersion") {
      createdCount = successCount;
    }
    combinedCount = groups.reduce(function (accumulator, currentItem) {
      return accumulator + (currentItem.successCount || 0);
    }, 0);
    let combinePlanTask = { totalCount: count, successCount: combinedCount };
    // 阶段二的任务分配用时暂估为总时间的10%
    let createVersionTask = { totalCount: createdCount || Math.round(count * 0.1), successCount: createdCount };
    const combinePlanTaskParams = {
      asyncData: JSON.stringify(combinePlanTask),
      asyncKey: "yourKeyHere",
      itemsTitle: `任务列表`,
      percentage: Math.round((combinePlanTask.successCount / combinePlanTask.totalCount) * 100),
      busName: "合并计划信息..."
    };
    const createVersionTaskParams = {
      asyncData: JSON.stringify(createVersionTask),
      asyncKey: "yourKeyHere",
      itemsTitle: `任务列表`,
      percentage: Math.round((createVersionTask.successCount / createVersionTask.totalCount) * 100),
      busName: "创建新预算版本..."
    };
    viewModel.communication({
      type: "asyncImport",
      payload: combinePlanTaskParams
    });
    viewModel.communication({
      type: "asyncImport",
      payload: createVersionTaskParams
    });
    if (nextStageCode === "createVersion") {
      doCreateVersion.call(this, viewModel, importMark, count, groups);
    } else if (!nextStageCode || nextStageCode === "combinePlanInfo") {
      doCombinePlanByGroup.call(this, viewModel, importMark, count, groups, index);
    } else if (nextStageCode === "budgetVersionDone") {
      viewModel.communication({ type: "modal", payload: { key: "yourkeyHere", data: { type: 2, res: { count: count, sucessCount: combinedCount, failCount: 0 } } } });
    }
  }
  function doCreateVersion(viewModel, importMark, count, groups) {
    let taskParam = Object.assign({ importMark: importMark, stageCode: "createVersion", count: count });
    cb.rest.invokeFunction("b5a82e7b8cf5416a826513e21cbcb1f2", taskParam, createBudgetVersion.bind(this, viewModel, importMark, count, groups, groups.length + 1, "budgetVersionDone"), {
      mask: false
    });
  }
  function doCombinePlanByGroup(viewModel, importMark, count, groups, index) {
    if (index < groups.length) {
      let group = groups[index];
      let taskParam = Object.assign({ importMark: importMark, stageCode: "combinePlanInfo", count: count }, group);
      cb.rest.invokeFunction("b5a82e7b8cf5416a826513e21cbcb1f2", taskParam, createBudgetVersion.bind(this, viewModel, importMark, count, groups, index + 1, "combinePlanInfo"), { mask: false });
    } else {
      createBudgetVersion.call(this, viewModel, importMark, count, groups, groups.length + 1, "createVersion");
    }
  }
  function changeBillComment() {
    let commentBtn = document.querySelector("[id='youridHere']");
    commentBtn.style.border = "none";
    commentBtn.style.disable = true;
    commentBtn.style["font-weight"] = "bold";
    commentBtn.querySelector("span").style.color = "red";
  }
  function setdebug(debugcode) {
    const d = new Date();
    d.setTime(d.getTime() + 30 * 1000);
    const expires = "; expires=" + d.toUTCString();
    const domain = "diwork.com";
    const domainStr = `; domain=.${domain}`;
    document.cookie = "debugcode=" + debugcode + expires + domainStr + "; path=/";
  }
}