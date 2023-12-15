viewModel.on("customInit", function (data) {
  const gridModelInfo = viewModel.getGridModel("SY01_medrefuse_lList");
  viewModel.on("afterLoadData", function () {
    debugger;
    const value = viewModel.get("shangyoudanjuhao").getValue();
    let gridModelInfo = viewModel.gridModel("SY01_medrefuse_lList").getRows();
    for (let i = 0; i < gridModelInfo.length; i++) {
      let batchno = gridModelInfo[i].lot_num;
      change_price_detailList.setCellValue(i, "lot_num", batch_no);
    }
    if (value != undefined) {
      gridModelInfo.setColumnState("materialNo_code", "bCanModify", false);
      gridModelInfo.setColumnState("extend_standard_code", "bCanModify", false);
      gridModelInfo.setColumnState("shangshixukeren_ip_name", "bCanModify", false);
      gridModelInfo.setColumnState("jixing_dosagaFormName", "bCanModify", false);
      gridModelInfo.setColumnState("refuseQty", "bCanModify", false);
      gridModelInfo.setColumnState("zhujiliang_name", "bCanModify", false);
      gridModelInfo.setColumnState("cangku_name", "bCanModify", false);
      gridModelInfo.setColumnState("packingMaterial_packing_name", "bCanModify", false);
    }
  });
  gridModelInfo
    .getEditRowModel()
    .get("lot_num_batchno")
    .on("beforeBrowse", function () {
      let index = gridModelInfo.getFocusedRowIndex();
      let product = gridModelInfo.getCellValue(index, "materialNo");
      let warehouse = gridModelInfo.getCellValue(index, "cangku");
      if (warehouse == undefined || warehouse == null || warehouse == "") {
        cb.utils.alert("请先选择仓库", "error");
        return false;
      }
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
        condition.simpleVOs.push({
          field: "warehouse",
          op: "eq",
          value1: warehouse
        });
        this.setFilter(condition);
      }
    });
  viewModel.on("beforeSave", function (data) {
    return;
    let sourceBillNo = viewModel.get("source_id").getValue(); //上游单据主表ID
    let refusetype = viewModel.get("refusetype").getValue(); //拒收类型
    let upChildBillId = [];
    if (refusetype == 1) {
      let refuseObj = {};
      for (var i = 0; i < gridModelInfo.getRows().length; i++) {
        let sourcechildId = gridModelInfo.getCellValue(i, "sourcechild_id");
        refuseObj[sourcechildId] = gridModelInfo.getCellValue(i, "refuseQty");
        if (gridModelInfo.getCellValue(i, "refuseQty") < 0) {
          cb.utils.alert("拒收数量不能小于0");
          return false;
        }
      }
      var promise = new cb.promise();
      cb.rest.invokeFunction(
        "GT22176AT10.backDefaultGroup.reject_qty_verify",
        {
          sourceBillNo: sourceBillNo,
          refusetype: refusetype,
          refuseObj: refuseObj
        },
        function (err, res) {
          console.log("33333333333");
          console.log(res);
          console.log(res.errInfo);
          if (typeof res.errInfo !== "undefined") {
            if (res.errInfo.length > 0) {
              cb.utils.alert(res.errInfo);
              promise.reject();
            } else {
              promise.resolve();
            }
          }
        }
      );
    }
    return promise;
  });
});