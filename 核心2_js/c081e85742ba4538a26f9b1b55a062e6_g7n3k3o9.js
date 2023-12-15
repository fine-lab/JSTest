viewModel.on("customInit", function (data) {
  // 其他入库单--页面初始化
});
viewModel.on("beforeWorkflowAction", (data) => {
  debugger;
  var actionName = data.data.actionName;
  let req = viewModel.getAllData();
  //获取整个列表数据
  var heads = req.st_othinrecordlist;
  var a = 0; //计数
  //如果全为false，报错！
  if (heads.findIndex((target) => target._selected === true) == -1) {
    //全为false
    cb.utils.alert("必须选中才能提交!", "error");
    return false;
  }
  let pkarray = [];
  //遍历已经选中的数据
  for (var i = 0; i < heads.length; i++) {
    if (heads[i]._selected) {
      //如果是被选中的
      pkarray.push(heads[i].id);
    }
  }
  //去重
  let newArr = [];
  for (let i = 0; i < pkarray.length; i++) {
    if (newArr.indexOf(pkarray[i]) === -1) {
      newArr.push(pkarray[i]);
    }
  }
  if (actionName == "agree") {
    var jsonString = {
      islist: "true",
      type: "TransInto",
      pkarray: newArr
    };
    let result = push2NC(jsonString);
    var mes = result.error.message;
    var json = JSON.parse(mes);
    if (json == "timeout") {
      cb.utils.alert("BIP访问NC系统超时", "error");
      return false;
    }
    if (json.result == "false") {
      cb.utils.alert(json.resultinfo, "error");
      return false;
    }
  } else if (actionName == "withdrawTask") {
    var jsonString = {
      islist: "true",
      type: "TransInto",
      action: "delete",
      pkarray: newArr
    };
    let result = push2NC(jsonString);
    var mes = result.error.message;
    var json = JSON.parse(mes);
    if (json == "timeout") {
      cb.utils.alert("BIP访问NC系统超时", "error");
      return false;
    }
    if (json.result == "false") {
      cb.utils.alert(json.resultinfo, "error");
      return false;
    }
  }
});
//列表表头下拉框审批
viewModel.on("beforeBatchaudit", function (data) {
  debugger;
  //调用后端API处理业务逻辑
  let req = viewModel.getAllData();
  //获取整个列表数据
  var heads = req.st_othinrecordlist;
  var a = 0; //计数
  //如果全为false，报错！
  if (heads.findIndex((target) => target._selected === true) == -1) {
    //全为false
    cb.utils.alert("必须选中才能提交!", "error");
    return false;
  }
  let pkarray = [];
  //遍历已经选中的数据
  for (var i = 0; i < heads.length; i++) {
    if (heads[i]._selected) {
      //如果是被选中的
      pkarray.push(heads[i].id);
    }
  }
  //去重
  let newArr = [];
  for (let i = 0; i < pkarray.length; i++) {
    if (newArr.indexOf(pkarray[i]) === -1) {
      newArr.push(pkarray[i]);
    }
  }
  var jsonString = {
    islist: "true",
    type: "FinishIn",
    pkarray: newArr
  };
  let result = push2NC(jsonString);
  var mes = result.error.message;
  var json = JSON.parse(mes);
  if (json == "timeout") {
    cb.utils.alert("BIP访问NC系统超时", "error");
    return false;
  }
  if (json.result == "false") {
    cb.utils.alert(json.resultinfo, "error");
    return false;
  }
});
//列表表头弃审
viewModel.on("beforeBatchunaudit", function (data) {
  debugger;
  //调用后端API处理业务逻辑
  let req = viewModel.getAllData();
  if (req.bustype == "1575914708980465678") {
    //获取整个列表数据
    var heads = req.st_othinrecordlist;
    var a = 0; //计数
    //如果全为false，报错！
    if (heads.findIndex((target) => target._selected === true) == -1) {
      //全为false
      cb.utils.alert("必须选中才能提交!", "error");
      return false;
    }
    let pkarray = [];
    //遍历已经选中的数据
    for (var i = 0; i < heads.length; i++) {
      if (heads[i]._selected) {
        //如果是被选中的
        pkarray.push(heads[i].id);
      }
    }
    var jsonString = {
      islist: "true",
      action: "delete",
      type: "FinishIn",
      pkarray: pkarray
    };
    let result = push2NC(jsonString);
    var mes = result.error.message;
    var json = JSON.parse(mes);
    if (json == "timeout") {
      cb.utils.alert("BIP访问NC系统超时", "error");
      return false;
    }
    if (json.result == "false") {
      cb.utils.alert(json.resultinfo, "error");
      return false;
    }
  } else {
    cb.utils.alert("调拨入库启动审批流，不允许直接弃审", "error");
    return false; // 必须这么写
  }
});
const push2NC = function (jsonString) {
  //调用后端API
  let result = cb.rest.invokeFunction(
    "ST.frontDesignerFunction.Send2NC",
    { data: jsonString },
    function (err, res) {
      console.log("res=" + JSON.stringify(res));
    },
    viewModel,
    { async: false }
  );
  return result;
};