viewModel.on("afterMount", function (data) {
  //获取查询区模型
  let filterViewModelInfo = viewModel.getCache("FilterViewModel");
  filterViewModelInfo.on("afterInit", function (data) {
    //获取参照模型
    let filterModelInfo = filterViewModelInfo.get("org_id");
    let realModelInfo = filterModelInfo.getFromModel();
    realModelInfo.on("beforeBrowse", function () {
      let result = cb.rest.invokeFunction("GT39696AT9.authManager.powerOrgs", {}, function (err, res) {}, viewModel, { async: false });
      console.log("result", JSON.stringify(result));
      var myFilter = { isExtend: true, simpleVOs: [] };
      myFilter.simpleVOs.push({
        field: "id",
        op: "in",
        value1: result.result.res
      });
      //设置过滤条件
      realModelInfo.setTreeFilter(myFilter);
    });
  });
});