viewModel.on("afterWorkflowBeforeQueryAsync", function (data) {
  //流程走完触发
});
viewModel.on("afterRule", function (data) {
});
viewModel.on("beforeLoadData", function (data) {
  alert("beforeLoadData");
});
viewModel.on("afterLoadData", function (data) {
  let billnum = viewModel.getParams().billNo;
  let gridModel = viewModel.getGridModel("QYzhuangguifanganList");
  if (gridModel.getRows().length == 0) {
    let rowDatas = [{}];
    gridModel.appendRow({ _status: "Insert" });
  }
  let gridModel2 = viewModel.getGridModel("QYcpxxList");
  if (gridModel2.getRows().length == 0) {
    let rowDatas = [{}];
    gridModel2.appendRow({ _status: "Insert" });
  }
  zhuangGuiFangAn();
  shouHouTiaoShuVisible();
  let visibleVal = false;
  let mode = viewModel.getParams().mode;
  let verifystate = viewModel.get("verifystate").getValue();
  let isClosed = viewModel.get("isClosed").getValue();
  if (mode == "browse" && verifystate == "2" && !isClosed) {
    visibleVal = true;
  }
  viewModel.get("flowbutton34qi").setVisible(visibleVal);
});
viewModel.on("customInit", function (params) {
  var returnPromise = new cb.promise(); //同步
  var billNo = viewModel.getParams().billNo;
  cb.rest.invokeFunction("GT3734AT5.APIFunc.getLimitFieldApi", { billNo: billNo }, function (err, res) {
    debugger;
    if (err != null) {
      cb.utils.alert("权限控制异常");
      returnPromise.resolve();
    } else {
      if (res.data.length > 0) {
        let data = res.data;
        for (let i in data) {
          let dataObj = data[i];
          let fieldParamsList = dataObj.FieldParamsList;
          let isList = dataObj.isList;
          for (j in fieldParamsList) {
            let fieldParams = fieldParamsList[j];
            let fieldName = fieldParams.fieldName;
            let isMain = fieldParams.isMain;
            let childrenField = fieldParams.childrenField;
            let isVisilble = fieldParams.isVisilble;
            if (isList) {
              //列表单据
              viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
              viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
            } else {
              //单据
              if (isMain) {
                //主表
                viewModel.get(fieldName).setVisible(isVisilble);
                viewModel.get(fieldName).setState("bShowIt", isVisilble);
                viewModel.get(fieldName).setState("bHidden", !isVisilble);
              } else {
                viewModel.get(childrenField).setColumnState(fieldName, "bShowIt", isVisilble);
                viewModel.get(childrenField).setColumnState(fieldName, "bHidden", !isVisilble);
              }
            }
          }
        }
      }
      returnPromise.resolve();
    }
  });
  return returnPromise;
});
const isAfterDate = (dateA, dateB) => dateA > dateB;
viewModel.get("shoukuanbizhong_name") &&
  viewModel.get("shoukuanbizhong_name").on("afterValueChange", function (data) {
    // 收款币种--值改变后
    let shoukuanbizhong = viewModel.get("shoukuanbizhong").getValue();
    let targetCurrencyId = "yourIdHere"; //人民币
    if (shoukuanbizhong == null || shoukuanbizhong == "" || shoukuanbizhong == targetCurrencyId) {
      viewModel.get("huilv").setValue(1);
      viewModel.get("shoururenminbi").setValue(viewModel.get("dingdanjine").getValue() * 1);
      return;
    }
    let quotationdate = "";
    let exchangeRate = "";
    cb.rest.invokeFunction("GT3734AT5.APIFunc.getNewExchange", { targetCurrencyId: targetCurrencyId, sourceCurrencyId: shoukuanbizhong }, function (err, res) {
      if (err == null) {
        let resData = res.data;
        let simpleObj = resData; //JSON.parse(resData);
        if (simpleObj != null && simpleObj.length > 0) {
          let dataList = resData;
          for (var idx in dataList) {
            let oneData = dataList[idx];
            if (oneData.sourcecurrency_id == shoukuanbizhong && oneData.targetcurrency_id == targetCurrencyId) {
              let tempDataStr = oneData.quotationdate;
              if (quotationdate == "" || isAfterDate(new Date(tempDataStr), new Date(quotationdate))) {
                quotationdate = tempDataStr;
                exchangeRate = oneData.exchangerate;
              }
            }
          }
        }
        viewModel.get("huilv").setValue(exchangeRate);
        viewModel.get("shoururenminbi").setValue(exchangeRate == "" ? "" : viewModel.get("dingdanjine").getValue() * exchangeRate);
      }
    });
  });
viewModel.get("qianyuewendang") &&
  viewModel.get("qianyuewendang").on("afterValueChange", function (data) {
    // 签约文档--值改变后
    piChangeHandle();
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    // 组织--值改变后
    piChangeHandle();
    let orgName = viewModel.get("org_id_name").getValue();
    if (orgName == null || orgName == "") {
      return;
    }
    modalWinForSelectScheme();
  });
function piChangeHandle() {
  //签约文档和组织发生值变化
  let qianyuewendang = viewModel.get("qianyuewendang").getValue();
  if (qianyuewendang.includes("1")) {
    let picaogaojianObj = viewModel.get("picaogaojian");
    picaogaojianObj.setVisible(true);
    picaogaojianObj.setState("bIsNull", false);
  } else {
    let picaogaojianObj = viewModel.get("picaogaojian");
    picaogaojianObj.setVisible(false);
    picaogaojianObj.setState("bIsNull", true);
  }
  if (qianyuewendang.includes("2")) {
    let hetongcaogaojianObj = viewModel.get("hetongcaogaojian");
    hetongcaogaojianObj.setVisible(true);
    hetongcaogaojianObj.setState("bIsNull", false);
  } else {
    let hetongcaogaojianObj = viewModel.get("hetongcaogaojian");
    hetongcaogaojianObj.setVisible(false);
    hetongcaogaojianObj.setState("bIsNull", true);
  }
}
viewModel.on("jointQuery", function (args) {
  debugger;
  let data = {
    billtype: "VoucherList",
    billno: "59c8384aList",
    domainKey: "yourKeyHere"
  };
  //打开一个单据，并在当前页面显示
  cb.loader.runCommandLine("bill", data, viewModel);
  return false;
});
viewModel.get("zhuangguilei") &&
  viewModel.get("zhuangguilei").on("afterValueChange", function (data) {
    // 装柜类型--值改变后
    zhuangGuiFangAn();
  });
function zhuangGuiFangAn() {
  let zhuangguilei = viewModel.get("zhuangguilei").getValue();
  let gridModel = viewModel.getGridModel("QYzhuangguifanganList");
  var zglx_rongqicode = "0322f83f739340b283b48bbed6acfb21";
  if (zhuangguilei.includes("1")) {
    viewModel.execute("updateViewMeta", { code: zglx_rongqicode, visible: true });
    gridModel.setState("bIsNull", false);
  } else {
    viewModel.execute("updateViewMeta", { code: zglx_rongqicode, visible: false });
    gridModel.setState("bIsNull", true);
  }
}
viewModel.get("jiaohuozhouqileixing") &&
  viewModel.get("jiaohuozhouqileixing").on("afterValueChange", function (data) {
    // 交货周期类型--值改变后
    calcDeliveryDate();
  });
viewModel.get("danjuriqi") &&
  viewModel.get("danjuriqi").on("afterValueChange", function (data) {
    // 单据日期--值改变后
    calcDeliveryDate();
  });
viewModel.get("jiaohuozhouqitianshu") &&
  viewModel.get("jiaohuozhouqitianshu").on("afterValueChange", function (data) {
    // 交货周期天数--值改变后yujichukouriqi
    calcDeliveryDate();
  });
function calcDeliveryDate() {
  let jiaohuozhouqileixing = viewModel.get("jiaohuozhouqileixing").getValue();
  let jiaohuozhouqitianshu = viewModel.get("jiaohuozhouqitianshu").getValue();
  let danjuriqi = viewModel.get("danjuriqi").getValue();
  let yujichukouriqi = "";
  if (jiaohuozhouqitianshu == null || jiaohuozhouqitianshu == undefined || jiaohuozhouqitianshu == "" || danjuriqi == null || danjuriqi == undefined || danjuriqi == "") {
  } else {
    if (jiaohuozhouqileixing == 1) {
      let beginDate = new Date(danjuriqi);
      let endDate = new Date(beginDate.getTime() + jiaohuozhouqitianshu * 24 * 3600000);
      let syear = endDate.getFullYear();
      let smonth = endDate.getMonth() + 1;
      let sDate = endDate.getDate();
      yujichukouriqi = syear + "-" + (smonth >= 1 && smonth <= 9 ? "0" + smonth : smonth) + "-" + (sDate >= 1 && sDate <= 9 ? "0" + sDate : sDate);
      viewModel.get("yujichukouriqi").setValue(yujichukouriqi);
    } else {
      cb.rest.invokeFunction("GT3734AT5.APIFunc.getDeliveryDate", { beginDate: danjuriqi, workDayNum: jiaohuozhouqitianshu }, function (err, res) {
        if (err == null) {
          yujichukouriqi = res.endDayStr;
          viewModel.get("yujichukouriqi").setValue(yujichukouriqi);
        }
      });
    }
  }
}
viewModel.get("shouhoutiaokuan") &&
  viewModel.get("shouhoutiaokuan").on("afterValueChange", function (data) {
    // 售后条款--值改变后
    shouHouTiaoShuVisible();
  });
function shouHouTiaoShuVisible() {
  let shouhoutiaokuan = viewModel.get("shouhoutiaokuan").getValue();
  let shouhoutiaokuanObj = viewModel.get("hananzhuangtianshu");
  if (shouhoutiaokuan.includes("3")) {
    shouhoutiaokuanObj.setVisible(true);
  } else {
    shouhoutiaokuanObj.setVisible(false);
  }
}
viewModel.on("beforePush", (data) => {
  return;
  //检测是否已有单据
  let billObj = data.params.data;
  let billNo = billObj.code;
  let billId = billObj.id;
  //调用接口进行检测
  let billNos = "'" + billNo + "'";
  cb.rest.invokeFunction("GT3734AT5.APIFunc.chkQYSQPushed", { billNos: billNos }, function (err, res) {
    if (err == null) {
    }
  });
});
viewModel.get("prospectCust_MingChen") &&
  viewModel.get("prospectCust_MingChen").on("afterValueChange", function (data) {
    // 潜在客户--值改变后
    viewModel.get("busiChance").setValue("");
    viewModel.get("QYSQD_busiChanceList").setValue("");
  });
viewModel.get("schemeBillNo") &&
  viewModel.get("schemeBillNo").on("click", function (data) {
    cb.utils.alert("click!");
  });
viewModel.get("button32xc") &&
  viewModel.get("button32xc").on("click", function (data) {
    // 拉取方案申请单--单击
    var currentState = viewModel.getParams().mode;
    if ("browse" == currentState) {
      cb.utils.alert("浏览不能取值!");
      return;
    }
    modalWinForSelectScheme();
  });
function modalWinForSelectScheme() {
  let isOpened = viewModel.getCache("isOpened");
  if (isOpened == undefined || !isOpened) {
    viewModel.setCache("isOpened", true);
  } else {
    return;
  }
  let orgName = viewModel.get("org_id_name").getValue();
  if (orgName == null || orgName == "") {
    cb.utils.alert("请先选好签约组织!");
    return;
  }
  if (orgName.includes("河南国立控股")) {
    cb.utils.alert("请选事业部下面的公司主体!");
    return;
  }
  let orgId = viewModel.get("org_id").getValue();
  let orgObj = getParentOrgName(orgId);
  let parentOrgName = orgObj.parentOrgName;
  if (parentOrgName == "") {
    cb.utils.alert("请选事业部下面的公司主体!");
    return;
  }
  let billno = "7b6433a2"; //AIMXI建机事业部 模态页面
  if (parentOrgName.includes("环保")) {
    billno = "b58c799c";
  } else if (parentOrgName.includes("游乐")) {
    billno = "7edad415";
  }
  let obj = cb.loader.runCommandLine(
    "bill",
    {
      billtype: "VoucherList",
      billno: billno,
      domainKey: "yourKeyHere",
      params: { mode: "browse" }
    },
    viewModel
  );
}
function getParentOrgName(orgid) {
  let orgObjs = [
    { parentOrgId: "yourIdHere", parentOrgName: "百特环保事业部", orgId: "yourIdHere", orgName: "河南百特设备机械有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "百特环保事业部", orgId: "yourIdHere", orgName: "河南国立百特环保机械有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "百特环保事业部", orgId: "yourIdHere", orgName: "河南北工机械制造有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "AIMXI建机事业部", orgId: "yourIdHere", orgName: "郑州爱尔森机械设备有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "AIMXI建机事业部", orgId: "yourIdHere", orgName: "河南国立米克斯科技有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "AIMXI建机事业部", orgId: "yourIdHere", orgName: "河南米科斯机械设备有限公司" },
    { parentOrgId: "yourIdHere", parentOrgName: "游乐事业部", orgId: "yourIdHere", orgName: "河南国立百斯特游乐设备有限公司" }
  ];
  for (var i in orgObjs) {
    let orgObj = orgObjs[i];
    if (orgObj.orgId == orgid) {
      return orgObj;
    }
  }
  return { parentOrgId: "", parentOrgName: "" };
}
viewModel.get("QYcpxxList") &&
  viewModel.get("QYcpxxList").on("afterCellValueChange", function (data) {
    let gridModel = viewModel.get("QYcpxxList");
    let cellName = data.cellName;
    let rowIndex = data.rowIndex;
    let rowData = viewModel.get("QYcpxxList").getRows()[rowIndex];
    let xxsl = rowData.xxsl; //rowModel.get('xssl').getValue();
    xxsl = xxsl == null || xxsl == "" ? 0 : xxsl;
    if (cellName == "xssl") {
      xxsl = data.value;
      rowData.xxsl = xxsl;
      let hanshuidanjia = rowData.hanshuidanjia; //rowModel.get('hanshuidanjia').getValue();
      hanshuidanjia = hanshuidanjia == null || hanshuidanjia == "" ? 0 : hanshuidanjia;
      rowData.hanshuijine = xxsl * hanshuidanjia;
      let caigoudanjiayuce = rowData.caigoudanjiayuce; //rowModel.get('caigoudanjiayuce').getValue();
      caigoudanjiayuce = caigoudanjiayuce == null || caigoudanjiayuce == "" ? 0 : caigoudanjiayuce;
      rowData.caigoujineyuce = xxsl * caigoudanjiayuce;
      gridModel.updateRow(rowIndex, rowData);
      calSumAmount(gridModel);
      calSumCBAmount(gridModel);
    } else if (cellName == "hanshuidanjia") {
      //单价
      let hanshuidanjia = data.value; //rowModel.get('hanshuidanjia').getValue();
      rowData.hanshuidanjia = hanshuidanjia;
      hanshuidanjia = hanshuidanjia == null || hanshuidanjia == "" ? 0 : hanshuidanjia;
      rowData.hanshuijine = xxsl * hanshuidanjia;
      gridModel.updateRow(rowIndex, rowData);
      calSumAmount(gridModel);
    } else if (cellName == "hanshuijine") {
      //金额
      let hanshuijine = data.value; //rowModel.get('hanshuijine').getValue();
      hanshuijine = hanshuijine == null || hanshuijine == "" ? 0 : hanshuijine;
      rowData.hanshuijine = hanshuijine;
      if (xxsl == 0) {
        rowData.hanshuidanjia = 0;
      } else {
        rowData.hanshuidanjia = hanshuijine / xxsl;
      }
      gridModel.updateRow(rowIndex, rowData);
      calSumAmount(gridModel);
    } else if (cellName == "caigoudanjiayuce") {
      let caigoudanjiayuce = data.value; //rowModel.get('caigoudanjiayuce').getValue();
      caigoudanjiayuce = caigoudanjiayuce == null || caigoudanjiayuce == "" ? 0 : caigoudanjiayuce;
      rowData.caigoudanjiayuce = caigoudanjiayuce;
      rowData.caigoujineyuce = xxsl * caigoudanjiayuce;
      gridModel.updateRow(rowIndex, rowData);
      calSumCBAmount(gridModel);
    } else if (cellName == "caigoujineyuce") {
      let caigoujineyuce = data.value; //rowModel.get('caigoujineyuce').getValue();
      caigoujineyuce = caigoujineyuce == null || caigoujineyuce == "" ? 0 : caigoujineyuce;
      rowData.caigoujineyuce = caigoujineyuce;
      if (xxsl == 0) {
        rowData.caigoudanjiayuce = 0;
      } else {
        rowData.caigoudanjiayuce = caigoujineyuce / xxsl;
      }
      gridModel.updateRow(rowIndex, rowData);
      calSumCBAmount(gridModel);
    }
  });
function calSumAmount(gridModel) {
  //修正批改单价的时候没有触发计算合计的问题
  let rowDatas = gridModel.getRows();
  let sumAmount = 0;
  for (var idx in rowDatas) {
    sumAmount = sumAmount + rowDatas[idx].hanshuijine;
  }
  viewModel.get("sumAmount").setValue(sumAmount);
}
function calSumCBAmount(gridModel) {
  //修正批改单价的时候没有触发计算合计的问题
  let rowDatas = gridModel.getRows();
  let sumAmount = 0;
  for (var idx in rowDatas) {
    sumAmount = sumAmount + rowDatas[idx].caigoujineyuce;
  }
  viewModel.get("caigouchengbenyugu").setValue(sumAmount);
  let jineObj = viewModel.get("dingdanjine");
  calPerAmount(gridModel, sumAmount);
}
function calPerAmount(gridModel, caigouchengbenyugu) {
  let dingdanjine = viewModel.get("dingdanjine").getValue(); //订单金额
  dingdanjine = dingdanjine == "" ? 0 : dingdanjine;
  let huilv = viewModel.get("huilv").getValue();
  let shoururenminbi = dingdanjine * huilv;
  viewModel.get("shoururenminbi").setValue(shoururenminbi);
  let feiyong = viewModel.get("feiyong").getValue();
  let shouhoufeiyong = ((shoururenminbi - feiyong) * 0.03).toFixed(0);
  viewModel.get("shouhoufeiyong").setValue(shouhoufeiyong);
  let shifubaoguan = viewModel.get("shifubaoguan").getValue();
  let yewuyuanticheng = 0;
  if (shifubaoguan == "1") {
    yewuyuanticheng = ((shoururenminbi - caigouchengbenyugu * 1.02 - feiyong - shouhoufeiyong) * 0.1 * 0.85 + caigouchengbenyugu * 0.01).toFixed(0);
  } else {
    yewuyuanticheng = ((shoururenminbi - caigouchengbenyugu * 1.02 - feiyong - shouhoufeiyong) * 0.1).toFixed(0);
  }
  viewModel.get("yewuyuanticheng").setValue(yewuyuanticheng); //业务员提成
  let xiaoshougongxian = shoururenminbi - caigouchengbenyugu - feiyong - shouhoufeiyong - yewuyuanticheng;
  viewModel.get("xiaoshougongxian").setValue(xiaoshougongxian); //销售贡献
  let dingdanxiaoshougongxianlv = (xiaoshougongxian / shoururenminbi).toFixed(4);
  viewModel.get("dingdanxiaoshougongxianlv").setValue(dingdanxiaoshougongxianlv); //贡献率
}
viewModel.get("button64yc") &&
  viewModel.get("button64yc").on("click", function (data) {
    // 方案查看--单击
    let shiyebu_name = viewModel.get("shiyebu_name").getValue();
    let schemeBillId = viewModel.get("schemeBillId").getValue();
    if (schemeBillId == null || schemeBillId == "" || shiyebu_name == null || shiyebu_name == "") {
      cb.utils.alert("请先选好方案申请单!");
      return;
    }
    let billno = "c783f00c"; //建机
    if (shiyebu_name.includes("环保")) {
      billno = "69939af7";
    } else if (shiyebu_name.includes("游乐")) {
      billno = "b8a7fc44";
    }
    let dataBody = {
      billtype: "Voucher",
      billno: billno,
      domainKey: "yourKeyHere",
      mode: "browse",
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        isBrowse: true,
        readOnly: true,
        id: schemeBillId
      }
    };
    cb.loader.runCommandLine("bill", dataBody, viewModel);
  });