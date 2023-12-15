viewModel.on("customInit", function (data) {
  // 商机回款预测--页面初始化
  debugger;
  let viewmodel = this;
  const isNet = viewModel.getParams().parentParams.rowData["headDef!define34"];
  if (isNet != "是") {
    viewModel.get("btnEdit").fireEvent("click");
  }
  let productLineNames = viewModel.getParams().parentParams.billData.opptItemList.map((item) => item.productLine_name);
  var girdModel = viewModel.getGridModel();
  girdModel
    .getEditRowModel()
    .get("productLine_name")
    .on("beforeBrowse", function (data) {
      var condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "name",
        op: "in",
        value1: productLineNames
      });
      this.setFilter(condition);
    });
});
viewModel.on("afterRule", function (event) {
});
viewModel.on("beforeSearch", function (args) {
  debugger;
  const condition = { isExtend: true, simpleVOs: [] };
  condition.simpleVOs.push({
    field: "oppId",
    op: "eq",
    value1: viewModel.getParams().condition.simpleVOs[0].value1
  });
  args.params.condition = condition;
});
viewModel.get("opptmoneyback_1705927543986061315") &&
  viewModel.get("opptmoneyback_1705927543986061315").on("afterCellValueChange", function (data) {
    debugger;
    // 表格--单元格值改变后
    viewModel.getGridModel().setCellValue(data.rowIndex, "oppId", viewModel.getParams().condition.simpleVOs[0].value1);
    if (data.cellName === "forecastBackTime") {
      let signDate = viewModel.getParams().parentParams.billData.expectSignDate;
      let backDate = viewModel.getGridModel().getCellValue(data.rowIndex, data.cellName);
      if (signDate > backDate) {
        cb.utils.alert("预测回款时间不能小于预计签单日期[" + signDate + "]！");
        viewModel.getGridModel().setCellValue(data.rowIndex, "forecastBackTime", "");
      }
    }
  });
viewModel.get("btnBatchSave").on("click", function () {
  //保存前
  debugger;
  let viewModel = this.getParent();
  let result = "否";
  let back = viewModel.get("opptmoneyback_1705927543986061315").getAllData();
  if (back && back.length > 0) result = "是";
  cb.rest.invokeFunction(
    "AT177016BE17B80006.apiFunction.upOpptMoneyBack",
    {
      id: viewModel.getParams().condition.simpleVOs[0].value1,
      define34: result
    },
    function (err, res) {
      let ss;
    }
  );
});