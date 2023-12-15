console.log("01111111111111111111");
//弃审检验
viewModel.on("beforeUnaudit", function (args) {
  console.log("213213213 beforeUnaudit");
  debugger;
});
//列表弃审前事件，返回false，会阻止弃审事件
viewModel.on("beforeBatchunaudit", function (args) {
  console.log("213213213 beforeBatchunaudit" + JSON.stringify(args.data.data));
  let list = args.data.data;
  checkCanUnaudit(list);
  if (checkCanUnaudit(list)) {
    return true;
  } else {
    return false;
  }
  return false;
});
//检查是否能反审相关单据（没生成差异单的可以反审，生成差异单的未生成凭证的也可以反审）
function checkCanUnaudit(list) {
  console.log("31 checkCanUnaudit DRDLZH2210405");
  let res = cb.rest.invokeFunction(
    "AT15B1FC5208300004.luoyangtest.FullTest",
    {},
    function (err, res) {
      console.log("40err " + JSON.stringify(err));
      console.log("42res " + JSON.stringify(res));
    },
    viewModel,
    { async: false }
  );
  console.log("44 checkCanUnaudit" + JSON.stringify(res));
  return false;
}
//删除未生成凭证的差异单
function delChayi() {}