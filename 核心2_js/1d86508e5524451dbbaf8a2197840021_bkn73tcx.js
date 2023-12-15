viewModel.get("button175ca") &&
  viewModel.get("button175ca").on("click", function (data) {
    // 获取数据--单击
    debugger;
    const Alldata = viewModel.getAllData();
    var res = cb.rest.invokeFunction("GT99994AT1.api.allAuxiliaryBal", { data: Alldata }, function (err, res) {}, viewModel, { async: false });
    if (res.error != undefined) {
      cb.utils.alert("合同履约成本查询失败!", "error");
    } else if (res.result.apiResponseobj.code == "200" && res.result.apiResponseobj.data != undefined) {
      cb.utils.alert("查询成功", "success");
    } else {
      cb.utils.alert("合同履约成本查询失败!", "error");
    }
  });