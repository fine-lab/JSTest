viewModel.on("afterLoadMeta", (args) => {
  const { vm, view } = args;
  let userid = cb.context.getUserId();
  cb.rest.invokeFunction(
    "AT16F3BEFC09B8000B.backOpenApiFunction.HX1677550589",
    { userid },
    function (err, res) {
      vm.setCache("projectName", res.ProjectVO);
    },
    vm,
    { domainKey: "yourKeyHere" }
  );
  cb.cache.set("firstLoad", 1);
});
viewModel.getGridModel().on("beforeLoad", (data) => {
  loadStyle();
  document.getElementsByClassName("tab-top-toolbar")[0].style.display = "none";
  document.querySelector(
    "div.meta-dynamic-view.yb5d450a1fList.developplatform > div.wui-tabs.wui-tabs-top.ys-tabs.meta-container.height-100.wui-tabs-editable-card > div.wui-tabs-content.wui-tabs-content-no-animated > div > div > div.height-100.ncc-flex-container.false.undefined.undefined.undefined.jDiwork-container > div > div:nth-child(2)"
  ).style.backgroundColor = "#FFFFFF";
  document.querySelector(
    "div.meta-dynamic-view.yb5d450a1fList.developplatform > div.wui-tabs.wui-tabs-top.ys-tabs.meta-container.height-100.wui-tabs-editable-card > div.wui-tabs-content.wui-tabs-content-no-animated > div > div > div.height-100.ncc-flex-container.false.undefined.undefined.undefined.jDiwork-container > div > div:nth-child(2)"
  ).style.backgroundColor = "#FFFFFF";
  document.querySelector(
    "div.meta-dynamic-view.yb5d450a1fList.developplatform > div > div.wui-tabs-content.wui-tabs-content-no-animated > div.wui-tabs-tabpane.wui-tabs-tabpane-active.mdf-bill-tabpane > div > div.height-100.ncc-flex-container.false.undefined.undefined.undefined.jDiwork-container > div > div:nth-child(2)"
  ).style.backgroundColor = "#FFFFFF";
  document.querySelector(
    "#container > div > div.wui-tabs.wui-tabs-top.ys-tabs.meta-container.height-100.wui-tabs-editable-card > div.wui-tabs-content.wui-tabs-content-no-animated > div > div > div.height-100.ncc-flex-container.false.undefined.undefined.undefined.portal-container > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(5)"
  ).style.display = "none";
  document.querySelector(
    "#container > div > div.wui-tabs.wui-tabs-top.ys-tabs.meta-container.height-100.wui-tabs-editable-card > div.wui-tabs-content.wui-tabs-content-no-animated > div > div > div.height-100.ncc-flex-container.false.undefined.undefined.undefined.portal-container > div > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(3)"
  ).style.display = "none";
});
viewModel.getGridModel().on("afterSetDataSource", (args) => {
  let gridModel = viewModel.getGridModel();
  const rows = gridModel.getRows();
  const actions = gridModel.getCache("actions");
  const actionsStates = [];
  rows.forEach((data) => {
    const actionState = {};
    actions.forEach((action) => {
      actionState["btnJointQuery"] = { visible: true };
      if ((data.approvalStatus === "1" || data.approvalStatus === "4") && data.isWfControlled === 1) {
        if (data.verifystate === 1) {
          actionState["button105wa"] = { visible: true };
          actionState["button97wb"] = { visible: false };
        } else {
          actionState["button105wa"] = { visible: false };
          actionState["button97wb"] = { visible: true };
        }
        actionState["btnEdit"] = { visible: true };
        actionState["btnDelete"] = { visible: true };
      } else if ((data.approvalStatus === "1" || data.approvalStatus === "4") && data.isWfControlled === 0) {
        actionState["button88gf"] = { visible: true };
        actionState["btnEdit"] = { visible: true };
        actionState["btnDelete"] = { visible: true };
      } else if (data.approvalStatus === "2") {
        actionState["button105wa"] = { visible: true };
        actionState["button111de"] = { visible: true };
      } else if (data.approvalStatus === "3" && data.isWfControlled === 0) {
        actionState["button115zc"] = { visible: true };
      }
    });
    actionsStates.push(actionState);
  });
  gridModel.setActionsState(actionsStates);
  return false;
});
//加载自定义样式 (无异步、css不生效问题，效果好)
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `
    .hide-tabs {display: none}
    `;
  headobj.appendChild(style);
}
//点击tab切换标签获取标签值
viewModel.on("afterTabActiveKeyChange", function (info) {
  const { key } = info;
  switch (key) {
    case "tabpane92fg":
      // 待发布
      cb.cache.set("approvalStatus", ["1", "4"]);
      viewModel.get("btnBatchSubmit").setVisible(true);
      viewModel.get("btnBatchUnSubmit").setVisible(true);
      viewModel.get("button50yk").setVisible(true);
      viewModel.get("button70pj").setVisible(true);
      viewModel.get("btnBatchDelete").setVisible(true);
      cb.cache.set("firstLoad", 0);
      break;
    case "tabpane11ud":
      // 内审中
      cb.cache.set("approvalStatus", ["2"]);
      viewModel.get("btnBatchSubmit").setVisible(false);
      viewModel.get("btnBatchUnSubmit").setVisible(false);
      viewModel.get("button50yk").setVisible(false);
      viewModel.get("button70pj").setVisible(false);
      viewModel.get("btnBatchDelete").setVisible(false);
      cb.cache.set("firstLoad", 0);
      break;
    case "tabpane26sd":
      // 已生效
      cb.cache.set("approvalStatus", ["3"]);
      viewModel.get("btnBatchSubmit").setVisible(false);
      viewModel.get("btnBatchUnSubmit").setVisible(false);
      viewModel.get("button50yk").setVisible(false);
      viewModel.get("button70pj").setVisible(false);
      viewModel.get("btnBatchDelete").setVisible(false);
      cb.cache.set("firstLoad", 0);
      break;
    case "tabpane54mh":
      // 全部
      cb.cache.set("approvalStatus", ["7"]);
      viewModel.get("btnBatchSubmit").setVisible(false);
      viewModel.get("btnBatchUnSubmit").setVisible(false);
      viewModel.get("button50yk").setVisible(false);
      viewModel.get("button70pj").setVisible(false);
      viewModel.get("btnBatchDelete").setVisible(false);
      cb.cache.set("firstLoad", 0);
      break;
    default:
      console.log("default");
  }
  const filtervm = viewModel.getCache("FilterViewModel");
  filtervm.get("search").execute("click", { model: viewModel, solutionid: filtervm.getCache("schemeId") });
});
viewModel.on("beforeSearch", function (args) {
  let userid = cb.context.getUserId();
  let result = cb.rest.invokeFunction("AT16F3BEFC09B8000B.backOpenApiFunction.HX1677550589", { userid }, function (err, res) {}, viewModel, { domainKey: "yourKeyHere", async: false });
  let approvalStatus = ["1", "4"];
  if (cb.cache.get("approvalStatus") && cb.cache.get("firstLoad") === 0) {
    approvalStatus = cb.cache.get("approvalStatus");
  }
  let projectName = result.result.ProjectVO;
  commonVOs = args.params.condition.commonVOs;
  if (approvalStatus.indexOf("7") === -1) {
    commonVOs.push({
      itemName: "approvalStatus",
      op: "in",
      value1: approvalStatus
    });
  }
  if (projectName && projectName.length === 1) {
    commonVOs.push({
      itemName: "HXSaCheckMaterialVO2List.projectName",
      op: "eq",
      value1: projectName[0].id
    });
  }
});