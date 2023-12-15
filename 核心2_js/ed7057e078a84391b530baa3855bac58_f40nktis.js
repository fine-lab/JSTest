viewModel.on("customInit", function (data) {
  // 客户转正申请单--页面初始化
  viewModel.on("beforeSave", (args) => {
    let submodel = viewModel.getCache("subViewModel");
    let data = JSON.parse(args.data.data);
    let subData = submodel.getAllData();
    subData.merchantApplyRangeId = submodel.getParams().carryParams ? submodel.getParams().carryParams.merchantApplyRangeId : {};
    subData.isCreator = submodel.getParams().carryParams?.isCreator;
    subData.isApplied = submodel.getParams().carryParams?.isApplied;
    data.customerData = JSON.stringify(subData);
    args.data.data = JSON.stringify(data);
    //校验submodel的beforesave
    let validateResult = validateModel(submodel);
    if (!validateResult) {
      return false;
    }
    return true;
  });
});
const validateModel = function (model) {
  let invalidMsg = model.validate();
  if (Array.isArray(invalidMsg) && invalidMsg.length) {
    invalidMsg = invalidMsg.filter((item) => {
      return item;
    });
  }
  if (invalidMsg && invalidMsg.length) {
    try {
      const revertMsg = revertInvalidMesg(invalidMsg);
      cb.utils.alert("以下数据项校验失败：" + revertMsg.join(","), "error");
    } catch (e) {
      invalidMsg = invalidMsg.map((item) => {
        return item.tableName;
      });
      cb.utils.alert("以下数据项校验失败：" + invalidMsg.join(","), "error");
    }
    return false;
  }
  return true;
};