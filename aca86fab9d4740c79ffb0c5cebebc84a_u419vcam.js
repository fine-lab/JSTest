viewModel.on("customInit", function (data) {
  // 收购报表数据调整单详情--页面初始化
  //设置批文单位过滤
  viewModel.get("approvalUnit_name").on("beforeBrowse", () => {
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({ field: "code", op: "in", value1: ["1180", "1184", "1171", "1176", "1172", "1185", "1189"] });
    viewModel.get("approvalUnit_name").setFilter(condition);
  });
  //设置承销单位过滤
  viewModel.get("underwritingUnit_name").on("beforeBrowse", () => {
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({ field: "code", op: "in", value1: ["1435", "1734", "1528", "1529", "1173", "1990"] });
    viewModel.get("underwritingUnit_name").setFilter(condition);
  });
});