//设置保存前校验
viewModel.on("beforeSave", function (args) {
  debugger;
  //获得GridModel中的全部数据
  let gridModel = viewModel.getGridModel("requisitionDetail");
  let data1 = gridModel.getData();
  //调用API
  var inner11 = cb.rest.invokeFunction("ST.backOpenApiFunction.kkgl", { data1: data1 }, function (err, res) {}, viewModel, { async: false });
});
//保存后
viewModel.on("afterDelete", function () {
  let gridModel = viewModel.getGridModel("requisitionDetail");
  let onedata = gridModel.getSelectedRows();
  //回写数据
  var inner = cb.rest.invokeFunction("ST.backOpenApiFunction.DeleteUpdate", { onedata: onedata }, function (err, res) {}, viewModel, { async: false });
});