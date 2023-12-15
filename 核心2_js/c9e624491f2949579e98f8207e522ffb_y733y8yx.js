//设置保存前校验
// 采购订单--单击
viewModel.get("button76qc") &&
  viewModel.get("button76qc").on("click", function (data) {
    // 获取单击行号
    let currentLine = data.index;
    // 当前点击的那一行
    let currentRowData = viewModel.get("othOutRecords").getRow(currentLine);
    // 分类编码
    // 当前行物料id
    let product = currentRowData.product;
    if (product == undefined) {
      cb.utils.alert("请选择物料!", "error");
      return false;
    }
    let dataTest = {
      billtype: "VoucherList",
      billno: "023ff1b8",
      domainKey: "yourKeyHere",
      params: {
        mode: "browse",
        currentLine: currentLine, // 当前行下标
        product: product, //当前行物料id
        page: "othOutRecords" //当前页面子实体集合属性
      }
    };
    // 打开一个单据，并在当前页面显示
    cb.loader.runCommandLine("bill", dataTest, viewModel);
  });