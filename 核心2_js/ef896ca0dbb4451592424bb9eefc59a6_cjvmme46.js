viewModel.get("button24ii") &&
  viewModel.get("button24ii").on("click", function (data) {
    // 生效--单击
    var rowData = viewModel.getGridModel().getSelectedRows();
    if (rowData.length == 0) {
      cb.utils.alert("请选择想要生效的数据!");
    }
    debugger;
    for (var i = 0; i < rowData.length; i++) {
      var state = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.selectById", { id: rowData[i].id }, function (err, res) {}, viewModel, { async: false });
      var flag = false;
      debugger;
      for (var j = 0; j < state.result.res.length; j++) {
        if ("true" == state.result.res[j].isTakeEffect) {
          cb.utils.alert("该数据已生效,操作失败");
          return false;
        }
      }
      var result = cb.rest.invokeFunction(
        "AT164D981209380003.backOpenApiFunction.selectByCustomer",
        { customerType: rowData[i].customerType, customer: rowData[i].customer },
        function (err, res) {},
        viewModel,
        { async: false }
      );
      debugger;
      if (result.result.res.length != 0) {
        if (rowData[i].planEffectiveDate == null) {
          cb.utils.alert("已有相同客户的生效数据,操作失败");
          return false;
        } else {
          var start = new Date(rowData[i].planEffectiveDate).getTime();
          var end = new Date(rowData[i].planEffectiveEndDate).getTime();
          var endDate = new Date(result.result.res[0].planEffectiveEndDate).getTime();
          var startDate = new Date(result.result.res[0].planEffectiveDate).getTime();
          if (start >= startDate && end <= endDate) {
            cb.utils.alert("已有相同客户的生效数据,操作失败");
            return false;
          }
        }
      }
      var pose = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.updateData", { id: rowData[i].id }, function (err, res) {}, viewModel, { async: false });
    }
    viewModel.execute("refresh");
  });
viewModel.on("beforeEdit", function (args) {
  var id = args.carry.rowData.id;
  var buttonName = args.params.cItemName;
  if ("btnEdit" == buttonName) {
    var result = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.selectById", { id: id }, function (err, res) {}, viewModel, { async: false });
    var end = new Date(result.result.res[0].planEffectiveEndDate).getTime();
    var now = new Date().getTime();
    if ("true" == result.result.res[0].isTakeEffect && end >= now) {
      cb.utils.alert("已生效,无法编辑,操作失败");
      return false;
    }
  }
});
//获取当前的model
let gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", () => {
  //获取列表所有数据
  const rows = gridModel.getRows();
  //从缓存区获取按钮
  const actions = gridModel.getCache("actions");
  if (!actions) return;
  const actionsStates = [];
  rows.forEach((data) => {
    var result = cb.rest.invokeFunction("AT164D981209380003.backOpenApiFunction.selectById", { id: data.id }, function (err, res) {}, viewModel, { async: false });
    const actionState = {};
    actions.forEach((action) => {
      //设置按钮可用不可用
      actionState[action.cItemName] = { visible: true };
      if (action.cItemName == "button29fe") {
        var end = new Date(result.result.res[0].planEffectiveEndDate).getTime();
        var now = new Date().getTime();
        if ("true" != result.result.res[0].isTakeEffect && end >= now) {
          actionState[action.cItemName] = { visible: false };
        }
      }
    });
    actionsStates.push(actionState);
  });
  setTimeout(function () {
    gridModel.setActionsState(actionsStates);
  }, 50);
});