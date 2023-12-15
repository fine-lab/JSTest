let configurationList = viewModel.get("traceabilityConfigurationList2List");
//目前控制单据有：采购入库，销售出库，其他入库，其他出库，添加其他单据提示不在范围内
let billListName = ["采购入库", "销售出库", "其他出库", "其他入库"];
configurationList.on("afterCellValueChange", function (data) {
  if (data.cellName === "billName_name") {
    let isBill = false;
    for (let i = 0; i < billListName.length; i++) {
      if (billListName[i] === data.value.name) {
        isBill = true;
        break;
      }
    }
    if (!isBill) {
      cb.utils.confirm(
        "当前单据类型 [" + data.value.name + "] 不在UDI扫码管理范围内!",
        () => {
        },
        () => {
        }
      );
      configurationList.setCellValue(data.rowIndex, "billName", null);
      configurationList.setCellValue(data.rowIndex, "billName_name", null);
      return;
    }
    //判断是否已经添加过
    let rowNum = configurationList.getRows();
    if (rowNum.length === 0) {
      return;
    }
    for (let i = 0; i < rowNum.length - 1; i++) {
      //判断是否添加过
      if (rowNum[i].billName_name === data.value.name) {
        configurationList.setCellValue(data.rowIndex, "billName", null);
        configurationList.setCellValue(data.rowIndex, "billName_name", null);
        cb.utils.confirm(
          "当前单据类型 [" + data.value.name + "] 已经存在!",
          () => {
          },
          () => {
          }
        );
        return;
      }
    }
  }
});