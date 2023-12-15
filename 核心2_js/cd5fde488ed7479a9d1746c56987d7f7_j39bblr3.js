viewModel.on("afterLoadMeta", (args) => {
  const { vm, view } = args;
  cb.cache.set("viewModel", vm);
});
let gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", (args) => {
  let vm = cb.cache.get("viewModel");
  changeNum(vm);
});
viewModel.getGridModel().on("afterCellValueChange", function (event) {
  let { rowIndex, cellName, value, oldValue, childrenField } = event;
  // 主数量赋值||调整含税单价||
  let vm = cb.cache.get("viewModel");
  if (
    event.cellName === "supposedcheckNum" ||
    event.cellName === "ajustPrice" ||
    event.cellName === "ajustTaxprice" ||
    event.cellName === "ajustTaxrate" ||
    event.cellName === "ajustTaxmny" ||
    event.cellName === "puDeductionTaxmny"
  ) {
    changeNum(vm);
  }
});
viewModel.get("button58tg") &&
  viewModel.get("button58tg").on("click", function (data) {
    // 遗留--单击
    debugger;
    let vm = cb.cache.get("viewModel");
    let gridModel = vm.getGridModel();
    let rowData = gridModel.getRow(data.index);
    gridModel.setCellValue(data.index, "isLeave", 1);
    changeNum(vm);
  });
viewModel.get("button76oe") &&
  viewModel.get("button76oe").on("click", function (data) {
    // 取消遗留--单击
    debugger;
    let vm = cb.cache.get("viewModel");
    let gridModel = vm.getGridModel();
    let rowData = gridModel.getRow(data.index);
    gridModel.setCellValue(data.index, "isLeave", 0);
    changeNum(vm);
  });
function changeNum(vm) {
  debugger;
  let allRowsData = vm.getGridModel().getAllData();
  let puNum = 0;
  let leaveNum = 0;
  let puTaxmny = 0;
  let ajustTaxmny = 0;
  let leaveTaxmny = 0;
  let actualNum = 0;
  allRowsData.map((item, index) => {
    debugger;
    if (item.isLeave === 1) {
      // 总遗留数量
      leaveNum += item.supposedcheckNum;
      // 总遗留含税额 = 数量*调整含税金额(遗留的)
      leaveTaxmny += item.supposedcheckNum * item.ajustTaxprice;
    }
    // 总数量
    puNum += item.supposedcheckNum;
    //应对含税金额 = 应对数量*调整含税单价
    item.puTaxmny = item.supposedcheckNum * item.ajustTaxprice;
    vm.getGridModel().setCellValue(index, "puTaxmny", item.puTaxmny);
    //总应对含税金额
    puTaxmny += item.puTaxmny;
    //！！应对税额！！= 应对含税金额 * 调整税率
    item.supposedcheckTaxmny = item.puTaxmny * item.ajustTaxrate * 0.01;
    vm.getGridModel().setCellValue(index, "supposedcheckTaxmny", item.supposedcheckTaxmny);
    // 总扣款含税金额 = 采购扣款含税金额汇总
    ajustTaxmny += item.puDeductionTaxmny * item.supposedcheckNum;
  });
  // 总实对数量
  actualNum = puNum - leaveNum < 0 ? 0 : puNum - leaveNum;
  // 总实对含税金额 = 总应对含税金额 - 总遗留含税额
  actualTaxmny = puTaxmny - leaveTaxmny;
  //数据回写
  vm.get("puNum").setData(puNum);
  vm.get("leaveNum").setData(leaveNum);
  vm.get("actualNum").setData(actualNum);
  vm.get("puTaxmny").setData(puTaxmny);
  vm.get("leaveTaxmny").setData(leaveTaxmny);
  vm.get("ajustTaxmny").setData(ajustTaxmny);
  vm.get("actualTaxmny").setData(actualTaxmny);
}