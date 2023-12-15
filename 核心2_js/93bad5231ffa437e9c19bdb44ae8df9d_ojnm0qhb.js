function checkBeUsed(pk_config, vmemo) {
  //校验规则是否已存在打印数据
  if (pk_config != null && pk_config != "") {
    const proxy = viewModel.setProxy({
      queryData: {
        url: "scmbc/bardistribute/checkConfig",
        method: "get"
      }
    });
    //传参
    const param = { pk_config, vmemo };
    const result = proxy.queryDataSync(param);
    if (!result.error.success) {
      cb.utils.alert(result.error.msg, "error");
      return false;
    }
  }
  return true;
}
viewModel.on("beforeEdit", function (args) {
  let items = JSON.parse("{[{'pk_item_code': 'dexpirationdate', 'isFlowCoreBill': '1', 'def1': '失效日期'}, {'pk_item_code': 'vdef1', 'isFlowCoreBill': '0', 'def1': '等级'}]}");
  return checkBeUsed(args.carry.rowData.id, "E");
});
viewModel.on("beforeBatchdelete", function (params) {
  let selected = JSON.parse(params.data.data);
  for (let i = 0; i < selected.length; i++) {
    if (!checkBeUsed(selected[0].id, "D")) return false;
  }
  return true;
});