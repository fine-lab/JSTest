viewModel.on("customInit", function (data) {
  debugger;
  //商业收购调整单一主多子--页面初始化
  viewModel.on("beforeSave", (args) => {
    let rows = viewModel.getGridModel("busi_acquisit_adjust_iList").getRows() || [];
    let filterRes = rows.filter((i) => (i.adjust_amount === undefined || i.adjust_amount === null) && (i.adjust_num === undefined || i.adjust_num === null));
    if (filterRes.length > 0) {
      cb.utils.alert("表体行 调整收购额 和 调整收购数 不能同时为空", "error");
      return false;
    }
  });
});