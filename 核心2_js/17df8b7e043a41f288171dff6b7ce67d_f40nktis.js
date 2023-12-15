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
          item1166ke: { visible: true },
          item1547cj: { visible: false },
          item404jj: { visible: true },
          item785re: { visible: true }
        };
        pps.push(pp);
      });
      gridModel.setActionsState(pps);
    }, 1000);
  });
  //销售订单下推预埋线发货申请单-mobile
  viewModel.get("item404jj") &&
    viewModel.get("item404jj").on("click", function (data) {
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
      data.bizFlow = "cacd17e8-290e-11ed-9896-6c92bf477043";
      const params = {
        extendData,
        cHttpMethod: "POST",
        cSvcUrl: `bizflow/batchPush?code=${targetDomain}&groupCode=${viewModel.getParams().billNo}2${targetBillNo}&targetBillNo=${targetBillNo}&domain=${targetDomain}`,
        carryParams: {
          custMap: extendData,
          data: [{ id: data.id }]
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
  //销售订单下推施工图图纸申请-mobile
  viewModel.get("item785re") &&
    viewModel.get("item785re").on("click", function (data) {
      // 自建按钮--单击
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
      data.bizFlow = "cad049e1-290e-11ed-9896-6c92bf477043";
      const params = {
        extendData,
        cHttpMethod: "POST",
        cSvcUrl: `bizflow/batchPush?code=${targetDomain}&groupCode=${viewModel.getParams().billNo}2${targetBillNo}&targetBillNo=${targetBillNo}&domain=${targetDomain}`,
        carryParams: {
          custMap: extendData,
          data: [{ id: data.id }]
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
  //销售订单下推装修指导申请-mobile
  viewModel.get("item1166ke") &&
    viewModel.get("item1166ke").on("click", function (data) {
      // 自建按钮--单击
      debugger;
      var billNo = viewModel.getParams().billNo;
      var targetBillNo = "957fc45aMobileArchive";
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
      data.bizFlow = "cad2e2cf-290e-11ed-9896-6c92bf477043";
      const params = {
        extendData,
        cHttpMethod: "POST",
        cSvcUrl: `bizflow/batchPush?code=${targetDomain}&groupCode=${viewModel.getParams().billNo}2${targetBillNo}&targetBillNo=${targetBillNo}&domain=${targetDomain}`,
        carryParams: {
          custMap: extendData,
          data: [{ id: data.id }]
        },
        params: { index: selectRowIndex }
      };
      const cParameter = {
        query: {
          busiObj: "957fc45aMobileArchive"
        }
      };
      params.cParameter = JSON.stringify(cParameter);
      viewModel.biz.do("singlepush", viewModel, params);
    });
  //销售订单下推形态转换单-mobile
  viewModel.get("item1547cj") &&
    viewModel.get("item1547cj").on("click", function (data) {
      // 自建按钮--单击
      var billNo = viewModel.getParams().billNo;
      var targetBillNo = "st_morphologyconversion";
      var targetDomain = "ustock";
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
      data.bizFlow = "cac5068e-290e-11ed-9896-6c92bf477043";
      const params = {
        extendData,
        cHttpMethod: "POST",
        cSvcUrl: `bizflow/batchPush?code=${targetDomain}&groupCode=${viewModel.getParams().billNo}2${targetBillNo}&targetBillNo=${targetBillNo}&domain=${targetDomain}`,
        carryParams: {
          custMap: extendData,
          data: [{ id: data.id }]
        },
        params: { index: selectRowIndex }
      };
      const cParameter = {
        query: {
          busiObj: "st_morphologyconversion"
        }
      };
      params.cParameter = JSON.stringify(cParameter);
      viewModel.biz.do("singlepush", viewModel, params);
    });
});