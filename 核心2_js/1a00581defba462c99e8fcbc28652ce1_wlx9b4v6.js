viewModel.on("customInit", function (data) {
  // 晴天学历及网课合同变更--页面初始化
  viewModel.get("gongsimingchen_id").on("beforeBrowse", function () {
    debugger;
    var res = cb.rest.invokeFunction("dedc592d64814259b897d44c1f9300df", { custdoctype: undefined }, function (err, res) {}, viewModel, { async: false });
    var permissions = res.result.res;
    var alldata = res.result.allData;
    if (undefined === alldata) {
      if (permissions.length > 0) {
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        condition.simpleVOs.push({
          field: "zhidanren",
          op: "in",
          value1: permissions
        });
        this.setFilter(condition);
      }
    }
  });
});