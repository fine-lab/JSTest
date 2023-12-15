viewModel.on("afterRule", function (args) {
  //获取单据字段的初始值
  code = viewModel.get("code").getValue();
  name = viewModel.get("name").getValue();
  modelDescription = viewModel.get("modelDescription").getValue();
  model = viewModel.get("model").getValue();
});
viewModel.on("afterSave", function (args) {
  let code_new = args.res.code;
  let name_new = args.res.name;
  let modelDescription_new = args.res.modelDescription;
  let model_new = args.res.model;
  let changeFlag = false;
  let res_code = compareOldAndNew(code, code_new);
  let res_name = compareOldAndNew(name, name_new);
  let res_model = compareOldAndNew(model, model_new);
  let res_modelDescription = compareOldAndNew(modelDescription, modelDescription_new);
  debugger;
  if (res_code || res_name || res_modelDescription) {
    cb.rest.invokeFunction(
      "GZTBDM.backOpenApiFunction.syncHTSingle",
      {
        code: code_new,
        name: name_new && name_new["zh_CN"],
        model: model_new["zh_CN"],
        modelDescription: modelDescription_new["zh_CN"]
      },
      function (err, res) {}
    );
  }
});
function compareOldAndNew(oldV, newV) {
  let type_old = typeof oldV;
  let type_new = typeof newV;
  if (type_old === type_new) {
    if (type_new === "object") {
      if (oldV["zh_CN"] !== newV["zh_CN"]) {
        return true;
      } else {
        return false;
      }
    }
    if (type_new === "string") {
      if (oldV !== newV) {
        return true;
      } else {
        return false;
      }
    }
    if (type_new === "undefined") {
      return false;
    }
  } else {
    return true;
  }
}