viewModel.on("customInit", function (data) {
  var gridModel = viewModel.getGridModel();
  let change_price_detailList = viewModel.getGridModel("sy01_change_price_detailList");
  gridModel
    .getEditRowModel()
    .get("batchno_batchno")
    .on("beforeBrowse", function () {
      debugger;
      let index = gridModel.getFocusedRowIndex();
      let product = gridModel.getCellValue(index, "product");
      if (product == undefined || product == "") {
        cb.utils.alert("请先选择物料", "error");
      } else {
        var condition = {
          isExtend: true,
          simpleVOs: []
        };
        //是否gsp物料
        condition.simpleVOs.push({
          field: "product",
          op: "eq",
          value1: product
        });
        this.setFilter(condition);
      }
    });
  let getGSPBatchnoID = function (product, batchno) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction1(
        "GT22176AT10.publicFunction.getGSPBatchnoID",
        {
          product: product,
          batchno: batchno
        },
        function (err, res) {
          if (err) {
            cb.utils.alert(err.message, "error");
            reject(err.message);
          } else {
            resolve(res.batchnoRes);
          }
        },
        undefined,
        {
          domainKey: "sy01"
        }
      );
    });
  };
  viewModel.on("afterLoadData", function (data) {
    debugger;
    if (viewModel.getParams().mode == "add") {
      let rowDatas = change_price_detailList.getData();
      for (let i = 0; i < rowDatas.length; i++) {
        var product = change_price_detailList.getCellValue(i, "product");
        var batchno = change_price_detailList.getCellValue(i, "batchno");
        getGSPBatchnoID(product, batchno).then((batchnoRes) => {
          if (batchnoRes.length > 0) {
            change_price_detailList.setCellValue(i, "batchno", batchnoRes[0].id);
            change_price_detailList.setCellValue(i, "batchno_batchno", batchno);
          }
        });
      }
    }
  });
  change_price_detailList.on("afterCellValueChange", function (data) {
    if ((data.cellName == "price" || data.cellName == "qty") && data.value != data.oldValue) {
      let row = change_price_detailList.getFocusedRowIndex();
      let price = change_price_detailList.getCellValue(row, "price");
      let qty = change_price_detailList.getCellValue(row, "qty");
      let include_tax_price = change_price_detailList.getCellValue(row, "include_tax_price");
      let diff_price = price - include_tax_price;
      let total_price = diff_price * qty;
      change_price_detailList.setCellValue(row, "diff_price", diff_price);
      change_price_detailList.setCellValue(row, "total_price", total_price);
    }
  });
});