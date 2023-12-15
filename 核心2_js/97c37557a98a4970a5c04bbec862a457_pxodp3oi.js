viewModel.get("wentidalei") &&
  viewModel.get("wentidalei").on("afterValueChange", function (data) {
    wtChangeHandle();
  });
function wtChangeHandle() {
  let wentidalei = viewModel.get("wentidalei").getValue();
  if (wentidalei.includes("1")) {
    let shengchanwentifuzeren_nameObj = viewModel.get("shengchanwentifuzeren_name");
    shengchanwentifuzeren_nameObj.setVisible(true);
  } else {
    let shengchanwentifuzeren_nameObj = viewModel.get("shengchanwentifuzeren_name");
    shengchanwentifuzeren_nameObj.setVisible(false);
  }
  if (wentidalei.includes("2")) {
    let jishuwentifzr_nameObj = viewModel.get("jishuwentifzr_name");
    jishuwentifzr_nameObj.setVisible(true);
  } else {
    let jishuwentifzr_nameObj = viewModel.get("jishuwentifzr_name");
    jishuwentifzr_nameObj.setVisible(false);
  }
  if (wentidalei.includes("3")) {
    let xianchanggaizaofzr_nameObj = viewModel.get("xianchanggaizaofzr_name");
    xianchanggaizaofzr_nameObj.setVisible(true);
  } else {
    let xianchanggaizaofzr_nameObj = viewModel.get("xianchanggaizaofzr_name");
    xianchanggaizaofzr_nameObj.setVisible(false);
  }
  if (wentidalei.includes("4")) {
    let waixiewentifuzeren_nameObj = viewModel.get("waixiewentifuzeren_name");
    waixiewentifuzeren_nameObj.setVisible(true);
  } else {
    let waixiewentifuzeren_nameObj = viewModel.get("waixiewentifuzeren_name");
    waixiewentifuzeren_nameObj.setVisible(false);
  }
}
//问题大类
viewModel.on("afterProcessWorkflow", function (args) {
  let wentidalei = viewModel.get("wentidalei");
  let hideV = wentidalei.__data.bShowIt;
  if (wentidalei.__data.bShowIt) {
    wentidalei.setState("bIsNull", false);
  } else {
    wentidalei.setState("bIsNull", true);
  }
  debugger;
  let spxxgrid = viewModel.getGridModel("spxxList");
  let chuchanghanshuijia = spxxgrid.getEditRowModel().get("chuchanghanshuijia"); //出厂含税价
  debugger;
  if (chuchanghanshuijia.__data.bShowIt) {
    viewModel.get("spxxList").setColumnState("chuchanghanshuijia", "bIsNull", false);
  } else {
    viewModel.get("spxxList").setColumnState("chuchanghanshuijia", "bIsNull", true);
  }
});
//出具方案(生产问题)
viewModel.on("afterProcessWorkflow", function (args) {
  let ziduan8 = viewModel.get("ziduan8");
  let wentidalei = viewModel.get("wentidalei").getValue();
  let hideV = ziduan8.__data.bShowIt;
  debugger;
  if (ziduan8.__data.bShowIt && wentidalei.includes("1")) {
    ziduan8.setState("bIsNull", false);
  } else {
    ziduan8.setState("bIsNull", true);
  }
});
//出具方案(技术问题)
viewModel.on("afterProcessWorkflow", function (args) {
  let chujuwentijishuwenti = viewModel.get("chujuwentijishuwenti");
  let wentidalei = viewModel.get("wentidalei").getValue();
  let hideV = chujuwentijishuwenti.__data.bShowIt;
  debugger;
  if (chujuwentijishuwenti.__data.bShowIt && wentidalei.includes("2")) {
    chujuwentijishuwenti.setState("bIsNull", false);
  } else {
    chujuwentijishuwenti.setState("bIsNull", true);
  }
});
//出具方案(现场改造)
viewModel.on("afterProcessWorkflow", function (args) {
  let ziduan10 = viewModel.get("ziduan10");
  let wentidalei = viewModel.get("wentidalei").getValue();
  let hideV = ziduan10.__data.bShowIt;
  debugger;
  if (ziduan10.__data.bShowIt && wentidalei.includes("3")) {
    ziduan10.setState("bIsNull", false);
  } else {
    ziduan10.setState("bIsNull", true);
  }
});
//出具方案(外协问题)
viewModel.on("afterProcessWorkflow", function (args) {
  let chujufanganwaixiewenti = viewModel.get("chujufanganwaixiewenti");
  let wentidalei = viewModel.get("wentidalei").getValue();
  let hideV = chujufanganwaixiewenti.__data.bShowIt;
  debugger;
  if (chujufanganwaixiewenti.__data.bShowIt && wentidalei.includes("4")) {
    chujufanganwaixiewenti.setState("bIsNull", false);
  } else {
    chujufanganwaixiewenti.setState("bIsNull", true);
  }
});
//成本(北工核算)
viewModel.on("afterProcessWorkflow", function (args) {
  let chengben = viewModel.get("chengben");
  let hideV = chengben.__data.bShowIt;
  debugger;
  if (chengben.__data.bShowIt) {
    chengben.setState("bIsNull", false);
  } else {
    chengben.setState("bIsNull", true);
  }
});
//运费
viewModel.on("afterProcessWorkflow", function (args) {
  let yunfei = viewModel.get("yunfei");
  let hideV = yunfei.__data.bShowIt;
  debugger;
  if (yunfei.__data.bShowIt) {
    yunfei.setState("bIsNull", false);
  } else {
    yunfei.setState("bIsNull", true);
  }
});
//总成本(专员核算)
viewModel.on("afterProcessWorkflow", function (args) {
  let zongchengben = viewModel.get("zongchengben");
  let hideV = zongchengben.__data.bShowIt;
  debugger;
  if (zongchengben.__data.bShowIt) {
    zongchengben.setState("bIsNull", false);
  } else {
    zongchengben.setState("bIsNull", true);
  }
});
//费用归属
viewModel.on("afterProcessWorkflow", function (args) {
  let querenfeiyongguishu = viewModel.get("querenfeiyongguishu");
  let hideV = querenfeiyongguishu.__data.bShowIt;
  debugger;
  if (querenfeiyongguishu.__data.bShowIt) {
    querenfeiyongguishu.setState("bIsNull", false);
  } else {
    querenfeiyongguishu.setState("bIsNull", true);
  }
});
//交期（供应链）
viewModel.on("afterProcessWorkflow", function (args) {
  let jqgyl = viewModel.get("jqgyl");
  let wentidalei = viewModel.get("wentidalei").getValue();
  debugger;
  if (jqgyl.__data.bShowIt && wentidalei.includes("4")) {
    jqgyl.setState("bIsNull", false);
  } else {
    jqgyl.setState("bIsNull", true);
  }
});
//重量(供应链)
viewModel.on("afterProcessWorkflow", function (args) {
  let zlgyl = viewModel.get("zlgyl");
  let wentidalei = viewModel.get("wentidalei").getValue();
  debugger;
  if (zlgyl.__data.bShowIt && wentidalei.includes("4")) {
    zlgyl.setState("bIsNull", false);
  } else {
    zlgyl.setState("bIsNull", true);
  }
});
//包装尺寸(供应链)
viewModel.on("afterProcessWorkflow", function (args) {
  let bzccgyl = viewModel.get("bzccgyl");
  let wentidalei = viewModel.get("wentidalei").getValue();
  debugger;
  if (bzccgyl.__data.bShowIt && wentidalei.includes("4")) {
    bzccgyl.setState("bIsNull", false);
  } else {
    bzccgyl.setState("bIsNull", true);
  }
});
//交期
viewModel.on("afterProcessWorkflow", function (args) {
  let jiaoqi = viewModel.get("jiaoqi");
  let wentidalei = viewModel.get("wentidalei").getValue();
  debugger;
  if (jiaoqi.__data.bShowIt && wentidalei != "4") {
    jiaoqi.setState("bIsNull", false);
  } else {
    jiaoqi.setState("bIsNull", true);
  }
});
//重量
viewModel.on("afterProcessWorkflow", function (args) {
  let zhongliang = viewModel.get("zhongliang");
  let wentidalei = viewModel.get("wentidalei").getValue();
  debugger;
  if (zhongliang.__data.bShowIt && wentidalei != "4") {
    zhongliang.setState("bIsNull", false);
  } else {
    zhongliang.setState("bIsNull", true);
  }
});
//包装尺寸
viewModel.on("afterProcessWorkflow", function (args) {
  let bzcc = viewModel.get("bzcc");
  let wentidalei = viewModel.get("wentidalei").getValue();
  debugger;
  if (bzcc.__data.bShowIt && wentidalei != "4") {
    bzcc.setState("bIsNull", false);
  } else {
    bzcc.setState("bIsNull", true);
  }
});
//方案是否执行
viewModel.on("afterProcessWorkflow", function (args) {
  let fasfzx = viewModel.get("fasfzx");
  debugger;
  if (fasfzx.__data.bShowIt) {
    fasfzx.setState("bIsNull", false);
  } else {
    fasfzx.setState("bIsNull", true);
  }
});