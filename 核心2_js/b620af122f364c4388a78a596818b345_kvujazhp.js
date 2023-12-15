// 更新数据
viewModel.get("button22wj").on("click", function () {
  let allData = viewModel.getGridModel().getAllData();
  let checkDate = viewModel.get("check_date").getValue();
  let detailList = [];
  allData.forEach((item) => {
    detailList.push({
      id: item.id,
      check_date: checkDate,
      product_name: item.product_id_name,
      _status: "Update"
    });
  });
  let newData = {
    billNo: "1883dd8c",
    id: viewModel.get("id").getValue(),
    cgrx_check_order_detailList: detailList
  };
  cb.rest.invokeFunction("GT6923AT3.checkOrderBe.updHisData", newData, function (err, res) {
    console.log(res);
    viewModel.execute("refresh");
  });
  console.log(newData);
});
// 页面状态改变事件
viewModel.on("modeChange", (mode) => {
  // 门户端禁止修改【客户】字段
  if (viewModel.getParams().query.type === "portal") {
    viewModel.get("customer_id_name").setDisabled(true);
  } else {
    viewModel.get("customer_id_name").setDisabled(false);
  }
  if (mode.toLocaleLowerCase() === "add") {
    debugger;
    // 新增态设置【客户】信息
    let customerId = cb.rest.AppContext.user.docId ? cb.rest.AppContext.user.docId : "";
    viewModel.get("customer_id") && viewModel.get("customer_id").setValue(customerId);
  }
});
viewModel.get("check_date") &&
  viewModel.get("check_date").on("afterValueChange", function (data) {
    if (data.value.length > 7) {
      viewModel.get("check_date").setValue(data.value.substring(0, 7));
    }
  });
viewModel.get("check_order_temp_name") &&
  viewModel.get("check_order_temp_name").on("afterValueChange", function (data) {
    viewModel.get("cgrx_check_order_detailList").deleteAllRows();
    if (data.value && data.value.id) {
      cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getTempData", { id: data.value.id }, function (err, res) {
        console.log(res);
        res.checkOrderDetail.forEach((item, index) => {
          let checkDate = res.checkOrder && res.checkOrder[0].check_date;
          viewModel.get("check_date").setValue(checkDate.substring(0, 7));
          viewModel.get("cgrx_check_order_detailList").insertRow(index, {
            check_date: checkDate,
            product_id: item.product_id,
            product_id_name: item.product_name,
            product_code: item.product_code,
            product_name: item.product_name,
            product_model: item.product_model,
            price: item.price,
            total_amount: 0.0,
            _status: "Insert"
          });
        });
      });
    }
  });
viewModel.get("customer_id_name") &&
  viewModel.get("customer_id_name").on("beforeBrowse", function (data) {
    let condition = {
      isExtend: true,
      simpleVOs: []
    };
    condition.simpleVOs.push({
      field: "merchantAppliedDetail.merchantApplyRangeId.orgId",
      op: "eq",
      value1: viewModel.get("sales_org_id").getValue()
    });
    this.setFilter(condition);
  });
viewModel.get("cgrx_check_order_detailList") &&
  viewModel.get("cgrx_check_order_detailList").getEditRowModel() &&
  viewModel.get("cgrx_check_order_detailList").getEditRowModel().get("product_id_name") &&
  viewModel
    .get("cgrx_check_order_detailList")
    .getEditRowModel()
    .get("product_id_name")
    .on("beforeBrowse", function (data) {
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "productId.productApplyRange.orgId",
        op: "eq",
        value1: viewModel.get("sales_org_id").getValue()
      });
      condition.simpleVOs.push({
        field: "productSKUDetail.ustatus",
        op: "eq",
        value1: 1
      });
      this.setFilter(condition);
    });
viewModel.get("cgrx_check_order_detailList") &&
  viewModel.get("cgrx_check_order_detailList").on("afterCellValueChange", function (data) {
    // 选择商品后带出商品编码、型号、价格
    if (data["cellName"] === "product_id_name") {
      let rowIndex = data["rowIndex"];
      viewModel.get("cgrx_check_order_detailList").setCellValue(rowIndex, "check_date", viewModel.get("check_date").getValue());
      let saleOrgId = viewModel.get("sales_org_id") && viewModel.get("sales_org_id").getValue();
      let agentId = viewModel.get("customer_id") && viewModel.get("customer_id").getValue();
      let checkDate = viewModel.get("check_date") && viewModel.get("check_date").getValue();
      let productId = data["value"]["productId"];
      let product = {
        dateTime: checkDate,
        saleOrgId: saleOrgId,
        quantity: 1,
        billnum: "voucher_order",
        isTaxIncluded: "true",
        amountUnit: "",
        currency: { id: "youridHere" },
        dimensions: { agentId: agentId, productId: productId }
      };
      cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getAccessToken", {}, function (err, res) {
        product.accessToken = res.access_token;
        cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getProductPrice", product, function (err, res) {
          let price = res && res.priceJson && res.priceJson.data && res.priceJson.data[0] && res.priceJson.data[0].price;
          viewModel.get("cgrx_check_order_detailList").setCellValue(rowIndex, "price", price);
          console.log(res);
        });
      });
    }
  });