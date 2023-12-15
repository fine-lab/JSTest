viewModel.on("afterLoadData", function (data) {
  // 盘点单详情--页面初始化
  let customerId = cb.rest.AppContext.globalization.docId ? cb.rest.AppContext.globalization.docId : "";
  let customerName = cb.rest.AppContext.globalization.docName ? cb.rest.AppContext.globalization.docName : "";
  viewModel.get("customer_id") && viewModel.get("customer_id").setValue(customerId);
  viewModel.get("customer_id_name") && viewModel.get("customer_id_name").setValue(customerName);
});
viewModel.get("sf_p_customerList").on("afterSetDataSource", function (data) {
  viewModel
    .get("sf_p_customerList")
    .getAllData()
    .forEach((item, index) => {
      let status = item.customer_category === "2";
      viewModel.getGridModel("sf_p_customerList").setCellState(index, "city", "readOnly", !status);
      viewModel.getGridModel("sf_p_customerList").setCellState(index, "linkman", "readOnly", !status);
      viewModel.getGridModel("sf_p_customerList").setCellState(index, "contact_way", "readOnly", !status);
    });
});
// 表格-销向客户信息-增行后事件
viewModel.get("sf_p_customerList").on("afterInsertRow", function (data) {
  viewModel.getGridModel("sf_p_customerList").setCellState(data.index, "city", "readOnly", true);
  viewModel.getGridModel("sf_p_customerList").setCellState(data.index, "linkman", "readOnly", true);
  viewModel.getGridModel("sf_p_customerList").setCellState(data.index, "contact_way", "readOnly", true);
});
// 表格-销向客户信息--单元格值改变后
viewModel.get("sf_p_customerList") &&
  viewModel.get("sf_p_customerList").on("afterCellValueChange", function (data) {
    if (data["cellName"] === "customer_category") {
      let rowIndex = data["rowIndex"];
      let status = data.value.value === "2";
      viewModel.getGridModel("sf_p_customerList").setCellState(rowIndex, "city", "readOnly", !status);
      viewModel.getGridModel("sf_p_customerList").setCellState(rowIndex, "linkman", "readOnly", !status);
      viewModel.getGridModel("sf_p_customerList").setCellState(rowIndex, "contact_way", "readOnly", !status);
    }
  });
// 保存前校验-商品的出库数量与销向数量
viewModel.on("beforeSave", function (data) {
  let msg = [];
  let allData = viewModel.getAllData();
  let productList = allData.sf_productList;
  productList.forEach((product) => {
    let productName = product.product_id_name;
    let sellQuantity = product.sell_quantity;
    let customerList = product.sf_p_customerList;
    let sumNumber = 0;
    customerList.forEach((customer) => {
      sumNumber += customer.sale_quantity;
    });
    if (sellQuantity !== sumNumber) {
      msg.push("商品【" + productName + "】的出库数量与销向数量不一致，请修改！");
    }
  });
  if (msg.length > 0) {
    cb.utils.alert(msg.join("\r\n"), "error");
    return false;
  }
});