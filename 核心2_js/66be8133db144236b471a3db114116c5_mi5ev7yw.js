viewModel.on("customInit", function (data) {
  let rowInfor = viewModel.getParams().rowInfor;
  let batchNo = rowInfor.batchno;
  let prodCode = rowInfor.product;
  let gridModel = viewModel.getGridModel();
  gridModel.on("beforeSetDataSource", function (data) {
    viewModel.getGridModel().clear();
    alert(123);
    //处理JS单线程，异步问题
    if (!viewModel.getCache("isSelfExecute")) {
      viewModel.setCache("isSelfExecute", true);
      cb.rest.invokeFunction("ISY_2.rule.getInserpFile", { prodCode: prodCode, batchNo: batchNo }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        } else if (res.mainRes.length > 0) {
          var result = [];
          for (let i = 0; i < res.mainRes.length; i++) {
            result.push({
              product_code: rowInfor.product,
              batchNo: res.mainRes[j].batchNo,
              qualityReport: res.mainRes[j].qualityReport
            });
          }
          gridModel.setState("dataSourceMode", "local"); // 确保是local模式
          gridModel.setDataSource(result);
          viewModel.clearCache("isSelfExecute");
          return false;
        }
      });
    }
  });
});