viewModel.on("customInit", function (data) {
  // 其他入库单--页面初始化
});
//审批前的动作
viewModel.on("beforeWorkflowAction", (data) => {
  var actionName = data.data.actionName;
  let req = viewModel.getAllData();
  var bodys = req.othInRecords;
  var entrys = [];
  for (var i = 0; i < bodys.length; i++) {
    var bodyi = {
      bodyid: bodys[i].id,
      material: bodys[i].product_cCode,
      nnum: bodys[i].qty
    };
    entrys.push(bodyi);
  }
  var a = "headItem!define2";
  //如果是审核同意
  if (actionName == "agree") {
    var jsonString = {
      orgname: req.accountOrg_name,
      vbillcode: req.code,
      warehousename: req.warehouse_name,
      inhouse: "Y",
      deptname: req.department_name,
      dbilldate: req.vouchdate,
      billtype: "dbr",
      memo: req[a],
      billmaker: "BIP",
      method: "TransInto",
      linemsg: entrys
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
    //如果是撤回
  } else if (actionName == "withdrawTask") {
    var jsonString = {
      orgname: req.accountOrg_name,
      vbillcode: req.code,
      warehousename: req.warehouse_name,
      inhouse: "Y",
      deptname: req.department_name,
      dbilldate: req.vouchdate,
      billtype: "dbr",
      memo: req[a],
      billmaker: "BIP",
      method: "TransInto",
      action: "delete",
      linemsg: entrys
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
viewModel.on("beforeAudit", function () {
  //调用后端API处理业务逻辑
  let req = viewModel.getAllData();
  var bodys = req.othInRecords;
  var entrys = [];
  for (var i = 0; i < bodys.length; i++) {
    var bodyi = {
      bodyid: bodys[i].id,
      material: bodys[i].product_cCode,
      nnum: bodys[i].qty
    };
    entrys.push(bodyi);
  }
  var jsonString = {
    orgname: req.org_name,
    vbillcode: req.code,
    warehousename: req.warehouse_name,
    inhouse: "Y",
    deptname: req.department_name,
    dbilldate: req.vouchdate,
    billtype: "ccp",
    vnote: req.memo,
    billmaker: "BIP",
    method: "FinishIn",
    linemsg: entrys
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
viewModel.on("beforeUnaudit", function () {
  debugger;
  //调用后端API处理业务逻辑
  let req = viewModel.getAllData();
  var bodys = req.othInRecords;
  var entrys = [];
  for (var i = 0; i < bodys.length; i++) {
    var bodyi = {
      bodyid: bodys[i].id,
      material: bodys[i].product_cCode,
      nnum: bodys[i].qty
    };
    entrys.push(bodyi);
  }
  var jsonString = {
    orgname: req.org_name,
    vbillcode: req.code,
    warehousename: req.warehouse_name,
    inhouse: "Y",
    deptname: req.department_name,
    dbilldate: req.vouchdate,
    billtype: "ccp",
    vnote: req.memo,
    billmaker: "BIP",
    method: "FinishIn",
    action: "delete",
    linemsg: entrys
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