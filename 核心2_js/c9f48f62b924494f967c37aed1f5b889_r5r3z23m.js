viewModel.on("customInit", function (data) {
  // 盘点计划--页面初始化
});
viewModel.get("button87qd") &&
  viewModel.get("button87qd").on("click", function (data) {
    let orgId = viewModel.get("stockOrg").getValue(); //组织id
    let warehouse = viewModel.get("warehouse").getValue(); //仓库id
    // 取货位--单击
    var gridModel = viewModel.get("details");
    //获取表格当前页面所有的行数据
    const rowAllDatas = gridModel.getRows();
    if (rowAllDatas == 0) {
      cb.utils.alert("请选择表体行数据");
      return;
    }
    let arrData = []; //存储每页的结果
    let pageSize = 500; //每页数量
    let rowSize = rowAllDatas.length;
    let totalNum = Math.ceil(rowSize / pageSize); //总分页
    let productConditions = "";
    let productConditionsArr = []; //存储生成条件的数组
    if (rowAllDatas[rowSize - 1].product == undefined || rowAllDatas[rowSize - 1].product == null) {
      delete rowAllDatas[rowSize - 1]; //移除最后一行空数据
      rowSize = rowSize - 1;
    }
    for (let i = 0; i < rowSize; i++) {
      if (rowAllDatas[i].product == undefined || rowAllDatas[i].product == null) {
        let currentRowPage = i + 1; //页面显示的表格行数据
        cb.utils.alert("第" + currentRowPage + "行没有选择物料");
        return;
      }
      //当前存储数据的数组下标
      let currentBottom = i >= pageSize ? parseInt(i / pageSize) : 0;
      if ((i + 1) % pageSize != 1 && rowAllDatas[i].product) {
        productConditions = productConditions + ", '" + rowAllDatas[i].product + "'";
      } else if (rowAllDatas[i].product) {
        productConditions = productConditions + "'" + rowAllDatas[i].product + "'";
      }
      productConditionsArr.push(rowAllDatas[i]); //将数据添加到条件数组中
      if (((i + 1) % pageSize == 0 && currentBottom < Math.ceil(rowSize / pageSize)) || i == rowSize - 1) {
        arrData[currentBottom] = { condition: productConditions, arr: productConditionsArr };
        productConditions = "";
        productConditionsArr = [];
      }
    }
    for (let i = 0; i < arrData.length; i++) {
      cb.rest.invokeFunction("ST.api.getShelvesName", { _orgId: orgId, _productConditions: arrData[i].condition }, function (err, res) {
        if (err) {
          cb.utils.alert("生成货位失败，请联系管理员。");
          cb.utils.alert(err.message);
          return;
        }
        let currentResPageCondition = arrData[i].arr; //生成当前返回数据的数组
        let resultResponse = res.res; //响应结果
        for (let x = 0; x < currentResPageCondition.length; x++) {
          //拼装key值
          let resultKey = orgId + warehouse + currentResPageCondition[x].product;
          if (resultResponse.hasOwnProperty(resultKey)) {
            let useProductInfo = resultResponse[resultKey]; //当前行要使用的物料信息
            let baseIndex = i == 0 ? 0 : i * pageSize; //每次分页初始编号
            let rowNo = x + baseIndex; //行号
            gridModel.setCellValue(rowNo, "defines!define1", useProductInfo.shelvesName); //赋值货位Name
          }
        }
      });
    }
  });
viewModel.get("details") &&
  viewModel.get("details").getEditRowModel() &&
  viewModel.get("details").getEditRowModel().get("extend_shelvesName") &&
  viewModel
    .get("details")
    .getEditRowModel()
    .get("extend_shelvesName")
    .on("blur", function (data) {
      // 货位名称--失去焦点的回调
    });