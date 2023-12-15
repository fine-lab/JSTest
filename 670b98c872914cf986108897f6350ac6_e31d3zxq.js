viewModel.on("customInit", function (data) {
  let gridModel = viewModel.getGridModel();
  viewModel.on("afterMount", function (data) {
    //去掉取消，确定按钮
    document.getElementById("gspCurrentStockPop|btnModalConfirm").addEventListener("click", function () {
      let selectedRows = gridModel.getSelectedRows();
      if (selectedRows.length == 0) {
        cb.utils.alert("至少选择一条数据", "error");
        return;
      }
      let row = selectedRows[0];
      let orgId = row["org"];
      let orgName = row["org_name"];
      for (let i = 1; i < selectedRows.length; i++) {
        if (selectedRows[i].org != orgId) {
          cb.utils.alert("请选择相同组织", "error");
          return;
        }
      }
      let type = viewModel.getParams().distributionType;
      let typeDictionary = {
        disqualification: "3837a6e9",
        reportloss: "c2d5f5ea"
      };
      let billData = {
        billtype: "Voucher",
        billno: typeDictionary[type],
        params: {
          mode: "add",
          orgId: orgId,
          orgName: orgName,
          selectData: selectedRows
        }
      };
      cb.loader.runCommandLine("bill", billData, viewModel.getCache("parentViewModel"));
      viewModel.communication({ type: "modal", payload: { data: false } }); //关闭模态框
    });
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    //查询区afterInit事件，必须放在页面模型的afterMount事件中才生效
    filterViewModelInfo.on("afterInit", function (data) {
      filterViewModelInfo
        .get("warehouse")
        .getFromModel()
        .on("beforeBrowse", function () {
          let value1 = filterViewModelInfo.get("org").getFromModel().getValue();
          if (value1 == undefined) {
            cb.utils.alert("请选择组织", "error");
            return false;
          }
          //主要代码
          var condition = {
            isExtend: true,
            simpleVOs: []
          };
          condition.simpleVOs.push({
            field: "org",
            op: "eq",
            value1: value1
          });
          //设置过滤条件
          this.setFilter(condition);
        });
    });
  });
  gridModel.on("afterSetDataSource", function (data) {
    gridModel.deleteAllRows();
    let org = viewModel.getCache("FilterViewModel").get("org").getFromModel().getValue();
    let warehouse = viewModel.getCache("FilterViewModel").get("warehouse").getFromModel().getValue();
    let stockstate = viewModel.getCache("FilterViewModel").get("stockstate").getFromModel().getValue();
    if (warehouse == undefined || org == undefined) {
      cb.utils.alert("请选择组织和仓库", "error");
      return;
    }
    let productIds = viewModel.getCache("FilterViewModel").get("product_code").getFromModel().getValue();
    getCurrentStock(org, warehouse, stockstate, productIds).then(
      (res) => {
        gridModel.insertRows(0, res);
      },
      (err) => {
        cb.utils.alert(err, "error");
      }
    );
  });
  let getCurrentStock = function (org, warehouse, stockstate, productIds) {
    return new Promise(function (resolve, reject) {
      cb.rest.invokeFunction("GT22176AT10.backDefaultGroup.getCurrentStock", { org: org, warehouse: warehouse, stockstate: stockstate, productIds: productIds }, function (err, res) {
        if (res != undefined) {
          resolve(res.currentStockList);
        } else if (err !== null) {
          reject(err.message);
        }
      });
    });
  };
  viewModel.get("button0he").on("click", function (data) {
    let type = viewModel.getParams().distributionType;
    let typeDictionary = {
      disqualification: "3837a6e9",
      reportloss: "c2d5f5ea"
    };
    let billData = {
      billtype: "Voucher",
      billno: typeDictionary[type],
      params: {
        mode: "add",
        orgId: orgId,
        orgName: orgName,
        selectData: gridModel.getRows()
      }
    };
    cb.loader.runCommandLine("bill", billData, viewModel);
  });
});