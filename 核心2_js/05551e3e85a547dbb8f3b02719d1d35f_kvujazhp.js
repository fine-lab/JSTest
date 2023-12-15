// 选择商品后带出商品编码、型号、价格
viewModel.get("cgrx_check_order_temp_detailList") &&
  viewModel.get("cgrx_check_order_temp_detailList").on("afterCellValueChange", function (data) {
    // 表格-盘点单详情--单元格值改变后
    if (data["cellName"] === "product_id_name") {
      let rowIndex = data["rowIndex"];
      let saleOrgId = viewModel.get("sales_org_id") && viewModel.get("sales_org_id").getValue();
      let agentLevelId = viewModel.get("agent_level_id") && viewModel.get("agent_level_id").getValue();
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
        dimensions: { agentLevelId: agentLevelId, productId: productId }
      };
      cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getAccessToken", {}, function (err, res) {
        product.accessToken = res.access_token;
        cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getCategoryPrice", product, function (err, res) {
          viewModel.get("cgrx_check_order_temp_detailList").setCellValue(rowIndex, "price", res.priceJson.data[0].price);
          console.log(res);
        });
      });
    }
  });