viewModel.on("customInit", function (data) {
  var viewModel = this;
  let currentRow = viewModel.getParams().currentRow;
  let batchNo = currentRow.batchNo;
  let prodId = currentRow.productId;
  let prodCode = currentRow.productId;
  let prodName = currentRow.product_Name;
  let childId = currentRow.id;
  let finishedReportId = currentRow.finishedReportId;
  let gridModel = viewModel.getGridModel();
  gridModel.on("beforeSetDataSource", function (data) {
    //处理JS单线程，异步问题
    if (!viewModel.getCache("isSelfExecute")) {
      viewModel.setCache("isSelfExecute", true);
      cb.rest.invokeFunction(
        "PO.afterFunction.getProInspAppl",
        {
          childId: childId,
          finishedReportId: finishedReportId,
          prodId: prodId,
          batchNo: batchNo
        },
        function (err, res) {
          debugger;
          if (err) {
            cb.utils.alert(err.message, "error");
            return false;
          } else if (res.proInspApplRes.length > 0 && res.proInspApplMRes.length > 0) {
            var result = [];
            for (let i = 0; i < res.proInspApplMRes.length; i++) {
              for (let j = 0; j < res.proInspApplRes.length; j++) {
                if ((res.proInspApplRes[j].parent_id = res.proInspApplMRes[i].id)) {
                  result.push({
                    prodInspect: res.proInspApplMRes[i].code,
                    productCode: prodCode,
                    productName: prodName,
                    batchNo: batchNo,
                    attachment: res.proInspApplRes[j].attachmentId
                  });
                }
              }
            }
            gridModel.setState("dataSourceMode", "local"); // 确保是local模式
            gridModel.setDataSource(result);
            viewModel.clearCache("isSelfExecute");
            return false;
          }
        }
      );
    }
  });
});