viewModel.on("customInit", function (data) {
  let rowInfor = viewModel.getParams().rowInfor;
  let batchNo = rowInfor.batchNo;
  let prodCode = rowInfor.material;
  let prodName = rowInfor.item132yh;
  let gridModel = viewModel.getGridModel();
  gridModel.on("beforeSetDataSource", function (data) {
    //处理JS单线程，异步问题
    if (!viewModel.getCache("isSelfExecute")) {
      viewModel.setCache("isSelfExecute", true);
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.getInstockTestAtt", { prodCode: prodCode, batchNo: batchNo }, function (err, res) {
        if (err) {
          cb.utils.alert(err.message, "error");
          return false;
        } else if (res.subRes.length > 0 && res.mainRes.length > 0) {
          var result = [];
          for (let i = 0; i < res.mainRes.length; i++) {
            for (let j = 0; j < res.subRes.length; j++) {
              if (res.subRes[j].SY01_purinstockysv2_id == res.mainRes[i].id) {
                result.push({
                  inStockCheckCode: res.mainRes[i].code,
                  prodCode: rowInfor.material_code,
                  prodName: prodName,
                  batchNo: batchNo,
                  attachment: res.subRes[j].enclosure
                });
              }
            }
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