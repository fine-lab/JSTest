viewModel.get("button22uj") &&
  viewModel.get("button22uj").on("click", function (data) {
    // 启用--单击
    debugger;
    var resuu = viewModel.getAllData();
    var result = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.BJstart", { resuu: resuu }, function (err, res) {}, viewModel, { async: false });
    viewModel.execute("refresh");
    if (result.error.code == "999") {
      cb.utils.alert(" -- 含有启用状态,请勿重复点击 -- ");
      return;
    }
  });
viewModel.get("button31bh") &&
  viewModel.get("button31bh").on("click", function (data) {
    // 停用--单击
    debugger;
    var resuu = viewModel.getAllData();
    var result = cb.rest.invokeFunction("AT15F164F008080007.backDesignerFunction.BJstop", { resuu: resuu }, function (err, res) {}, viewModel, { async: false });
    viewModel.execute("refresh");
    if (result.error.code == "999") {
      cb.utils.alert(" -- 含有停用状态,请勿重复点击 -- ");
      return;
    }
  });
viewModel.get("shebeibianma_code") &&
  viewModel.get("shebeibianma_code").on("afterValueChange", function (data) {
    // 设备编码--值改变后
    debugger;
    var name = data.value.name;
    viewModel.get("shebeibianma_name").setValue(name);
  });
viewModel.get("shebeibianma_code") &&
  viewModel.get("shebeibianma_code").on("beforeBrowse", function (data) {
    // 设备编码--参照弹窗打开前
    debugger;
    // 获取组织id
    const value = viewModel.get("org_id").getValue();
    // 实现选择用户的组织id过滤
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "accentity",
      op: "eq",
      value1: value
    });
    this.setFilter(condition);
  });
viewModel.on("afterLoadData", function (args) {
  debugger;
  var data = [
    { value: "1", text: "启用", nameType: "string" },
    { value: "2", text: "报废", nameType: "string" },
    { value: "3", text: "外借", nameType: "string" },
    { value: "4", text: "闲置", nameType: "string" },
    { value: "5", text: "维修", nameType: "string" }
  ];
  viewModel.get("zhuangtai").setDataSource(data);
});