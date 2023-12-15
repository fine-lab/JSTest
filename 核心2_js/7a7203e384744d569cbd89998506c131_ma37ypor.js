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
viewModel.on("customInit", function (data) {
  // 签约申请详情--页面初始化
});
viewModel.get("zhuangguilei") &&
  viewModel.get("zhuangguilei").on("afterValueChange", function (data) {
    // 装柜类型--值改变后
    let zhuangguilei = viewModel.get("zhuangguilei").getValue();
    let gridModel = viewModel.getGridModel("QYzhuangguifanganList");
    if (zhuangguilei.includes("1")) {
      viewModel.execute("updateViewMeta", { code: "2abcd3af814544e6b13df0382f8bf5da", visible: true });
      gridModel.setState("bIsNull", false);
    } else {
      viewModel.execute("updateViewMeta", { code: "2abcd3af814544e6b13df0382f8bf5da", visible: false });
      gridModel.setState("bIsNull", true);
    }
  });
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
      let gridModel2 = viewModel.getGridModel("QYcpxxList");
      let rowDatas = gridModel2.getRows();
      rowDatas.forEach((rowData) => {
        rowData.fahuoriqi = yujichukouriqi;
      });
      gridModel2.setDataSource(rowDatas);
    } else {
      cb.rest.invokeFunction("GT3734AT5.APIFunc.getDeliveryDate", { beginDate: danjuriqi, workDayNum: jiaohuozhouqitianshu }, function (err, res) {
        if (err == null) {
          yujichukouriqi = res.endDayStr;
          viewModel.get("yujichukouriqi").setValue(yujichukouriqi);
          let gridModel2 = viewModel.getGridModel("QYcpxxList");
          let rowDatas = gridModel2.getRows();
          rowDatas.forEach((rowData) => {
            rowData.fahuoriqi = yujichukouriqi;
          });
          gridModel2.setDataSource(rowDatas);
        }
      });
    }
  }
}
viewModel.get("shouhoutiaokuan") &&
  viewModel.get("shouhoutiaokuan").on("afterValueChange", function (data) {
    // 售后条款--值改变后
    let shouhoutiaokuan = viewModel.get("shouhoutiaokuan").getValue();
    let shouhoutiaokuanObj = viewModel.get("hananzhuangtianshu");
    if (shouhoutiaokuan.includes("3")) {
      shouhoutiaokuanObj.setVisible(true);
    } else {
      shouhoutiaokuanObj.setVisible(false);
    }
  });
viewModel.on("afterLoadData", function (data) {
  let gridModel = viewModel.getGridModel("QYzhuangguifanganList");
  if (gridModel.getRows().length == 0) {
    let rowDatas = [{}];
    gridModel.insertRows(0, rowDatas);
  }
  let gridModel2 = viewModel.getGridModel("QYcpxxList");
  if (gridModel2.getRows().length == 0) {
    let rowDatas = [{}];
    gridModel2.insertRows(0, rowDatas);
  }
});
viewModel.on("beforePush", (data) => {
  debugger;
  //检测是否已有单据
  let billObj = data.params.data;
  let billNo = billObj.code;
  let billId = billObj.id;
  //调用接口进行检测
  let billNos = "'" + billNo + "'";
  let rstObj = cb.rest.invokeFunction("GT3734AT5.APIFunc.chkQYSQPushed", { billNos: billNos }, function (err, res) {
    if (err == null) {
      console.log(res);
      return { rst: true };
    } else {
      return { rst: false, msg: JSON.stringify(err) };
    }
  });
});