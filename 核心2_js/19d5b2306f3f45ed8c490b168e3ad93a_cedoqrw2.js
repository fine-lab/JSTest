var gridModel = viewModel.getGridModel();
gridModel.on("afterSetDataSource", (data) => {
  // 表格区域--设置数据源前
  debugger;
  if (data.length > 0) {
    data.forEach((da, index) => {
      if (da.buyofferStatus == "24") {
        document.querySelector("div[id='youridHere" + index + "_textCell']").querySelector("div[class='public_fixedDataTableCell_cellContent']").innerHTML =
          '<div title="已生成合同" textheight="textheight" class="textCol" style="height: 35px; padding: 4px 10px; line-height: 28px; width: 99px;"><div title="已定标" style="line-height: 18px; white-space: normal; width: 100%;"><div>已生成合同</div></div></div>';
      }
    });
  }
});