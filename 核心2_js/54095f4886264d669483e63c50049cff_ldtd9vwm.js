// 更新数据
viewModel.get("button25zg").on("click", function () {
  let allData = viewModel.getGridModel("cgrx_sf_productList").getAllData();
  let code = viewModel.get("code").getValue();
  let checkDate = viewModel.get("check_date").getValue();
  let agentName = viewModel.get("customer_id_name").getValue();
  let detailList = [];
  allData.forEach((item) => {
    let customerList = [];
    item.cgrx_sf_p_customerList &&
      item.cgrx_sf_p_customerList.forEach((customer) => {
        customerList.push({
          id: customer.id,
          sales_flow_code: code,
          agent_name: agentName,
          check_date: checkDate,
          _status: "Update"
        });
      });
    detailList.push({
      id: item.id,
      agent_name: agentName,
      cgrx_sf_p_customerList: customerList,
      _status: "Update"
    });
  });
  let newData = {
    billNo: "70612855",
    id: viewModel.get("id").getValue(),
    cgrx_sf_productList: detailList
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
    // 新增态设置【客户】信息
    let customerId = cb.rest.AppContext.globalization.docId ? cb.rest.AppContext.globalization.docId : "";
    let customerName = cb.rest.AppContext.globalization.docName ? cb.rest.AppContext.globalization.docName : "";
    viewModel.get("customer_id") && viewModel.get("customer_id").setValue(customerId);
    viewModel.get("customer_id_name") && viewModel.get("customer_id_name").setValue(customerName);
  } else if (mode.toLocaleLowerCase() === "edit") {
    // 编辑态重新计算数量
    getEditProduct();
  }
});
// 保存后事件
viewModel.on("afterSave", function (data) {
  // 保存后更新【销向客户信息-流向单号】字段
  let newProduct = [];
  data.res.cgrx_sf_productList &&
    data.res.cgrx_sf_productList.forEach((product) => {
      let newCustomer = [];
      product.cgrx_sf_p_customerList &&
        product.cgrx_sf_p_customerList.forEach((customer) => {
          newCustomer.push({
            id: customer.id,
            sales_flow_code: data.res.code,
            _status: "Update"
          });
        });
      newProduct.push({
        id: product.id,
        _status: "Update",
        cgrx_sf_p_customerList: newCustomer
      });
    });
  var params = {
    id: data.res.id,
    cgrx_sf_productList: newProduct
  };
  cb.rest.invokeFunction("GT6923AT3.checkOrderBe.updFlowData", params, function (err, res) {
    console.log(res);
    viewModel.execute("refresh");
  });
});
viewModel.get("sales_org_id_name") &&
  viewModel.get("sales_org_id_name").on("afterValueChange", function (data) {
    getProduct();
  });
viewModel.get("check_date") &&
  viewModel.get("check_date").on("afterValueChange", function (data) {
    if (data.value.length > 7) {
      viewModel.get("check_date").setValue(data.value.substring(0, 7));
    }
    getProduct();
  });
viewModel.get("customer_id_name") &&
  viewModel.get("customer_id_name").on("afterValueChange", function (data) {
    getProduct();
  });
viewModel.get("cgrx_sf_p_customerList").on("afterInsertRow", function (data) {
  // 设置【总代名称】【月份】信息
  let agentName = viewModel.get("customer_id_name") && viewModel.get("customer_id_name").getValue();
  let checkDate = viewModel.get("check_date") && viewModel.get("check_date").getValue();
  viewModel.getGridModel("cgrx_sf_p_customerList").setCellValue(data.index, "agent_name", agentName);
  viewModel.getGridModel("cgrx_sf_p_customerList").setCellValue(data.index, "check_date", checkDate);
});
viewModel.get("cgrx_sf_p_customerList") &&
  viewModel.get("cgrx_sf_p_customerList").on("afterCellValueChange", function (data) {
    if (data["cellName"] === "sale_quantity") {
      calculateAmount();
    }
  });
function getProduct() {
  let customerName = viewModel.get("customer_id_name") && viewModel.get("customer_id_name").getValue();
  let customerId = viewModel.get("customer_id") && viewModel.get("customer_id").getValue();
  let salesOrgId = viewModel.get("sales_org_id") && viewModel.get("sales_org_id").getValue();
  let checkDate = viewModel.get("check_date") && viewModel.get("check_date").getValue();
  if (customerId && salesOrgId && checkDate) {
    let year = checkDate.substring(0, 4);
    let month = checkDate.substring(5, 7);
    let data = {
      customerId: customerId,
      salesOrgId: salesOrgId,
      year: year,
      month: month
    };
    cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getAccessToken", {}, function (err, res) {
      data.accessToken = res.access_token;
      cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getCheckOrder", data, function (err, res) {
        viewModel.get("cgrx_sf_productList").deleteAllRows();
        let detailData = [];
        res.orderData.forEach((item, index) => {
          viewModel.get("cgrx_sf_productList").insertRow(index, {
            agent_name: customerName,
            product_id: item.product_id,
            product_id_name: item.product_name,
            product_code: item.product_code,
            product_name: item.product_name,
            product_model: item.product_model,
            begin_quantity: item.begin_quantity,
            add_quantity: item.add_quantity,
            over_check_quantity: item.over_check_quantity,
            _status: "Insert"
          });
        });
        calculateAmount();
      });
    });
  }
}
// 点击编辑按钮后更新【销售商品信息】
function getEditProduct() {
  let customerName = viewModel.get("customer_id_name") && viewModel.get("customer_id_name").getValue();
  let customerId = viewModel.get("customer_id") && viewModel.get("customer_id").getValue();
  let salesOrgId = viewModel.get("sales_org_id") && viewModel.get("sales_org_id").getValue();
  let checkDate = viewModel.get("check_date") && viewModel.get("check_date").getValue();
  if (customerId !== null && salesOrgId !== null && checkDate !== null) {
    let year = checkDate.substring(0, 4);
    let month = checkDate.substring(5, 7);
    let data = {
      customerId: customerId,
      salesOrgId: salesOrgId,
      year: year,
      month: month
    };
    cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getAccessToken", {}, function (err, res) {
      data.accessToken = res.access_token;
      cb.rest.invokeFunction("GT6923AT3.checkOrderBe.getCheckOrder", data, function (err, res) {
        if (res.orderData) {
          let detailData = [];
          let productList = viewModel.getGridModel("cgrx_sf_productList").getAllData();
          res.orderData.forEach((item) => {
            let flag = true;
            productList.forEach((product) => {
              if (product.product_id === item.product_id) {
                (product.agent_name = customerName), (product.begin_quantity = item.begin_quantity);
                product.over_check_quantity = item.over_check_quantity;
                (product.add_quantity = item.add_quantity), (product._status = "Update");
                detailData.push(product);
                flag = false;
                return;
              }
            });
            if (flag) {
              detailData.push({
                agent_name: customerName,
                product_id: item.product_id,
                product_id_name: item.product_name,
                product_code: item.product_code,
                product_name: item.product_name,
                product_model: item.product_model,
                begin_quantity: item.begin_quantity,
                add_quantity: item.add_quantity,
                over_check_quantity: item.over_check_quantity,
                _status: "Insert"
              });
            }
          });
          viewModel.getGridModel("cgrx_sf_productList").setState("dataSourceMode", "local");
          viewModel.getGridModel("cgrx_sf_productList").setDataSource(detailData);
          calculateAmount();
        }
      });
    });
  }
}
// 计算数量
function calculateAmount() {
  // 获取【销售商品信息】
  let productList = viewModel.getGridModel("cgrx_sf_productList").getAllData();
  productList.forEach((product, index) => {
    let sumNumber = 0;
    // 获取【销向客户信息】
    let customerList = product.cgrx_sf_p_customerList;
    if (customerList) {
      // 计算当前商品的【销向数量】合计
      customerList.forEach((customer) => {
        let sale_quantity = customer.sale_quantity ? customer.sale_quantity : 0;
        sumNumber += sale_quantity;
      });
    }
    // 更新【销售商品信息】数量信息
    let begin_quantity = product.begin_quantity ? product.begin_quantity : 0;
    let add_quantity = product.add_quantity ? product.add_quantity : 0;
    let over_quantity = begin_quantity + add_quantity - sumNumber;
    viewModel.getGridModel("cgrx_sf_productList").setCellValue(index, "sell_quantity", sumNumber);
    viewModel.getGridModel("cgrx_sf_productList").setCellValue(index, "over_quantity", over_quantity);
    viewModel.getGridModel("cgrx_sf_productList").setCellValue(index, "diff_quantity", over_quantity - product.over_check_quantity);
  });
}