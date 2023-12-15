viewModel.on("afterLoadData", (args) => {
  debugger;
  let parentBillNo = viewModel.getCache("parentViewModel")?.getParams()?.billNo;
  if ("sfa_opptcard" == parentBillNo || "oppt_stagesub" == parentBillNo) {
    let opptData = viewModel.getCache("parentViewModel")?.getData();
    if (cb.rest.interMode == "mobile") {
      opptData = viewModel.getCache("parentViewModel")?.getCache("parentViewModel")?.getData();
    }
    if (viewModel.getParams().mode == "add") {
      viewModel.get("oppt")?.setValue(opptData?.name);
      viewModel.get("stage")?.setValue(opptData?.opptStage_name);
    } else {
      cb.rest.invokeFunction(
        "AT18A244420A280006.frontDesignerFunction.opptapi123",
        {
          oppt: opptData.id,
          stage: opptData.processStage
        },
        function (err, res) {
          args = res;
          viewModel.loadData(args);
        },
        viewModel,
        { async: true, domainKey: "yourKeyHere" }
      );
    }
  }
});
viewModel.on("modeChange", (args) => {});
viewModel.on("afterEdit", (args) => {
});
viewModel.on("beforeSave", (args) => {
  debugger;
  let data = JSON.parse(args.data.data);
  // 来源商机
  let parentBillNo = viewModel.getCache("parentViewModel")?.getParams()?.billNo;
  if (("sfa_opptcard" == parentBillNo || "oppt_stagesub" == parentBillNo) && viewModel.getParams().mode == "add") {
    if (!data.id) {
      data._status = "Insert";
    }
    let opptData = viewModel.getCache("parentViewModel")?.getData();
    if (cb.rest.interMode == "mobile") {
      opptData = viewModel.getCache("parentViewModel")?.getCache("parentViewModel")?.getData();
    }
    data.oppt = opptData?.id;
    data.stage = opptData?.processStage;
  }
  args.data.data = JSON.stringify(data);
});
viewModel.on("afterSave", (args) => {
  autoOpptRelate(args.res, "save");
});
viewModel.on("afterAudit", (args) => {
  autoOpptRelate(args.res, "audit");
  viewModel.getCache("parentViewModel")?.execute("refresh");
});
let autoOpptRelate = (res, realAction) => {
  var proxy = viewModel.setProxy({
    accept: {
      url: "/bill/exec/opptStagePromote4ProjectComplete",
      method: "POST",
      options: { async: false, domainKey: "yourKeyHere" }
    }
  });
  let params = {
    billnum: "sfa_opptcard",
    data: JSON.stringify({
      customerOpenFlag: "customerOpenFlag",
      realAction: realAction,
      relateObjectType: viewModel.getParams().billNo, //传单据卡片billNo
      id: res.id,
      oppt: res.oppt
    })
  };
  return proxy.accept(params, function (err, result) {
    return result;
  });
};