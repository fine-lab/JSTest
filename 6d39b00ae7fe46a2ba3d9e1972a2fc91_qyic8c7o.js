viewModel.get("button13rc") &&
  viewModel.get("button13rc").on("click", function (data) {
    // 确认--单击
    const row = viewModel.getGridModel().getAllData()[data.index];
    if (row.status != "未转移" || !row.status || row.status != "转移已驳回") {
      const obj = {
        //单据类型：VoucherList为列表类型   voucher为卡片类型
        billtype: "VoucherList",
        //单据号
        billno: "yb5741ca10",
        params: {
          // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
          mode: "add",
          reqData: {
            type: "move",
            data: {
              id: row.id,
              mode: "1",
              status: "转移中"
            }
          }
        }
      };
      // 打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", obj, viewModel);
    } else {
      cb.utils.alert("当前已提交审批");
    }
  });
viewModel.get("btnRefresh") &&
  viewModel.get("btnRefresh").on("click", function (data) {
    const selectRows = viewModel.getGridModel().getSelectedRows();
    const resRows = [];
    const insturyRows = [];
    selectRows.forEach((item) => {
      resRows.push({
        id: item.id,
        status: "转移中"
      });
      insturyRows.push({
        id: item.id,
        instury: item.industry,
        projectCode: item.projectCode,
        projectName: item.projectName,
        org_id_name: item.org_id_name,
        industry: item.industry
      });
    });
    if (selectRows.length > 0) {
      const obj = {
        //单据类型：VoucherList为列表类型   voucher为卡片类型
        billtype: "VoucherList",
        //单据号
        billno: "yb5741ca10",
        params: {
          // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
          mode: "add",
          reqData: {
            mode: "1",
            type: "batch",
            insturyRows,
            data: resRows
          }
        }
      };
      // 打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", obj, viewModel);
    } else {
      cb.utils.alert("请先选择数据！");
    }
  });
viewModel.on("modeChange", function (e) {
  if (e == "edit") {
    // 设置cell状态
    viewModel
      .getGridModel()
      .getAllData()
      .forEach((item, index) => {
      });
  }
});
viewModel.get("project_transfer_base_1634237702214778884") &&
  viewModel.get("project_transfer_base_1634237702214778884").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    data.forEach((item, index) => {
      if ((item.status != "未转移" || !item.status) && item.status != "转移已驳回") {
      }
    });
  });
viewModel.on("customInit", function (data) {
  viewModel.getGridModel().setPageSize(200);
  cb.rest.invokeFunction("AT16AD797616380008.API.searchData", {}, function (err, res) {
    if (!err) {
      let yTranster = res.res && Array.isArray(res.res) && res.res.filter((item) => item.status == "已转移");
      let wTranster = res.res && Array.isArray(res.res) && res.res.filter((item) => item.status != "已转移");
      const userId = viewModel.getAppContext().user.userId;
      cb.rest.invokeFunction(
        "AT16AD797616380008.API.getOrgInfo",
        {
          id: userId
        },
        function (err, res) {
          debugger;
        }
      );
    }
  });
});
viewModel.getGridModel().on("cellJointQuery", function (args) {
  const obj = {
    //单据类型：VoucherList为列表类型   voucher为卡片类型
    billtype: "Voucher",
    //单据号
    billno: "yb5bfc037a",
    params: {
      // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
      mode: "browse",
      id: args.row.id, //TODO:填写详情id
      domainKey: "yourKeyHere",
      readOnly: true,
      reqData: {
        type: "batch",
        mode: "3",
        data: args
      }
    }
  };
  // 打开一个单据，并在当前页面显示
  cb.loader.runCommandLine("bill", obj, viewModel);
});
viewModel.get("button15gk") &&
  viewModel.get("button15gk").on("click", function (data) {
    // 按钮--单击
  });