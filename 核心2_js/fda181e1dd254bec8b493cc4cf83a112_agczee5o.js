viewModel.on("customInit", function (data) {
  //商业收购特殊产品查询表--页面初始化
  viewModel.on("beforeSearch", function (args) {
    args.params.condition.isExtend = true;
    args.params.condition.commonVOs.forEach((i) => {
      if (i.itemName == "yearly") {
        i.value1 = i.value1.substring(0, 10);
        i.value2 = i.value2.substring(0, 10);
      }
    });
  });
});