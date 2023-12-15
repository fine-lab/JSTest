//财务落实价格
//材料成本预估
viewModel.on("afterProcessWorkflow", function (args) {
  let clcbyg = viewModel.get("clcbyg");
  debugger;
  if (clcbyg.__data.bShowIt) {
    clcbyg.setState("bIsNull", false);
  } else {
    clcbyg.setState("bIsNull", true);
  }
});
//标准配件/复杂问题
viewModel.on("afterProcessWorkflow", function (args) {
  let bzfz = viewModel.get("bzfz");
  debugger;
  if (bzfz.__data.bShowIt) {
    bzfz.setState("bIsNull", false);
  } else {
    bzfz.setState("bIsNull", true);
  }
});
//处理意见
viewModel.on("afterProcessWorkflow", function (args) {
  let chuliyijian = viewModel.get("chuliyijian");
  let bzfz = viewModel.get("bzfz").getValue();
  debugger;
  if (chuliyijian.__data.bShowIt && bzfz.includes("2")) {
    chuliyijian.setState("bIsNull", false);
  } else {
    chuliyijian.setState("bIsNull", true);
  }
});
//发货材料清单及图纸   20231205字段删除
//方案汇总（上传附件）
viewModel.on("afterProcessWorkflow", function (args) {
  let fahzfj = viewModel.get("fahzfj");
  let bzfz = viewModel.get("bzfz").getValue();
  debugger;
  if (fahzfj.__data.bShowIt && bzfz.includes("2")) {
    fahzfj.setState("bIsNull", false);
  } else {
    fahzfj.setState("bIsNull", true);
  }
});
//包装费
//运费
viewModel.on("afterProcessWorkflow", function (args) {
  let yunfei = viewModel.get("yunfei");
  debugger;
  if (yunfei.__data.bShowIt) {
    yunfei.setState("bIsNull", false);
  } else {
    yunfei.setState("bIsNull", true);
  }
});
//重量
viewModel.on("afterProcessWorkflow", function (args) {
  let zhongliang = viewModel.get("zhongliang");
  debugger;
  if (zhongliang.__data.bShowIt) {
    zhongliang.setState("bIsNull", false);
  } else {
    zhongliang.setState("bIsNull", true);
  }
});
//尺寸
viewModel.on("afterProcessWorkflow", function (args) {
  let chicun = viewModel.get("chicun");
  debugger;
  if (chicun.__data.bShowIt) {
    chicun.setState("bIsNull", false);
  } else {
    chicun.setState("bIsNull", true);
  }
});
//总成本
viewModel.on("afterProcessWorkflow", function (args) {
  let zcb = viewModel.get("zcb");
  debugger;
  if (zcb.__data.bShowIt) {
    zcb.setState("bIsNull", false);
  } else {
    zcb.setState("bIsNull", true);
  }
});
//客户收到货时间
viewModel.on("afterProcessWorkflow", function (args) {
  let khsdhsj = viewModel.get("khsdhsj");
  debugger;
  if (khsdhsj.__data.bShowIt) {
    khsdhsj.setState("bIsNull", false);
  } else {
    khsdhsj.setState("bIsNull", true);
  }
});
//客户安装时间
viewModel.on("afterProcessWorkflow", function (args) {
  let khazsj = viewModel.get("khazsj");
  debugger;
  if (khazsj.__data.bShowIt) {
    khazsj.setState("bIsNull", false);
  } else {
    khazsj.setState("bIsNull", true);
  }
});
//客户更换效果
viewModel.on("afterProcessWorkflow", function (args) {
  let khghxg = viewModel.get("khghxg");
  debugger;
  if (khghxg.__data.bShowIt) {
    khghxg.setState("bIsNull", false);
  } else {
    khghxg.setState("bIsNull", true);
  }
});