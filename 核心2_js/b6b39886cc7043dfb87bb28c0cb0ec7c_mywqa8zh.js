viewModel.on("beforeSave", function (args) {
  //设置保存前校验
  debugger;
  var datajs = args.data.data;
  let data1 = JSON.parse(datajs);
  var reponse = cb.rest.invokeFunction("GT8313AT35.backDesignerFunction.jjwzsp", { data1: data1 }, function (err, res) {}, viewModel, { async: false });
  //获取表是新增还是修改
  var zt = data1._status;
  var len = reponse.result.bsj.length;
  return false;
  if (zt == "Insert") {
    if (len < 1) {
    } else {
      cb.utils.confirm("还有相同数据没有审批！");
      return false;
    }
  }
});
viewModel.get("button19kg") &&
  viewModel.get("button19kg").on("click", function (data) {
    // 按钮--单击
    debugger;
    let event = viewModel.getAllData();
    var id = event.id;
    var reponse = cb.rest.invokeFunction("GT8313AT35.backOpenApiFunction.sljy", { id: id }, function (err, res) {}, viewModel, { async: false });
  });