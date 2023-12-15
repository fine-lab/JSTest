let view_data_id = 1;
viewModel.on("customInit", function (data) {
  // 客户档案--页面初始化
  debugger;
  let { mode, billType, billNo, billData } = viewModel.getParams();
});
viewModel.on("afterMount", function (args) {
  debugger;
  let cut = cb.shortcut.runCommandMap;
  let link_qr = cb.context.getQuery();
  if (cut.productcenter__aa_customerapply != undefined || link_qr.busiObj == "productcenter.aa_customerapply") {
  } else {
    const tab = document.getElementsByClassName("wui-tabs-tab");
    for (let i = 0; i < tab.length; i++) {
      if (tab[i].attributes.nodeKey.value == "group111wh") {
        tab[i].style.display = "none";
      }
    }
  }
});
viewModel.get("sy01_kh_xgzzList") &&
  viewModel.get("sy01_kh_xgzzList").on("beforeSetDataSource", function (data) {
    // 证照管理--设置数据源前
  });