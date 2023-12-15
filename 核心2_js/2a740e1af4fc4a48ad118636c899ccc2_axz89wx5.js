let rukubustype = "1826219415820042242"; //其他入库交易类型
viewModel.on("beforeSave", function (args) {
  let uidata = JSON.parse(args.data.data);
  let bustype = uidata.bustype;
  if (rukubustype == bustype) {
    cb.utils.alert("本单据此交易类型不支持保存处理!");
    return false;
  }
});
viewModel.on("beforeEdit", function (args) {
  let data = viewModel.getAllData();
  let bustype = data.bustype;
  if (rukubustype == bustype) {
    cb.utils.alert("本单据此交易类型不支持修改!");
    return false;
  }
});
viewModel.on("beforeDelete", function (args) {
  let data = viewModel.getAllData();
  let bustype = data.bustype;
  if (rukubustype == bustype) {
    cb.utils.alert("本单据此交易类型不支持删除!");
    return false;
  }
});