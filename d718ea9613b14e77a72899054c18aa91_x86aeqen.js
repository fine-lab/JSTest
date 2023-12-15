viewModel.getGridModel().setPageSize(1000);
viewModel.getGridModel().on("beforeSetDataSource", function (data) {
  //表格--设置数据源前
  let tempDatas = {};
  if (data) {
    data.map((rowData) => {
      let deptMessage = tempDatas[rowData.deptId];
      if (deptMessage) {
        deptMessage.staffName = deptMessage.staffName + "," + rowData.staffName;
      } else {
        tempDatas[rowData.deptId] = rowData;
      }
    });
    data.length = 0;
    data.push(...Object.values(tempDatas));
  }
});