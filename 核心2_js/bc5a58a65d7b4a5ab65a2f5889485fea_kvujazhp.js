// 更新数据
viewModel.get("button19wj").on("click", function () {
  let allData = viewModel.getGridModel().getAllData();
  let detailList = [];
  allData.forEach((item) => {
    detailList.push({
      id: item.id,
      product_name: item.product_id_name,
      _status: "Update"
    });
  });
  let newData = {
    billNo: "0939a757",
    id: viewModel.get("id").getValue(),
    cgrx_check_order_temp_detailList: detailList
  };
  cb.rest.invokeFunction("GT6923AT3.checkOrderBe.updHisData", newData, function (err, res) {
    console.log(res);
    viewModel.execute("refresh");
  });
  console.log(newData);
});
viewModel.get("sales_org_id_name") &&
  viewModel.get("sales_org_id_name").on("afterValueChange", function (data) {
    // 所属销售组织--值改变后
    // 设置模板名称
    cetateName();
  });
viewModel.get("agent_level_id_name") &&
  viewModel.get("agent_level_id_name").on("afterValueChange", function (data) {
    // 客户级别--值改变后
    // 设置模板名称
    cetateName();
  });
viewModel.get("check_date") &&
  viewModel.get("check_date").on("afterValueChange", function (data) {
    if (data.value.length > 7) {
      viewModel.get("check_date").setValue(data.value.substring(0, 7));
    }
    // 盘点日期--值改变后
    // 设置模板名称
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
      // 设置参照过滤条件：按照销售组织过滤
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
      // 查询商品价格
      cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getAccessToken", {}, function (err, res) {
        product.accessToken = res.access_token;
        cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getProductPrice", product, function (err, res) {
          let price = res && res.priceJson && res.priceJson.data && res.priceJson.data[0] && res.priceJson.data[0].price;
          viewModel.get("cgrx_check_order_temp_detailList").setCellValue(rowIndex, "price", res.priceJson.data[0].price);
          console.log(res);
        });
      });
    }
  });
// 设置模板名称
function cetateName() {
  let checkDate = viewModel.get("check_date") && viewModel.get("check_date").getValue();
  let saleOrgName = viewModel.get("sales_org_id_name") && viewModel.get("sales_org_id_name").getValue();
  let agentLevelName = viewModel.get("agent_level_id_name") && viewModel.get("agent_level_id_name").getValue();
  if (saleOrgName !== null && agentLevelName != null && checkDate != null) {
    let year = checkDate.substring(0, 4);
    let month = checkDate.substring(5, 7);
    let name = year + "年" + month + "月" + saleOrgName + agentLevelName + "盘点单模板";
    viewModel.get("name").setValue(name);
  }
}