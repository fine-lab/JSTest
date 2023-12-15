let code_array = [];
//审核前事件
viewModel.on("beforeBatchaudit", function (args) {
  console.log("10 beforeBatchaudit" + JSON.stringify(args));
  if (args == null || args.data == null || args.data.data == null || args.data.data.length == 0) {
    cb.utils.alert("没有可以批量审核的对象，请选择未审核的单据");
    return false;
  }
  let data = JSON.parse(args.data.data);
  console.log("18 beforeBatchaudit" + JSON.stringify(data));
  code_array = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].verifystate != 0) {
      cb.utils.alert(data[i].code + "单据已审核,请选择未审核的单据");
      return false;
    } else {
      code_array.push(data[i].code);
    }
  }
  return true;
});
//审核后事件
viewModel.on("afterBatchaudit", function (args) {
  //获取表单数据
  console.log("52 afterBatchaudit " + JSON.stringify(args));
  let data = args.res.infos;
  if (code_array == null || code_array.length == 0) {
    return;
  }
  let access_token = getToken();
  let parm = {
    code_array: code_array,
    access_token: access_token
  };
  console.log("35 parm" + JSON.stringify(parm));
  let res = cb.rest.invokeFunction(
    "AT15CFB6F808300003.zcYewu.createPz",
    parm,
    function (err, res) {
    },
    viewModel,
    { async: false }
  );
  console.log("37 result" + JSON.stringify(res));
  let result = res.result;
  code_array = [];
  if (result.code == 200) {
    return true;
  } else {
    let message = result.message;
    cb.utils.alert(message);
    return false;
  }
});
//弃审前事件
viewModel.on("beforeBatchunaudit", function (args) {
  console.log("55 beforeBatchaudit" + JSON.stringify(args));
  if (args == null || args.data == null || args.data.data == null || args.data.data.length == 0) {
    cb.utils.alert("没有可以批量弃审的对象，请选择已审核的单据");
    return false;
  }
  //获取表单数据
  let data = JSON.parse(args.data.data);
  console.log("18 beforeBatchunaudit" + JSON.stringify(data));
  let access_token = getToken();
  let code_array = [];
  for (let i = 0; i < data.length; i++) {
    code_array.push(data[i].code);
  }
  let parm = {
    code_array: code_array,
    access_token: access_token
  };
  console.log("71 parm" + JSON.stringify(parm));
  let res = cb.rest.invokeFunction(
    "AT15CFB6F808300003.zcYewu.bfUnauditChayi",
    parm,
    function (err, res) {
    },
    viewModel,
    { async: false }
  );
  let result = res.result;
  console.log("79 result" + JSON.stringify(result));
  if (result.code != null && result.code == 200) {
    return true;
  } else {
    let message = result.message;
    cb.utils.alert(message);
    return false;
  }
});
//弃审后事件
viewModel.on("afterBatchunaudit", function (args) {
});
function getToken() {
  let result_gettoken = cb.rest.invokeFunction("AT15CFB6F808300003.zcUtil.getToken", {}, function (err, res) {}, viewModel, { async: false });
  let access_token = result_gettoken.result.access_token;
  return access_token;
}