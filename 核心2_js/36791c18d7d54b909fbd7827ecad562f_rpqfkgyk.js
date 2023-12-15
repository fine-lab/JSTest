viewModel.on("customInit", function (data) {
  // 订单列表--页面初始化
  let gridModel = viewModel.getGridModel();
  gridModel.on("afterSetDataSource", () => {
    let actionsStates = gridModel.getActionsState();
    let pps = [];
    actionsStates.forEach((actionsState) => {
      let pp = {
        ...actionsState,
        "1671681015608_13": { visible: true },
        "B_singlepushe2643708-6fcb-11ed-9896-6c92bf477043": { visible: false }
      };
      pps.push(pp);
    });
    setTimeout(function () {
      gridModel.setActionsState(pps);
    }, 500);
  });
});
viewModel.get("1671681015608_13") &&
  viewModel.get("1671681015608_13").on("click", function (data) {
    // 自建按钮--单击
    debugger;
    var billNo = viewModel.getParams().billNo;
    var targetBillNo = "116f7cb5MobileArchive";
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
    data.bizFlow = "049a9020-6fcb-11ed-9896-6c92bf477043";
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
        busiObj: "116f7cb5MobileArchive"
      }
    };
    params.cParameter = JSON.stringify(cParameter);
    viewModel.biz.do("singlepush", viewModel, params);
  });