viewModel.on("customInit", function (data) {
  // 拉单预订单--页面初始化
  console.log("传入参数！！！！！！");
  console.log(data);
  var gridModel = viewModel.getGridModel();
  var modelinfo = viewModel.getParams();
  console.log(modelinfo.action);
  if (Object.prototype.toString.call(modelinfo) === "[object Object]") {
    if (modelinfo.action === "pull") {
      console.log("进入pull！！！！！！");
      viewModel.get("btnAdd").setVisible(false);
      viewModel.get("btnBatchSubmitDrop").setVisible(false);
      viewModel.get("btnBatchSubmit").setVisible(false);
      viewModel.get("btnBatchUnSubmit").setVisible(false);
      viewModel.get("btnBizFlowBatchPush").setVisible(false);
      viewModel.get("btnImportDrop").setVisible(false);
      viewModel.get("btnImport").setVisible(false);
      viewModel.get("btnTempexport").setVisible(false);
      viewModel.get("btnExportDrop").setVisible(false);
      viewModel.get("btnExport").setVisible(false);
      viewModel.get("btnExportDetail").setVisible(false);
      viewModel.get("btnBatchDelete").setVisible(false);
      viewModel.get("btnPrintDrop").setVisible(false);
      viewModel.get("btnBatchPrintnow").setVisible(false);
      viewModel.get("btnDownloadDrop").setVisible(false);
      viewModel.get("btnDownloadAttachment").setVisible(false);
      var gridModel = viewModel.getGridModel();
      gridModel.on("afterSetDataSource", () => {
        const rows = gridModel.getRows();
        const actions = gridModel.getCache("actions");
        const actionsStates = [];
        rows.forEach((data) => {
          const actionState = {};
          actions.forEach((action) => {
            actionState[action.cItemName] = { visible: true, disabled: true };
            actionState["btnCopy"] = { visible: false };
            actionState["btnEdit"] = { visible: false };
            actionState["btnDelete"] = { visible: false };
          });
          actionsStates.push(actionState);
        });
        gridModel.setActionsState(actionsStates);
        return false;
      });
    }
  }
  viewModel.on("beforeSearch", function (args) {
    args.isExtend = true;
    var conditions = args.params.condition;
    conditions.simpleVOs = [
      {
        field: "verifystate",
        op: "eq",
        value1: "2"
      },
      {
        field: "isdown",
        op: "eq",
        value1: "0"
      },
      {
        field: "downstatus",
        op: "eq",
        value1: "0"
      }
    ];
  });
});