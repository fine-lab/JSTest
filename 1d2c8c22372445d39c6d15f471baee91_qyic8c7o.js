viewModel.on("afterMount", () => {
  const filterViewModel = viewModel.getCache("FilterViewModel");
  filterViewModel.on("afterInit", () => {
    filterViewModel
      .get("apply_dept")
      .getFromModel()
      .on("beforeBrowse", function (data) {
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "code", // 字段
          op: "leftlike", // in like...
          value1: "84205"
        });
        this.setTreeFilter(condition); // conditon是你需要拼接的参数
      });
  });
});