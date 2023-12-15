viewModel.on("afterMount", function (data) {
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  filterViewModelInfo.on("afterInit", function () {
    filterViewModelInfo
      .get("vendor")
      .getFromModel()
      .on("beforeBrowse", function (args) {
        //获取选择的供应商分类
        let supplierclass = filterViewModelInfo.get("supplierclass").getFromModel().getValue();
        var myFilter = { isExtend: true, simpleVOs: [] };
        myFilter.simpleVOs.push({
          field: "vendorclass",
          op: "eq",
          value1: supplierclass
        });
        this.setFilter(myFilter);
      });
  });
});