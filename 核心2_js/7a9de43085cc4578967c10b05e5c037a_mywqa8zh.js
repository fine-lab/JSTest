viewModel.on("beforeSave", function (args) {
  //设置保存前校验
  debugger;
  var datajs = args.data.data;
  let data1 = JSON.parse(datajs);
  var reponse = cb.rest.invokeFunction("GT8313AT35.backOpenApiFunction.czhtbg", { data1: data1 }, function (err, res) {}, viewModel, { async: false });
  var zt = data1._status;
  var len = reponse.result.bsj.length;
  if (zt == "Insert") {
    if (len < 1) {
    } else {
      cb.utils.confirm("还有相同变更申请没有提交！");
      return false;
    }
  }
});