//依据当前登陆人所属组织过滤数据
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  //通用检查查询条件
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "bustype",
    op: "eq",
    value1: "1501321976145772550" //包材/辅料采购入库(RK02)
  });
  let loginOrgRes = cb.rest.invokeFunction("GT101792AT1.API.queryLoginOrg", {}, function (err, res) {}, viewModel, { async: false });
});