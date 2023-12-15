viewModel.get("button70la") &&
  viewModel.get("button70la").on("click", function (data) {
    // 存量查询--单击
    var gridModel = viewModel.getGridModel("childs");
    var rows = gridModel.getRows();
    //现存量查询
    var countNum = new Map(); //现存量数据，格式为：{物料主键：{仓库主键：现存量}}
    var warehouseList = new Array(); //不参与现存量的仓库
    let numData = cb.rest.invokeFunction("SQ.backDesignerFunction.queryCountNum", {}, function (err, res) {}, viewModel, { async: false });
    if (numData.error) {
      cb.utils.alert(numData.error.message);
      return false;
    } else if (numData.result.code != 200) {
      cb.utils.alert(numData.result.message);
      return false;
    } else {
      countNum = numData.result.numMap;
      warehouseList = numData.result.warehouseList;
    }
    //现存量赋值
    if (JSON.stringify(countNum) != "{}") {
      for (var i = 0; i < rows.length; i++) {
        if (countNum[rows[i].productId] != undefined) {
          let warehouseMap = countNum[rows[i].productId];
          let num = 0;
          let curNum = 0; //现存量
          let avaNum = 0; //可用量
          if (rows[i].stockId != undefined) {
            //发货仓库不为空
            let typeMap = warehouseMap[rows[i].stockId];
            gridModel.setCellValue(i, "frees!define1", typeMap["currentqty"]);
            gridModel.setCellValue(i, "frees!define2", typeMap["availableqty"]);
          } else {
            //发货仓库为空
            for (var key in warehouseMap) {
              let typeMap = warehouseMap[key];
              if (warehouseList.length > 0) {
                //存在不参与现存量的仓库
                if (warehouseList.indexOf(key) < 0) {
                  curNum = curNum + Number(typeMap["currentqty"]);
                  avaNum = avaNum + Number(typeMap["availableqty"]);
                }
              } else {
                curNum = curNum + Number(typeMap["currentqty"]);
                avaNum = avaNum + Number(typeMap["availableqty"]);
              }
            }
            gridModel.setCellValue(i, "frees!define1", curNum);
            gridModel.setCellValue(i, "frees!define2", avaNum);
          }
        } else {
          gridModel.setCellValue(i, "frees!define1", null);
          gridModel.setCellValue(i, "frees!define2", null);
        }
      }
    }
  });
viewModel.get("childs").on("afterCellValueChange", function (data) {
  // 商品编码--值改变
  var gridModel = viewModel.getGridModel("childs");
  let index = data.rowIndex;
  gridModel.setCellValue(index, "frees!define1", null);
  gridModel.setCellValue(index, "frees!define2", null);
});