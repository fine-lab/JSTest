viewModel.get("button9lg").on("click", function () {
  let orgId = viewModel.getCache("FilterViewModel").getData().baseOrg.value1;
  let AccYear = viewModel.getCache("FilterViewModel").getData().AccYear.value1;
  let gridData = viewModel.getGridModel().getData();
  let periodId = gridData[0].item40si; //item40si  会计期间年
  console.log("orgId", orgId);
  console.log("AccYear", AccYear);
  cb.rest.invokeFunction("GT104180AT23.AccParameter.addAccParameter", { orgId: orgId, AccYear: AccYear, periodId: periodId }, function (err, res) {
    if (err) {
      console.log("err", JSON.stringify(err));
    }
    if (res) {
      console.log("res", JSON.stringify(res));
      viewModel.get("button9lg").setVisible(false);
    }
  });
});
//查询后事件
viewModel.on("afterSearch", function (params) {
  var gridModel = viewModel.getGridModel();
  gridModel.selectAll();
});
//单选前事件
viewModel.getGridModel().on("beforeUnselect", function (rowIndexs) {
  return false;
});
viewModel.on("customInit", function (data) {
  // 账户结转下年--页面初始化
  var gridModel = viewModel.getGridModel();
  gridModel._set_data("forbiddenDblClick", true);
});
viewModel.get("accbalance_1517464524823199745") &&
  viewModel.get("accbalance_1517464524823199745").on("beforeUnselectAll", function (data) {
    // 表格--取消全选前
    return false;
  });