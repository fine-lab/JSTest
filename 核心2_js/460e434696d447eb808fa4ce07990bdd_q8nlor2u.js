console.log("01111111111111111111");
//列表弃审前事件，返回false，会阻止弃审事件
//检查是否能反审相关单据（没生成差异单的可以反审，生成差异单的未生成凭证的也可以反审）
function checkCanUnaudit(list) {
  console.log("31 checkCanUnaudit" + list.length);
  let code_array = [];
  for (let i = 0; i < list.length; i++) {
    code_array.push(list[i].code);
  }
  console.log("42 code_array" + code_array);
  if (code_array == null || code_array.length == 0) {
    return true;
  }
  let res = cb.rest.invokeFunction(
    "ST.zcKucun.bfUnauditChayi",
    { code_array: code_array },
    function (err, res) {
    },
    viewModel,
    { async: false }
  );
  console.log("44 checkCanUnaudit" + JSON.stringify(res));
  if (res.result.code != 200) {
    cb.utils.alert(res.result.message);
    return false;
  } else {
    return true;
  }
}
//删除未生成凭证的差异单
function delChayi() {}