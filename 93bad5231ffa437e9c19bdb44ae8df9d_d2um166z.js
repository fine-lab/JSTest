viewModel.on("beforeBatchdelete", function (params) {
  console.log("【beforeBatchdelete】");
  var selected = JSON.parse(params.data.data);
  //校验规则是否已分配
  const pk_config = selected[0].id;
  if (pk_config != null && pk_config != "") {
    const proxy = viewModel.setProxy({
      queryData: {
        url: "scmbc/bardistribute/checkConfig",
        method: "get"
      }
    });
    //传参
    const vmemo = "D"; //删除
    const param = { pk_config, vmemo };
    const result = proxy.queryDataSync(param);
    if (!result.error.success) {
      cb.utils.alert(result.error.msg, "error");
      return false;
    }
  }
});