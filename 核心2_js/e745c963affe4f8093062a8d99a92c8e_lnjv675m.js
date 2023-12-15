viewModel.on("customInit", function (data) {
  // 设置运营商管理员--页面初始化
});
viewModel.get("button24fd") &&
  viewModel.get("button24fd").on("click", function (data) {
    let gridModel = viewModel.getGridModel();
    let SelectedRows = gridModel.getSelectedRows();
    if (SelectedRows.length == 0) {
      cb.utils.alert("请选择至少一条数据！", "info");
      return false;
    }
    let GxsStaffFkArr = [];
    for (let i = 0; i < SelectedRows.length; i++) {
      GxsStaffFkArr.push(SelectedRows[i].GxsStaffFk);
    }
    let obj = {
      billtype: "VoucherList", // 单据类型
      billno: "ybc6d436b3List", // 单据号
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        GxsStaffFkArr: GxsStaffFkArr
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", obj, viewModel);
  });