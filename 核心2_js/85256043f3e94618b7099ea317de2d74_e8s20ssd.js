viewModel.on("customInit", function (data) {
  // 询价单--页面初始化
  console.log("====页面初始化");
});
// 供货目录分类枚举传参
viewModel
  .get("sectionSupplierList")
  .getEditRowModel()
  .get("supplierName")
  .on("afterInitVm", function (arg) {
    const referViewModel = arg.vm;
    referViewModel.on("afterInitCommonViewModel", function () {
      const filterViewModel = referViewModel.getCache("FilterViewModel");
      filterViewModel.on("beforeSearch", function (args) {
        let commonVOs = args.commonVOs;
        args.commonVOs = commonVOs.filter((item) => {
          if (item.itemName == "userDefine_58940560_002") {
            let condition = item.value1.map((val) => {
              return {
                field: "vendorDefine.define3",
                op: "like",
                value1: val
              };
            });
            args.simpleVOs = [
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
    });
  });