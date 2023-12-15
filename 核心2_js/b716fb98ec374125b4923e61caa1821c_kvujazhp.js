viewModel.get("sales_org_id_name") &&
  viewModel.get("sales_org_id_name").on("afterValueChange", function (data) {
    // 所属销售组织--值改变后
    cetateName();
  });
viewModel.get("agent_level_id_name") &&
  viewModel.get("agent_level_id_name").on("afterValueChange", function (data) {
    // 客户级别--值改变后
    cetateName();
  });
viewModel.get("check_date") &&
  viewModel.get("check_date").on("afterValueChange", function (data) {
    // 盘点日期--值改变后
    cetateName();
  });
// 商品参照按销售组织过滤
viewModel.get("cgrx_check_order_temp_detailList") &&
  viewModel.get("cgrx_check_order_temp_detailList").getEditRowModel() &&
  viewModel.get("cgrx_check_order_temp_detailList").getEditRowModel().get("product_id_name") &&
  viewModel
    .get("cgrx_check_order_temp_detailList")
    .getEditRowModel()
    .get("product_id_name")
    .on("beforeBrowse", function (data) {
      // 商品名称--参照弹窗打开前
      let condition = {
        isExtend: true,
        simpleVOs: []
      };
      condition.simpleVOs.push({
        field: "productId.productApplyRange.orgId",
        op: "eq",
        value1: viewModel.get("sales_org_id").getValue()
      });
      this.setFilter(condition);
    });
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
        cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getProductPrice", product, function (err, res) {
          viewModel.get("cgrx_check_order_temp_detailList").setCellValue(rowIndex, "price", res.priceJson.data[0].price);
          console.log(res);
        });
      });
    }
  });
function cetateName() {
  let checkDate = viewModel.get("check_date") && viewModel.get("check_date").getValue();
  let year = checkDate.substring(0, 4);
  let month = checkDate.substring(5, 7);
  let saleOrgName = viewModel.get("sales_org_id_name") && viewModel.get("sales_org_id_name").getValue();
  let agentLevelName = viewModel.get("agent_level_id_name") && viewModel.get("agent_level_id_name").getValue();
  if (saleOrgName !== null && agentLevelName != null) {
    let name = year + "年" + month + "月" + saleOrgName + agentLevelName + "盘点单模板";
    viewModel.get("name").setValue(name);
  }
}