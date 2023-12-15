viewModel.on("beforeBatchdelete", function (params) {
  var selected = JSON.parse(params.data.data);
  //校验规则是否已分配
  const snruleId = selected[0].id;
  if (snruleId != null && snruleId != "") {
    const proxy = viewModel.setProxy({
      queryData: {
        url: "scmbc/snrule/checkDistributeById",
        method: "get"
      }
    });
    //传参
    const param = { snruleId };
    const result = proxy.queryDataSync(param);
    if (!result.error.success) {
      cb.utils.alert(result.error.msg, "error");
      return false;
    }
  }
});