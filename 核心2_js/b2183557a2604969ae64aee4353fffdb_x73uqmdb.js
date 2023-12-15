viewModel.get("button27hk") &&
  viewModel.get("button27hk").on("click", function (data) {
    // 自建下推--单击
    let ywData = {};
    const extendData = {
      businessFlowId: "yourIdHere",
      tenantId: "yourIdHere",
      ruleId: "",
      billnum: "15376bd3",
      sourceDomain: "developplatform",
      targetDomain: "developplatform"
    };
    const params = {
      extendData,
      carryParams: {
        custMap: extendData
      },
      data: JSON.stringify(ywData)
    };
    const cParameter = {
      query: {
        busiObj: "23a63b65",
        serviceCode: ""
      }
    };
    params.cParameter = JSON.stringify(cParameter);
    viewModel.biz.do("bizflowpush", viewModel, params);
  });