//更新计划拜访覆盖率
viewModel.on("afterLoadData", function (data) {
  var count = data.chargeTerminalCount > 0 ? (data.terminalCount || 0) / data.chargeTerminalCount : 0;
  viewModel.get("item356ae").setValue(count * 100);
  viewModel.execute("updateViewMeta", { code: "terminaltaskplansapp_remindrule_div", visible: false });
});
//新增行赋值默认t+1
const taskPlanRouteList = viewModel.get("taskPlanRouteList");
taskPlanRouteList.on("afterInsertRow", (args) => {
  var cellvalues = [];
  var startDate = "";
  var endDate = "";
  var idx = "";
  if (args.index == 0) {
    //获取新增行下标
    idx = args.index;
    //表头的开始日期->结束日期
    var startDateFormate = viewModel.get("startDate").getValue() || "2023-02-28";
    startDate = new Date(new Date(startDateFormate.replace(/-/g, "/")).getTime()).format("yyyy-MM-dd");
    endDate = startDate;
    var StartDate = { rowIndex: idx, cellName: "startDate", value: startDate };
    var EndtDate = { rowIndex: idx, cellName: "endDate", value: endDate };
    cellvalues.push(StartDate);
    cellvalues.push(EndtDate);
  } else {
    //获取改变行下标
    idx = args.index;
    //获取上一行数据
    var startRow = taskPlanRouteList.getRow(idx - 1);
    startDate = new Date(new Date(startRow.startDate.replace(/-/g, "/")).getTime() + 24 * 60 * 60 * 1000).format("yyyy-MM-dd");
    endDate = startDate;
    var newRowStartDate = { rowIndex: idx, cellName: "startDate", value: startDate };
    var newRowEndtDate = { rowIndex: idx, cellName: "endDate", value: endDate };
    cellvalues.push(newRowStartDate);
    cellvalues.push(newRowEndtDate);
  }
  //给新增行赋值
  if (cellvalues) {
    taskPlanRouteList.updateRow(idx, { startDate: startDate });
    taskPlanRouteList.updateRow(idx, { endDate: endDate });
  }
});
taskPlanRouteList.on("afterCellValueChange", (args) => {
  //路线数据区--选择后
  //获取修改日期
  var startDate = "";
  if (args.cellName == "startDate") {
    startDate = args.value;
    //获取计划子表
    var rows = taskPlanRouteList.getRows();
    if (rows && rows.length == 0) return;
    //获取修改数据行的下标
    var idx = args.rowIndex;
    rows[idx].startDate = startDate;
    var cellvalues = [];
    rows.forEach((row, index) => {
      if (index > idx) {
        console.log(row, index, idx);
        //获取改动行的开始日期
        //获取改动行数据
        let changeRow = taskPlanRouteList.getRow(idx);
        //计算改动行之后的开始日期
        row.startDate = new Date(new Date(startDate.replace(/-/g, "/")).getTime() + 24 * 60 * 60 * 1000 * (index - idx)).format("yyyy-MM-dd");
        //行数据赋值
        row.endDate = row.startDate;
        var startDateRow = { rowIndex: index, cellName: "startDate", value: row.startDate };
        var endDateRow = { rowIndex: index, cellName: "endDate", value: row.endDate };
        cellvalues.push(startDateRow);
        cellvalues.push(endDateRow);
        if (cellvalues) {
          taskPlanRouteList.updateRow(index, { startDate: row.startDate });
          taskPlanRouteList.updateRow(index, { endDate: row.endDate });
        }
      }
    });
    return;
  }
});