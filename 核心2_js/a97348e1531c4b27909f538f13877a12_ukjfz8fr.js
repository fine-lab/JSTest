viewModel.on("beforeUnaudit", function (args) {
  var data_array = JSON.parse(args.data.data);
  console.log("07_弃审_前");
  let flag = checkUnaudit(data_array);
  return flag;
});
//检查是否弃审
function checkUnaudit(data_array) {
  let is_allow_Unaudit = false;
  console.log("33" + JSON.stringify(data_array));
  var diaoru_code_array = [];
  for (let i = 0; i < data_array.length; i++) {
    diaoru_code_array.push({ code: data_array[i].code });
  }
  console.log("39diaoru_code_array" + JSON.stringify(diaoru_code_array));
  let data = cb.rest.invokeFunction("ST.backDesignerFunction.checkDelChayidan", { diaoru_code_array: diaoru_code_array }, function (err, res) {}, viewModel, { async: false });
  console.log("39_" + JSON.stringify(data.result));
  if (data.result.code == 0) {
    return true;
  } else {
    cb.utils.alert("反审失败，" + data.result.message);
    return false;
  }
}
//测试api是否能通过
function testApi() {
  console.log("30——testApi click");
  let data = cb.rest.invokeFunction(
    "ST.backDesignerFunction.getApiToken",
    {},
    function (err, res) {
    },
    viewModel,
    { async: false }
  );
  console.log("39_" + JSON.stringify(data));
}