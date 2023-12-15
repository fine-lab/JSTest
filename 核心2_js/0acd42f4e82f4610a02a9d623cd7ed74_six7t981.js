//加载自定义样式
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  headobj.appendChild(style);
  style.sheet.insertRule(params, 0);
}
//加载样式
loadStyle(".myhide {display:none;}");
viewModel.on("customInit", function (data) {
  var userInfo = viewModel.getAppContext().user;
  console.log(viewModel.getAppContext());
  var sysId = userInfo.sysId;
  var tenantID = viewModel.getAppContext().tenant.tenantId;
  gridModel.on("afterSetDataSource", () => {
    //获取列表所有数据
    const rows = gridModel.getRows();
    //从缓存区获取按钮
    const actions = gridModel.getCache("actions");
    if (!actions) return;
    const actionsStates = [];
    rows.forEach((data) => {
      const level = data.level;
      const actionState = {};
      actions.forEach((action) => {
        //设置按钮可用不可用
        actionState[action.cItemName] = { visible: false };
      });
      actionsStates.push(actionState);
    });
    gridModel.setActionsState(actionsStates);
    setTimeout(function () {
      gridModel.setActionsState(actionsStates);
    }, 50);
  });
});