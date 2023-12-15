viewModel.on("customInit", function (data) {
  // 拉取采购入库数据--页面初始化
});
//依据当前登陆人所属组织过滤数据
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  //通用检查查询条件
  var commonVOs = args.params.condition.commonVOs;
  commonVOs.push({
    itemName: "bustype",
    op: "eq",
    value1: "1471571450531938308" //包材/辅料采购入库(RK02)
  });
  let loginOrgRes = cb.rest.invokeFunction("GT101792AT1.API.queryLoginOrg", {}, function (err, res) {}, viewModel, { async: false });
});