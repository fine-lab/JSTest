viewModel.get("button53zb") &&
  viewModel.get("button53zb").on("click", function (data) {
    // 复制行--单击
    debugger;
    var gridModel = viewModel.get("competitorList");
    var rowIndexes = gridModel.getSelectedRowIndexes()[0];
    var datas = gridModel.getSelectedRows();
    var newrow = gridModel.insertRow(rowIndexes + 1, datas[0]);
    gridModel.setState("mergeCells", true);
    gridModel.setColumnState("extend7_name", "bMergeCol", true);
    gridModel.setColumnState("extend8", "bMergeCol", true);
    gridModel.setColumnState("extend3", "bMergeCol", true);
    gridModel.setColumnState("extend4", "bMergeCol", true);
  });
viewModel.get("website") &&
  viewModel.get("website").on("afterValueChange", function (data) {
    // 网址--值改变后
    cb.utils.crmCommonFn.pcRepeat.cardCheckRepeat(viewModel, "edit", "cust_customerCard");
  });
viewModel.get("creditCode") &&
  viewModel.get("creditCode").on("afterValueChange", function (data) {
    // 统一社会信用代码--值改变后
    var a = cb.utils.crmCommonFn.pcRepeat.cardCheckRepeat(viewModel, "edit", "cust_customerCard");
  });
viewModel.get("email") &&
  viewModel.get("email").on("afterValueChange", function (data) {
    // 邮箱--值改变后
    cb.utils.crmCommonFn.pcRepeat.cardCheckRepeat(viewModel, "edit", "cust_customerCard");
  });
var gridModel1 = viewModel.getGridModel("competitorList");
viewModel.get("item3220ae").on("click", (data) => {
  var datas = gridModel1.getRow(data.index);
  var extend8 = datas.extend8;
  var extend7 = datas.extend7;
  var extend7_name = datas.extend7_name;
  var competitor_cgzb = datas.competitor_cgzb;
  var extend4 = datas.extend4;
  var extend5 = datas.extend5;
  var extend6 = datas.extend6;
  var extend3 = datas.extend3;
  var hasDefaultInit = true;
  var _selected = datas._selected;
  var show = datas.show;
  var from = datas.from;
  let aaa = {
    extend4: extend4,
    extend5: extend5,
    extend7: extend7,
    extend7_name: extend7_name,
    extend6: extend6,
    extend8: extend8,
    competitor_cgzb: competitor_cgzb,
    hasDefaultInit: hasDefaultInit,
    _selected: _selected,
    show: show,
    from: from,
    extend3: extend3,
    bMain: false
  };
  gridModel1.insertRow(data.index + 1, aaa);
});
viewModel.on("beforeEditrow", (args) => {
  const { index, childrenField } = args?.params?.params || {};
  if (childrenField == "competitorList") {
    const rowModel = gridModel1.getEditRowModel();
    const row = gridModel1.getRow(index);
    if (rowModel && !row.bMain) {
      rowModel.get("extend4").setVisible(false);
      rowModel.get("competitor_cgzb").setVisible(false);
      rowModel.get("extend7").setVisible(false);
      rowModel.get("extend7_name").setVisible(false);
      rowModel.get("extend3").setVisible(false);
      rowModel.get("extend8").setVisible(false);
    } else {
      rowModel.get("extend4").setVisible(true);
      rowModel.get("competitor_cgzb").setVisible(true);
      rowModel.get("extend7").setVisible(true);
      rowModel.get("extend7_name").setVisible(true);
      rowModel.get("extend3").setVisible(true);
      rowModel.get("extend8").setVisible(true);
      rowModel.get("extend5").setVisible(true);
      rowModel.get("extend6").setVisible(true);
    }
  }
});
gridModel1.on("beforeInsertRow", (args) => {
  if (cb.utils.isEmpty(args.row.bMain)) args.row.bMain = true;
});
gridModel1.on("afterInsertRow", (args) => {
  const rows = gridModel1.getRows();
  const cellStates = [];
  rows.forEach((data, index) => {
    if (data.bMain == false) {
      cellStates.push({ rowIndex: index, cellName: "extend4", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "competitor_cgzb", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "extend3", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "extend7", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "extend7_name", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "extend8", propertyName: "visible", value: false });
    } else {
      cellStates.push({ rowIndex: index, cellName: "extend4", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "competitor_cgzb", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend3", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend5", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend6", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend7", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend7_name", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend8", propertyName: "visible", value: true });
    }
  });
  gridModel1.setCellStates(cellStates);
  const rowModel = gridModel1.getEditRowModel();
  if (rowModel && !args.row.bMain) {
    rowModel.get("extend4").setVisible(false);
    rowModel.get("competitor_cgzb").setVisible(false);
    rowModel.get("extend3").setVisible(false);
    rowModel.get("extend7").setVisible(false);
    rowModel.get("extend7_name").setVisible(false);
    rowModel.get("extend8").setVisible(false);
  } else {
    rowModel.get("extend4").setVisible(true);
    rowModel.get("competitor_cgzb").setVisible(true);
    rowModel.get("extend7").setVisible(true);
    rowModel.get("extend7_name").setVisible(true);
    rowModel.get("extend8").setVisible(true);
    rowModel.get("extend3").setVisible(true);
    rowModel.get("extend5").setVisible(true);
    rowModel.get("extend6").setVisible(true);
  }
});