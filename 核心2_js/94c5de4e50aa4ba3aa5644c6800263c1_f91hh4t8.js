viewModel.get("pk_customer_v_name") &&
  viewModel.get("pk_customer_v_name").on("afterReferOkClick", function (data) {
    // 合同编码--值改变后
    cb.rest.invokeFunction("AT168837E809980003.front.queryCustInvoice", { data }, function (err, res) {
      viewModel.get("customerBank").setValue(res.res[0] ? res.res[0].name : "");
      viewModel.get("customerBankAccount").setValue(res.res[0] ? res.res[0].bankAccount : "");
      viewModel.get("customerPhone").setValue(res.res[0] ? res.res[0].telephone : "");
      viewModel.get("customerEmail").setValue(res.res[0] ? res.res[0].receievInvoiceEmail : "");
      viewModel.get("customerAddress").setValue(res.res[0] ? res.res[0].address : "");
      viewModel.get("customerPsn").setValue(res.rest[0] ? res.rest[0].fullName : "");
      debugger;
    });
  });
viewModel.on("afterLoadData", function (args) {
  cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.queryCurrentUnit", {}, function (err, res) {
    if (res) {
      if (res.bank && res.bank[0]) {
        viewModel.get("bankaccount").setValue(res.bank[0].account);
      }
      if (res.org && res.org[0]) {
        viewModel.get("party").setValue(res.org[0].orgid);
        viewModel.get("party_name").setValue(res.org[0].name);
        viewModel.get("partyAddress").setValue(res.org[0].address);
        viewModel.get("partyPhone").setValue(res.org[0].telephone);
      }
      if (res.dept && res.dept[0]) {
        viewModel.get("partyDept").setValue(res.dept[0].id);
        viewModel.get("partyDept_name").setValue(res.dept[0].name);
      }
      viewModel.get("partyPsn").setValue(res.user.staffId);
      viewModel.get("partyPsn_name").setValue(res.user.name);
      //销售组织 pk_org_v_name
      if (res.org && res.org[0]) {
        viewModel.get("pk_org_v").setValue(res.org[0].orgid);
        viewModel.get("pk_org_v_name").setValue(res.org[0].name);
      }
      //销售部门 depid_name
      if (res.dept && res.dept[0]) {
        viewModel.get("depid").setValue(res.dept[0].id);
        viewModel.get("depid_name").setValue(res.dept[0].name);
      }
      // 销售人员
      viewModel.get("personnelid").setValue(res.user.staffId);
      viewModel.get("personnelid_name").setValue(res.user.name);
    }
  });
});
viewModel.get("button45sj") &&
  viewModel.get("button45sj").on("click", function (data) {
    // 盖章--单击
    const bill = viewModel.getAllData();
    bill.retentionmoney = bill.retentionmoney + "";
    bill.pk_fct_ar_b_adList.forEach((item) => (item.pk_financeorg = bill.pk_org_v_code));
    bill.pk_fct_ar_bList = bill.pk_fct_ar_b_adList;
    bill.pk_fct_ar_plan_adList.forEach((item) => {
      item.pk_financeorg = bill.pk_org_v_code;
      item.accountnum = item.accountnum + "";
      item.unplanmoney = item.unplanmoney + "";
      item.taxmoney = item.taxmoney + "";
    });
    bill.pk_fct_ar_planList = bill.pk_fct_ar_plan_adList;
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.createNCCArCt", { bill }, function (err, res) {
      if (res.res.res.code == "1000000000") {
        cb.utils.alert(res.res.res.data.message || res.res.res.message, "error");
      }
      debugger;
    });
  });
let detialLineRecLineMap = {};
viewModel.get("pk_fct_ar_b_adList") &&
  viewModel.get("pk_fct_ar_b_adList").on("afterCellValueChange", function (data) {
    if (data.cellName == "norigtaxmny" || data.cellName == "ctaxcodeid_name") {
      const rows = viewModel.get("pk_fct_ar_b_adList").getData();
      let ntotaltaxmny = 0;
      rows.forEach((item) => (ntotaltaxmny += item.norigtaxmny));
      viewModel.get("ntotaltaxmny").setValue(ntotaltaxmny);
      createRecLine(data);
    }
  });
function createRecLine(data) {
  const row = viewModel.get("pk_fct_ar_b_adList").getRow(data.rowIndex);
  if (row.installmenttype_name && row.advertisingtype && row.norigtaxmny && row.bengintime && row.endtime) {
    viewModel.get("pk_fct_ar_plan_adList").deleteRows(detialLineRecLineMap[row._id]);
    if (row.installmenttype_name == "一次确认收入") {
    }
    if (row.installmenttype_name == "按月分期" || row.installmenttype_name == "按季分期") {
      //含税金额单价
      let mnyPerDay = Math.floor((row.norigtaxmny / getDays(row.bengintime, row.endtime)) * 100) / 100;
      //税额单价
      let mnyPerDayshui = Math.floor((row.ntax / getDays(row.bengintime, row.endtime)) * 100) / 100;
      //无税单价
      let mnyPerDaywushui = Math.floor((row.norigmny / getDays(row.bengintime, row.endtime)) * 100) / 100;
      let months;
      if (row.installmenttype_name == "按月分期") {
        months = groupByMonth(row.bengintime, row.endtime, mnyPerDay, row.norigtaxmny, mnyPerDayshui, row.ntax, mnyPerDaywushui, row.norigmny);
      }
      if (row.installmenttype_name == "按季分期") {
        months = groupByQuarter(row.bengintime, row.endtime, mnyPerDay, row.norigtaxmny, mnyPerDayshui, row.ntax, mnyPerDaywushui, row.norigmny);
      }
      detialLineRecLineMap[row._id] = [];
      months.forEach((item, index) => {
        item.accountnum = index + 1;
        const result = viewModel.get("pk_fct_ar_plan_adList").appendRow(item);
        detialLineRecLineMap[row._id].push(result.index);
      });
      debugger;
    }
  }
}
function groupByMonth(startDateStr, endDateStr, price, totalMoney, shuiprice, shuiMoney, wushuiprice, wushiMoney) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  let startMonthNum = startDate.getFullYear() * 12 + startDate.getMonth();
  const endMonthNum = endDate.getFullYear() * 12 + endDate.getMonth();
  let results = [];
  let sumMoney = 0;
  let sumshui = 0;
  let sumwushui = 0;
  while (startMonthNum <= endMonthNum) {
    let result = {};
    let begining = getBeginningOfMonth(Math.floor(startMonthNum / 12), startMonthNum % 12);
    if (results.length == 0) {
      begining = startDate;
    }
    let end;
    if (endDate.getMonth() == startMonthNum % 12 && endDate.getFullYear() == Math.floor(startMonthNum / 12)) {
      end = endDate;
    } else {
      end = getEndOfMonth(Math.floor(startMonthNum / 12), startMonthNum % 12, 0);
    }
    result.days = getDays(begining, end);
    result.begindate = formatDate(begining);
    result.enddate = formatDate(end);
    result.planmoney = result.days * price;
    result.taxmoney = result.days * shuiprice;
    result.unplanmoney = result.days * wushuiprice;
    result.date = formatDate(end);
    results.push(result);
    sumMoney += result.planmoney;
    sumshui += result.taxmoney;
    sumwushui += result.unplanmoney;
    startMonthNum++;
  }
  results[0].planmoney = results[0].planmoney + totalMoney - sumMoney;
  results[0].taxmoney = results[0].taxmoney + shuiMoney - sumshui;
  results[0].unplanmoney = results[0].unplanmoney + wushiMoney - sumwushui;
  debugger;
  return results;
}
function groupByQuarter(startDateStr, endDateStr, price, totalMoney, shuiprice, shuiMoney, wushuiprice, wushiMoney) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  let startMonthNum = startDate.getFullYear() * 12 + startDate.getMonth();
  const endMonthNum = endDate.getFullYear() * 12 + endDate.getMonth();
  let results = [];
  let begining;
  let sumMoney = 0;
  let sumshui = 0;
  let sumwushui = 0;
  while (startMonthNum <= endMonthNum) {
    let result = {};
    if (results.length == 0 && begining != startDate) {
      begining = startDate;
    } else {
      if ([1, 4, 7, 10].includes((startMonthNum % 12) + 1)) {
        begining = getBeginningOfMonth(Math.floor(startMonthNum / 12), startMonthNum % 12);
      }
    }
    if ([3, 6, 9, 12].includes((startMonthNum % 12) + 1)) {
      let end;
      if (endDate.getMonth() == startMonthNum % 12 && endDate.getFullYear() == Math.floor(startMonthNum / 12)) {
        end = endDate;
      } else {
        end = getEndOfMonth(Math.floor(startMonthNum / 12), startMonthNum % 12, 0);
      }
      result.days = getDays(begining, end);
      result.begindate = formatDate(begining);
      result.enddate = formatDate(end);
      result.planmoney = result.days * price;
      result.taxmoney = result.days * shuiprice;
      result.unplanmoney = result.days * wushuiprice;
      result.date = formatDate(end);
      begining = null;
      sumMoney += result.planmoney;
      sumshui += result.taxmoney;
      sumwushui += result.unplanmoney;
      results.push(result);
    }
    startMonthNum++;
  }
  if (begining != null) {
    end = endDate;
    let result = {};
    result.days = getDays(begining, end);
    result.begindate = formatDate(begining);
    result.enddate = formatDate(end);
    result.planmoney = result.days * price;
    result.taxmoney = result.days * shuiprice;
    result.unplanmoney = result.days * wushuiprice;
    result.date = formatDate(end);
    begining = null;
    sumMoney += result.planmoney;
    sumshui += result.taxmoney;
    sumwushui += result.unplanmoney;
    results.push(result);
  }
  results[0].planmoney = results[0].planmoney + totalMoney - sumMoney;
  results[0].taxmoney = results[0].taxmoney + shuiMoney - sumshui;
  results[0].unplanmoney = results[0].unplanmoney + wushiMoney - sumwushui;
  debugger;
  return results;
}
function getDays(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  endDate.setHours(23);
  endDate.setMinutes(59);
  endDate.setSeconds(59);
  return Math.round((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
}
function getBeginningOfMonth(year, month) {
  return new Date(year, month);
}
function getEndOfMonth(year, month) {
  return new Date(year, month + 1, 0);
}
function formatDate(date) {
  if (date) {
    return date.toLocaleString().split(" ")[0].replaceAll("/", "-");
  }
}
viewModel.get("pk_fct_ar_b_adList") &&
  viewModel.get("pk_fct_ar_b_adList").getEditRowModel() &&
  viewModel.get("pk_fct_ar_b_adList").getEditRowModel().get("installmenttype.name") &&
  viewModel
    .get("pk_fct_ar_b_adList")
    .getEditRowModel()
    .get("installmenttype.name")
    .on("valueChange", function (data) {
      // 分期类型--值改变
    });
viewModel.on("customInit", function (data) {
  // 广告及宣传服务合同详情--页面初始化
});