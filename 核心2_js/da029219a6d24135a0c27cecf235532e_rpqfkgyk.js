viewModel.on("customInit", function (data) {
  // 订单列表--页面初始化
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", () => {
    setTimeout(function () {
      let actionsStates = gridModel.getActionsState();
      let pps = [];
      actionsStates.forEach((actionsState) => {
        let pp = {
          ...actionsState,
          "B_singlepush669a92b0-23f4-11ed-9896-6c92bf477043": { visible: false },
          "B_singlepush87211113-252e-11ed-9896-6c92bf477043": { visible: false },
          "B_singlepush4eb09754-2492-11ed-9896-6c92bf477043": { visible: false },
          item400kh: { visible: true },
          item1172bf: { visible: true },
          "B_singlepush26b8a3ec-2493-11ed-9896-6c92bf477043": { visible: false }
        };
        pps.push(pp);
      });
      gridModel.setActionsState(pps);
    }, 1000);
  });
  //销售订单下推预埋线发货申请单-mobile     B_singlepush87211113-252e-11ed-9896-6c92bf477043
  viewModel.get("item400kh") &&
    viewModel.get("item400kh").on("click", function (data) {
      // 自建按钮--单击
      debugger;
      var billNo = viewModel.getParams().billNo;
      var targetBillNo = "9f9131d6MobileArchive";
      var targetDomain = "developplatform";
      if (cb.rest.interMode === "mobile") {
        // 这里修改为移动的 billNo
        billNo = targetBillNo;
      }
      const gridModel = viewModel.getGridModel();
      const selectRowIndex = gridModel.getFocusedRowIndex();
      data = gridModel.getRow(selectRowIndex);
      let param = {
        billtype: "YYArchive", //YYArchive
        billno: billNo,
        params: { mode: "add" } // (编辑态、新增态、浏览态)
      };
      const extendData = {
        businessFlowId: "yourIdHere",
        tenantId: "yourIdHere",
        ruleId: "yourIdHere",
        billnum: viewModel.getParams().billNo,
        sourceDomain: "udinghuo",
        targetDomain: "developplatform"
      };
      data.bizFlow = "871dc1e3-252e-11ed-9896-6c92bf477043";
      const params = {
        extendData,
        cHttpMethod: "POST",
        cSvcUrl: `bizflow/batchPush?code=${targetDomain}&groupCode=${viewModel.getParams().billNo}2${targetBillNo}&targetBillNo=${targetBillNo}&domain=${targetDomain}`,
        carryParams: {
          custMap: extendData,
          data: [data]
        },
        params: { index: selectRowIndex }
      };
      const cParameter = {
        query: {
          busiObj: "9f9131d6MobileArchive"
        }
      };
      params.cParameter = JSON.stringify(cParameter);
      viewModel.biz.do("singlepush", viewModel, params);
    });
  //销售订单下推施工图图纸申请-mobile  item1172bf   B_singlepush669a92b0-23f4-11ed-9896-6c92bf477043
  viewModel.get("item1172bf") &&
    viewModel.get("item1172bf").on("click", function (data) {
      // 自建按钮--单击
      debugger;
      var billNo = viewModel.getParams().billNo;
      var targetBillNo = "b06f316aMobileArchive";
      var targetDomain = "developplatform";
      if (cb.rest.interMode === "mobile") {
        // 这里修改为移动的 billNo
        billNo = targetBillNo;
      }
      const gridModel = viewModel.getGridModel();
      const selectRowIndex = gridModel.getFocusedRowIndex();
      data = gridModel.getRow(selectRowIndex);
      let param = {
        billtype: "YYArchive",
        billno: billNo,
        params: { mode: "add" } // (编辑态、新增态、浏览态)
      };
      const extendData = {
        businessFlowId: "yourIdHere",
        tenantId: "yourIdHere",
        ruleId: "yourIdHere",
        billnum: viewModel.getParams().billNo,
        sourceDomain: "udinghuo",
        targetDomain: "developplatform"
      };
      data.bizFlow = "4b8f8027-2492-11ed-9896-6c92bf477043";
      const params = {
        extendData,
        cHttpMethod: "POST",
        cSvcUrl: `bizflow/batchPush?code=${targetDomain}&groupCode=${viewModel.getParams().billNo}2${targetBillNo}&targetBillNo=${targetBillNo}&domain=${targetDomain}`,
        carryParams: {
          custMap: extendData,
          data: [data]
        },
        params: { index: selectRowIndex }
      };
      const cParameter = {
        query: {
          busiObj: "b06f316aMobileArchive"
        }
      };
      params.cParameter = JSON.stringify(cParameter);
      viewModel.biz.do("singlepush", viewModel, params);
    });
});