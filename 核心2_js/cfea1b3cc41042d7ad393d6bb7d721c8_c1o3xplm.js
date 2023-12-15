viewModel.get("button110ch") &&
  viewModel.get("button110ch").on("click", function (data) {
    // 点击查询物料列表--单击
    debugger;
    //获取选中行数据信息
    var gridModel = viewModel.getGridModel("orderDetails");
    var list = gridModel.__data.dataSource;
    if (list.length > 0) {
      for (var j = 0; j < list.length; j++) {
        // 获取数据下标
        const indexArr = gridModel.getSelectedRowIndexes();
        var oriSum = "oriSum";
        var grid = "youridHere";
        // 遍历
        for (var i = 0; i < indexArr.length; i++) {
          // 获取某一行数据下标
          var row = indexArr[i];
          var RowData = gridModel.getRowsByIndexes(row);
          // 物料id
          var productID = list[j].productId;
          // 物料名称
          var productNAME = list[j].productName;
          // 传递给被打开页面的数据信息
          var yy = {
            billtype: "VoucherList", // 单据类型
            billno: "a2538794", // 单据号
            domainKey: "yourKeyHere",
            params: {
              mode: "browse", // (编辑态edit、新增态add、浏览态browse)
              //传参
              productID: productID,
              productNAME: productNAME,
              row: row,
              oriSum: oriSum,
              grid: grid
            }
          };
        }
      }
    } else {
    }
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", yy, viewModel);
  });
viewModel.get("button155qj") &&
  viewModel.get("button155qj").on("click", function (data) {
    // 查询当前物料信息--单击
    debugger;
    //获取选中行数据信息
    var gridModel = viewModel.getGridModel("orderDetails");
    var currRowData = gridModel.getRow(data.index);
    var yy = {
      billtype: "VoucherList", // 单据类型
      billno: "a2538794", // 单据号
      domainKey: "yourKeyHere",
      params: {
        mode: "browse", // (编辑态edit、新增态add、浏览态browse)
        //传参
        productID: currRowData.productId,
        productNAME: currRowData.productName,
        row: data.index,
        grid: "youridHere"
      }
    };
    //打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", yy, viewModel);
  });