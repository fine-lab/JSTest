viewModel.on("customInit", function (data) {
  // 货位档案列表--页面初始化
  viewModel.getParams().autoLoad = false;
});
var gridModel = viewModel.getGridModel();
viewModel.on("beforePrintpreview", (data) => {
  let rows = gridModel.getSelectedRows();
  let params = viewModel.getParams();
  let cmdParameter = !!data.cmdParameter ? JSON.parse(data.cmdParameter) : {};
  if (params._SERVER_URL_) {
    cmdParameter.serverUrl = params._SERVER_URL_ + (cmdParameter.serverUrl.indexOf("/") == 0 ? cmdParameter.serverUrl : "/" + cmdParameter.serverUrl);
  }
  var db_params = {};
  if (!!cmdParameter.params) {
    db_params = cmdParameter.params;
  }
  cmdParameter.params = Object.assign(db_params, {
    billno: params.cardKey,
    ids: []
  });
  cmdParameter.printcode = "u8c1626858071000";
  rows.map(function (row) {
    if (cmdParameter.params.ids.indexOf(row.id) < 0) {
      cmdParameter.params.ids.push(row.id);
    }
  });
  data.cmdParameter = JSON.stringify(cmdParameter);
});