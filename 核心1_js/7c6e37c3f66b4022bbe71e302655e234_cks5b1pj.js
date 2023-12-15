var gridModel = viewModel.getGridModel(); //获取表格模型
viewModel.get("button14uf") &&
  viewModel.get("button14uf").on("click", function (data) {
    //批改--单击
  });
viewModel.get("button15uk") &&
  viewModel.get("button15uk").on("click", function (data) {
    //增行--单击
    gridModel.appendRow({});
  });
viewModel.get("button16uc") &&
  viewModel.get("button16uc").on("click", function (data) {
    //删行--单击
    let rowIndexes = gridModel.getSelectedRowIndexes();
    gridModel.deleteRows(rowIndexes);
  });
viewModel.get("button19ug") &&
  viewModel.get("button19ug").on("click", function (data) {
    //复制行--单击
    let copyRow = gridModel.getRow(data.index);
    gridModel.appendRow(copyRow);
  });
viewModel.get("button20vd") &&
  viewModel.get("button20vd").on("click", function (data) {
    //插入行--单击
    gridModel.insertRow(data.index, {});
  });
viewModel.get("button21ve") &&
  viewModel.get("button21ve").on("click", function (data) {
    //删行--单击
    gridModel.deleteRows([data.index]);
  });
viewModel.get("ipoRiskListList") &&
  viewModel.get("ipoRiskListList").on("beforeSetDataSource", function (data) {
    //表格1--设置数据源前
  });
viewModel.on("beforeSave", function (args) {
  var param = JSON.parse(args.data.data);
  var guanlianzhuti = param.guanlianzhuti;
  var treeName = "";
  if (guanlianzhuti == 1) {
    treeName = "关联交易";
  } else if (guanlianzhuti == 2) {
    treeName = "资金分析";
  } else if (guanlianzhuti == 3) {
    treeName = "收入分析";
  } else if (guanlianzhuti == 4) {
    treeName = "利润分析";
  } else if (guanlianzhuti == 5) {
    treeName = "资产分析";
  } else if (guanlianzhuti == 6) {
    treeName = "负债分析";
  } else if (guanlianzhuti == 7) {
    treeName = "成本费用";
  } else if (guanlianzhuti == 8) {
    treeName = "客户与供应商";
  }
  param.guanlianzhutisousuoshu = treeName;
  args.data.data = JSON.stringify(param);
});
// 列表点击新增前事件
viewModel.on("beforeAdd", function (args) {});
viewModel.get("guanlianzhuti") &&
  viewModel.get("guanlianzhuti").on("afterValueChange", function (data) {
    //关联主题--值改变后
  });