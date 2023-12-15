viewModel.on("customInit", function (data) {
  // 采购任务列表--页面初始化
  viewModel.on("beforeBatchpush", function (data) {
    console.log(JSON.stringify(data));
    debugger;
    let cCommand = data.args.cCommand;
    let datas = data.params.data;
    let cgfsArray = [];
    let dxys = [];
    let ysxm = [];
    for (var i3 = 0; i3 < datas.length; i3++) {
      let singleBudgetApplyid = datas[i3]["singleBudgetApplyid_code"];
      let reqUapProjectId = datas[i3]["reqUapProjectId_name"];
      singleBudgetApplyid = singleBudgetApplyid ? singleBudgetApplyid : "";
      reqUapProjectId = reqUapProjectId ? reqUapProjectId : "";
      if (!dxys.includes(singleBudgetApplyid)) {
        dxys.push(singleBudgetApplyid);
      }
      if (!ysxm.includes(reqUapProjectId)) {
        ysxm.push(reqUapProjectId);
      }
    }
    if (dxys.length > 1) {
      cb.utils.alert("不同单项预算的需求不能合并发布，请重新选择！");
      return false;
    }
    if (ysxm.length > 1) {
      cb.utils.alert("不同预算项目的需求不能合并发布，请重新选择！");
      return false;
    }
    //生成合同
    if (cCommand == "cmdDirectCtMdd") {
      for (var i2 = 0; i2 < datas.length; i2++) {
        let cgfs = datas[i2]["defines!define27"];
        let cgxf = datas[i2]["defines!define28"];
        if ((cgfs == "询价采购" || cgfs == "竞价采购" || cgfs == "招标采购") && cgxf == "线上") {
          cb.utils.alert("采购方式为“询价采购”、“竞价采购”或“招标采购”并且采购细分为“线上”的需求不能直接生成合同，请选择发布询价！");
          return false;
        }
      }
    }
    return true;
  });
  viewModel.on("beforeSinglePush", function (data) {
    debugger;
    let cCommand = data.args.cCommand;
    let datas = data.params.data;
    let dxys = [];
    let ysxm = [];
    for (var i3 = 0; i3 < datas.length; i3++) {
      let singleBudgetApplyid = datas[i3]["singleBudgetApplyid_code"];
      let reqUapProjectId = datas[i3]["reqUapProjectId_name"];
      singleBudgetApplyid = singleBudgetApplyid ? singleBudgetApplyid : "";
      reqUapProjectId = reqUapProjectId ? reqUapProjectId : "";
      if (!dxys.includes(singleBudgetApplyid)) {
        dxys.push(singleBudgetApplyid);
      }
      if (!ysxm.includes(reqUapProjectId)) {
        ysxm.push(reqUapProjectId);
      }
    }
    if (dxys.length > 1) {
      cb.utils.alert("不同单项预算的需求不能合并发布，请重新选择！");
      return false;
    }
    if (ysxm.length > 1) {
      cb.utils.alert("不同预算项目的需求不能合并发布，请重新选择！");
      return false;
    }
    return true;
  });
});