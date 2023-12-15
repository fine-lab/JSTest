viewModel.get("button6xj") &&
  viewModel.get("button6xj").on("click", function (data) {
    // 确定--单击
    var rowDatas = viewModel.getGridModel().getSelectedRows();
    if (rowDatas.length == 0) {
      cb.utils.alert("没有选取潜客记录！");
      return;
    }
    cb.utils.confirm(
      "确定要生成系统客户档案吗？",
      function () {
        var rowData = rowDatas[0];
        synCreateSysCust(rowData);
      },
      function (args) {
        return;
      }
    );
  });
function synCreateSysCust(rowData) {
  let isRelated = rowData.isRelated;
  let merchant = rowData.merchant;
  if (isRelated && merchant != null && merchant != "") {
  }
  let id = rowData.id;
  let code = rowData.code;
  let MingChen = rowData.MingChen;
  let merchant_name = rowData.merchant_name;
  if (id == null || id == "") {
    cb.utils.alert("温馨提示，请先完善信息！", "error");
    return;
  }
  cb.rest.invokeFunction("GT3734AT5.APIFunc.createSysCustApi", { id: id, code: code, MingChen: MingChen, merchant_name: merchant_name }, function (err, res) {
    if (err == null) {
      let resData = res.data;
      var rst = resData.rst;
      if (rst) {
        cb.utils.alert("温馨提示！系统客户档案已生成[" + resData.custCode + "]", "info");
      } else {
        cb.utils.alert("温馨提示！系统客户档案生成失败[" + resData.msg + "]", "error");
      }
    } else {
      cb.utils.alert("温馨提示！系统客户档案生成失败:" + JSON.JSON.stringify(err), "error");
    }
    let parentViewModel = viewModel.getCache("parentViewModel");
    parentViewModel.execute("refresh");
    viewModel.communication({ type: "modal", payload: { data: false } });
  });
}