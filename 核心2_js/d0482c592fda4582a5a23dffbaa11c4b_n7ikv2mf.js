viewModel.on("customInit", function (data) {
  // 咨询伙伴资质申请--页面初始化
});
viewModel.on("beforeSearch", function (args) {
  args.isExtend = true;
  var commonVOs = args.params.condition.commonVOs; //通用检查查询条件
  commonVOs = commonVOs ? commonVOs : [];
  commonVOs.push({
    itemName: "profPartnerType",
    op: "eq",
    value1: "COT"
  });
});