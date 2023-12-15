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
viewModel.get("button53li") &&
  viewModel.get("button53li").on("click", function (data) {
    // 复制行--单击
    debugger;
    var gridModel = viewModel.get("competitorsList");
    var rowIndexes = gridModel.getSelectedRowIndexes()[0];
    var datas = gridModel.getSelectedRows();
    var newrow = gridModel.insertRow(rowIndexes + 1, datas[0]);
    gridModel.setState("mergeCells", true);
    gridModel.setColumnState("extend11", "bMergeCol", true);
    gridModel.setColumnState("extend5", "bMergeCol", true);
    gridModel.setColumnState("extend6", "bMergeCol", true);
    gridModel.setColumnState("extend3", "bMergeCol", true);
    gridModel.setColumnState("extend4", "bMergeCol", true);
  });
var gridModel = viewModel.getGridModel("competitorsList");
viewModel.get("item3185hb").on("click", (data) => {
  var datas = gridModel.getRow(data.index);
  var competitorsname = datas.competitorsname;
  var extend4 = datas.extend4;
  var extend5 = datas.extend5;
  var extend6 = datas.extend6;
  var extend8 = datas.extend8;
  var extend7 = datas.extend7;
  var extend9 = datas.extend9;
  var extend10 = datas.extend10;
  var hasDefaultInit = true;
  var _selected = datas._selected;
  var show = datas.show;
  var from = datas.from;
  var extend3 = datas.extend3;
  let aaa = {
    competitorsname: competitorsname,
    extend4: extend4,
    extend5: extend5,
    extend7: extend7,
    extend6: extend6,
    extend8: extend8,
    extend9: extend9,
    extend10: extend10,
    hasDefaultInit: hasDefaultInit,
    _selected: _selected,
    show: show,
    from: from,
    extend3: extend3,
    bMain: false
  };
  gridModel.insertRow(data.index + 1, aaa);
});
viewModel.on("beforeEditrow", (args) => {
  const { index, childrenField } = args?.params?.params || {};
  if (childrenField == "competitorsList") {
    const rowModel = gridModel.getEditRowModel();
    const row = gridModel.getRow(index);
    if (rowModel && !row.bMain) {
      rowModel.get("extend4").setVisible(false);
      rowModel.get("competitorsname").setVisible(false);
      rowModel.get("extend11").setVisible(false);
      rowModel.get("extend3").setVisible(false);
      rowModel.get("extend5").setVisible(false);
      rowModel.get("extend6").setVisible(false);
    } else {
      rowModel.get("extend4").setVisible(true);
      rowModel.get("competitorsname").setVisible(true);
      rowModel.get("extend11").setVisible(true);
      rowModel.get("extend3").setVisible(true);
      rowModel.get("extend5").setVisible(true);
      rowModel.get("extend6").setVisible(true);
    }
  }
});
gridModel.on("beforeInsertRow", (args) => {
  if (cb.utils.isEmpty(args.row.bMain)) args.row.bMain = true;
});
gridModel.on("afterInsertRow", (args) => {
  const rows = gridModel.getRows();
  const cellStates = [];
  rows.forEach((data, index) => {
    if (data.bMain == false) {
      cellStates.push({ rowIndex: index, cellName: "extend4", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "competitorsname", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "extend11", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "extend3", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "extend5", propertyName: "visible", value: false });
      cellStates.push({ rowIndex: index, cellName: "extend6", propertyName: "visible", value: false });
    } else {
      cellStates.push({ rowIndex: index, cellName: "extend4", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "competitorsname", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend11", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend3", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend5", propertyName: "visible", value: true });
      cellStates.push({ rowIndex: index, cellName: "extend6", propertyName: "visible", value: true });
    }
  });
  gridModel.setCellStates(cellStates);
  const rowModel = gridModel.getEditRowModel();
  if (rowModel && !args.row.bMain) {
    rowModel.get("extend4").setVisible(false);
    rowModel.get("competitorsname").setVisible(false);
    rowModel.get("extend11").setVisible(false);
    rowModel.get("extend3").setVisible(false);
    rowModel.get("extend5").setVisible(false);
    rowModel.get("extend6").setVisible(false);
  } else {
    rowModel.get("extend4").setVisible(true);
    rowModel.get("competitorsname").setVisible(true);
    rowModel.get("extend11").setVisible(true);
    rowModel.get("extend3").setVisible(true);
    rowModel.get("extend5").setVisible(true);
    rowModel.get("extend6").setVisible(true);
  }
});