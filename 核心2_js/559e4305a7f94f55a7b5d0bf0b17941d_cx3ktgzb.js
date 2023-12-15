viewModel.on("customInit", function (data) {
  // 其他入库单--页面初始化
  debugger;
});
viewModel.on("beforeAudit", function () {
  //调用后端API处理业务逻辑
  let req = viewModel.getAllData();
  var bodys = req.othOutRecords;
  debugger;
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
    deptname: req.department_name,
    warehousename: req.warehouse_name,
    dbilldate: req.vouchdate,
    billtype: "clc",
    method: "MaterialOut",
    type: "MaterialOut",
    billmaker: "BIP",
    linemsg: entrys,
    vnote: req.memo
  };
  let result = push2NC(jsonString);
  var mes = result.error.message;
  var json = JSON.parse(mes);
  if (json.result == "false") {
    cb.utils.alert(json.resultinfo, "error");
    return false;
  }
});
viewModel.on("beforeUnaudit", function () {
  debugger;
  let req = viewModel.getAllData();
  var bodys = req.othOutRecords;
  debugger;
  var entrys = [];
  for (var i = 0; i < bodys.length; i++) {
    var bodyi = {
      bodyid: bodys[i].id,
      material: bodys[i].product_cCode,
      nnum: bodys[i].qty
    };
    entrys.push(bodyi);
  }
  debugger;
  var jsonString = {
    orgname: req.org_name,
    vbillcode: req.code,
    deptname: req.department_name,
    warehousename: req.warehouse_name,
    dbilldate: req.vouchdate,
    billtype: "clc",
    method: "MaterialOut",
    action: "delete",
    billmaker: "BIP",
    linemsg: entrys
  };
  let result = push2NC(jsonString);
  var mes = result.error.message;
  var json = JSON.parse(mes);
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