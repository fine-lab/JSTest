viewModel.on("customInit", function (data) {
  // 调入申请单--页面初始化
  debugger;
});
//审批前的动作
viewModel.on("beforeWorkflowAction", (data) => {
  debugger;
  var actionName = data.data.actionName;
  //调用后端API处理业务逻辑
  let req = viewModel.getAllData();
  debugger;
  var bodys = req.drsqzb1List;
  debugger;
  var entrys = [];
  for (var i = 0; i < bodys.length; i++) {
    var bodyi = {
      bodyid: bodys[i].id,
      material: bodys[i].pk_material_code,
      nnum: bodys[i].nnum
    };
    entrys.push(bodyi);
  }
  //如果是审核同意
  if (actionName == "agree") {
    var jsonString = {
      orgname: req.org_id_name, //组织名称
      vbillcode: req.code, //编码
      dbilldate: req.createTime, //先用创建时间，后面再改
      billtype: "drsq", //
      method: "TransIn",
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
  } else if (actionName == "withdrawTask") {
    //如果是撤回
    var jsonString = {
      orgname: req.org_id_name, //组织名称
      vbillcode: req.code, //编码
      dbilldate: req.createTime, //先用创建时间，后面再改
      billtype: "drsq", //
      method: "TransIn",
      billmaker: "BIP",
      action: "delete",
      linemsg: entrys
    };
    let result = push2NC(jsonString);
    var mes = result.error.message;
    var json = JSON.parse(mes);
    if (json.result == "false") {
      cb.utils.alert(json.resultinfo, "error");
      return false;
    }
  }
});
const push2NC = function (jsonString) {
  //调用后端API
  let result = cb.rest.invokeFunction(
    "AT166878DC09000003.frontDesignerFunction.Send2NC",
    { data: jsonString },
    function (err, res) {
      console.log("res=" + JSON.stringify(res));
    },
    viewModel,
    { async: false }
  );
  return result;
};
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
  });
viewModel.get("drsqzb1List") &&
  viewModel.get("drsqzb1List").getEditRowModel() &&
  viewModel.get("drsqzb1List").getEditRowModel().get("pk_material.name") &&
  viewModel
    .get("drsqzb1List")
    .getEditRowModel()
    .get("pk_material.name")
    .on("valueChange", function (data) {
      // 物料--值改变
    });