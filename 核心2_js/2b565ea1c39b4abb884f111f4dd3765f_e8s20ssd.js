viewModel.on("customInit", function (data) {
  // 供应商列表--页面初始化
});
// 列表搜索条件供货目录分类枚举传参
viewModel.on("beforeSearch", function (args) {
  let commonVOs = args.params.condition.commonVOs;
  args.params.condition.commonVOs = commonVOs.filter((item) => {
    if (item.itemName == "userDefine_58940560_002") {
      let condition = item.value1.map((val) => {
        return {
          field: "vendorDefine.define3",
          op: "like",
          value1: val
        };
      });
      args.params.condition.simpleVOs = [
        {
          logicOp: "or",
          conditions: condition
        }
      ];
      return false;
    } else {
      return true;
    }
  });
});