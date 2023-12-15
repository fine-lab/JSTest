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
    } else {
      cb.rest.invokeFunction("GT3734AT5.APIFunc.getDeliveryDate", { beginDate: danjuriqi, workDayNum: jiaohuozhouqitianshu }, function (err, res) {
        if (err == null) {
          yujichukouriqi = res.endDayStr;
          viewModel.get("yujichukouriqi").setValue(yujichukouriqi);
        }
      });
    }
  }
  viewModel.get("yujichukouriqi").setValue(yujichukouriqi);
}
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