viewModel.get("pk_customer_v_name") &&
  viewModel.get("pk_customer_v_name").on("afterReferOkClick", function (data) {
    // 合同编码--值改变后
    cb.rest.invokeFunction("AT168837E809980003.front.queryCustInvoice", { data }, function (err, res) {
      viewModel.get("customerBank").setValue(res.res[0] ? res.res[0].id : "");
      viewModel.get("customerBankAccount").setValue(res.res[0] ? res.res[0].bankAccount : "");
      viewModel.get("customerPhone").setValue(res.res[0] ? res.res[0].telephone : "");
      viewModel.get("customerEmail").setValue(res.res[0] ? res.res[0].receievInvoiceEmail : "");
      viewModel.get("customerAddress").setValue(res.res[0] ? res.res[0].address : "");
      viewModel.get("customerPsn").setValue(res.rest[0] ? res.rest[0].fullName : "");
    });
  });
function refreshDetialLineRecLineMap(pk_fct_ar_plan_adList) {
  pk_fct_ar_plan_adList = pk_fct_ar_plan_adList || viewModel.get("pk_fct_ar_plan_nbList").getRows();
  detialLineRecLineMap = {};
  pk_fct_ar_plan_adList.forEach((item, index) => {
    if (detialLineRecLineMap[item.srcRowIndex]) {
      detialLineRecLineMap[item.srcRowIndex].push(index);
    } else {
      detialLineRecLineMap[item.srcRowIndex] = [index];
    }
  });
}
viewModel.on("afterLoadData", function (args) {
  if (args.pk_fct_ar_plan_nbList) {
    refreshDetialLineRecLineMap(args.pk_fct_ar_plan_nbList);
  }
  if (args.verifystate == 2) {
    viewModel.get("button62ee").setVisible(true);
  } else {
    viewModel.get("button62ee").setVisible(false);
  }
  debugger;
  var mode = viewModel.getParams().mode;
  let id = args.id;
  if (id) {
  } else {
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
  }
  var referModel = viewModel.get("xiangmu_name");
  referModel.on("beforeBrowse", function (args) {
    var condition = {
      isExtend: true,
      simpleVOs: []
    };
    //获取过滤条件
    condition.simpleVOs.push({
      field: "freeDefine.define1",
      op: "eq",
      value1: "true"
    });
    this.setFilter(condition);
  });
});
viewModel.get("button62ee") &&
  viewModel.get("button62ee").on("click", function (data) {
    // 盖章--单击
    const bill = viewModel.getAllData();
    let subscribedate = bill.subscribedate;
    if (undefined == subscribedate) {
      var mode = viewModel.getParams().mode;
      if (mode !== "edit") {
        viewModel.get("button116tb").setVisible(false);
        viewModel.get("subscribedate").setVisible(true);
        viewModel.get("subscribedate").setState("bCanModify", true);
        viewModel.get("subscribedate").setState("bIsNull", false);
        viewModel.get("xgfj").setVisible(true);
        viewModel.get("xgfj").setState("bCanModify", true);
        viewModel.get("xgfj").setState("bIsNull", false);
        viewModel.get("ordersrc_name").setState("bCanModify", false);
        viewModel.get("pk_org_v_name").setState("bCanModify", false);
        viewModel.get("depid_name").setState("bCanModify", false);
        viewModel.get("personnelid_name").setState("bCanModify", false);
        viewModel.get("ctname").setState("bCanModify", false);
        viewModel.get("vdef13_name").setState("bCanModify", false);
        viewModel.get("ordersrc_name").setState("bCanModify", false);
        viewModel.get("valdate").setState("bCanModify", false);
        viewModel.get("invallidate").setState("bCanModify", false);
        viewModel.get("xiangmu_name").setState("bCanModify", false);
        viewModel.get("openct").setState("bCanModify", false);
        viewModel.get("taxrate_name").setState("bCanModify", false);
        viewModel.get("untaxmny").setState("bCanModify", false);
        viewModel.get("settletype_name").setState("bCanModify", false);
        viewModel.get("guaranteeperiod").setState("bCanModify", false);
        viewModel.get("retentionmoney").setState("bCanModify", false);
        viewModel.get("earlysign").setState("bCanModify", false);
        viewModel.get("vdef18").setState("bCanModify", false);
        viewModel.get("vdef9").setState("bCanModify", false);
        viewModel.get("ccontract1_id").setState("bCanModify", false);
        viewModel.get("pk_customer_v_name").setState("bCanModify", false);
        viewModel.get("customerPsn").setState("bCanModify", false);
        viewModel.get("customerAddress").setState("bCanModify", false);
        viewModel.get("customerPhone").setState("bCanModify", false);
        viewModel.get("customerBank_openBank_name").setState("bCanModify", false);
        viewModel.get("customerBankAccount").setState("bCanModify", false);
        viewModel.get("party_name").setState("bCanModify", false);
        viewModel.get("partyDept_name").setState("bCanModify", false);
        viewModel.get("partyPsn_name").setState("bCanModify", false);
        viewModel.get("partyAddress").setState("bCanModify", false);
        viewModel.get("partyPhone").setState("bCanModify", false);
        viewModel.get("bankaccount").setState("bCanModify", false);
        viewModel.get("pk_fct_ar_b_nbList").setState("bCanModify", false);
        viewModel.get("pk_fct_ar_plan_nbList").setState("bCanModify", false);
        viewModel.get("pk_fct_ar_memora_nbList").setState("bCanModify", false);
        viewModel.biz.do("edit", viewModel);
      }
    } else {
      bill.retentionmoney = bill.retentionmoney + "";
      bill.verifystate = bill.verifystate + "";
      bill.corigcurrencyid_code = "CNY";
      bill.ccurrencyid = "CNY";
      bill.vdef24 = "1";
      bill.ntotalorigmny = bill.ntotaltaxmny;
      debugger;
      if (bill.headQuartersRes == "N") {
        bill.headQuartersRes = "1";
      } else {
        bill.headQuartersRes = "0";
      }
      if (bill.openct == 1) {
        bill.openct = "Y";
      } else {
        bill.openct = "N";
      }
      const depid_code = bill.depid_code.split("_");
      bill.depid_code = depid_code[0];
      const partyDept_code = bill.partyDept_code.split("_");
      bill.partyDept_code = partyDept_code[0];
      const ordersrc_code = bill.ordersrc_code.split("_");
      bill.ordersrc_code = ordersrc_code[0];
      bill.approver = bill.zuizhongshenpiren_mobile;
      const vdef13_code = bill.vdef13_code.split("_");
      bill.vdef13_code = vdef13_code[0];
      bill.pk_fct_ar_b_nbList.forEach((item) => {
        item.pk_financeorg = bill.pk_org_v_code;
        item.ntaxmny = item.norigtaxmny;
        Object.keys(item).forEach((itemKey) => {
          if (itemKey.indexOf("code") > 0 && item[itemKey].indexOf("_global") > 0) {
            item[itemKey] = item[itemKey].split("_")[0];
          }
        });
      });
      bill.pk_fct_ar_bList = bill.pk_fct_ar_b_nbList;
      bill.pk_fct_ar_plan_nbList.forEach((item) => {
        item.pk_financeorg = bill.pk_org_v_code;
        item.accountnum = item.accountnum + "";
        item.unplanmoney = item.unplanmoney + "";
        item.taxmoney = item.taxmoney + "";
        item.orgmoney = item.planmoney;
      });
      bill.pk_fct_ar_planList = bill.pk_fct_ar_plan_nbList;
      bill.pk_fct_ar_memora_nbList.forEach((item) => {
        item.vmemoracode = "1";
        item.recplan = item.recplan + "";
      });
      bill.pk_fct_ar_memoraList = bill.pk_fct_ar_memora_nbList;
      cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.pushneibuct", { bill }, function (err, res) {
        debugger;
        if (res.res.res.code == "1000000000") {
          cb.utils.alert(res.res.res.data.message || res.res.res.message, "error");
        } else if (res.res.res.code == "1000000001") {
          cb.utils.alert(res.res.res.message || res.res.res.message, "error");
        }
      });
    }
  });
let detialLineRecLineMap = {};
viewModel.get("pk_fct_ar_b_nbList") &&
  viewModel.get("pk_fct_ar_b_nbList").on("afterCellValueChange", function (data) {
    if (data.cellName == "norigtaxmny" || data.cellName == "ntaxRate" || data.cellName == "ctaxcodeid_name" || data.cellName == "advertisingtype_name") {
      debugger;
      setLineTax(data);
      createRecLine(data);
      setNtotaltaxmny();
      setPlanRate();
    }
  });
function setPlanRate() {
  const rows = viewModel.get("pk_fct_ar_plan_nbList").getRows();
  const ntotaltaxmny = viewModel.get("ntotaltaxmny").getValue();
  if (rows) {
    let sumRate = 0;
    rows.forEach((item, index) => {
      sumRate += Math.round((item.planmoney / ntotaltaxmny) * 100);
      viewModel.get("pk_fct_ar_plan_nbList").setCellValue(index, "planrate", Math.round((item.planmoney / ntotaltaxmny) * 100));
    });
    if (sumRate != 100) {
      const planrate = viewModel.get("pk_fct_ar_plan_nbList").getCellValue(0, "planrate");
      viewModel.get("pk_fct_ar_plan_nbList").setCellValue(0, "planrate", planrate + 100 - sumRate);
    }
  }
  debugger;
}
function setLineTax(data) {
  const row = viewModel.get("pk_fct_ar_b_nbList").getRow(data.rowIndex);
  if (row.ntaxRate && row.norigtaxmny) {
    const norigmny = Math.round((row.norigtaxmny / (1 + row.ntaxRate / 100)) * 100) / 100; // 未税金额
    const tax = row.norigtaxmny - norigmny;
    viewModel.get("pk_fct_ar_b_nbList").setCellValue(data.rowIndex, "ntax", tax);
    viewModel.get("pk_fct_ar_b_nbList").setCellValue(data.rowIndex, "norigmny", norigmny);
  }
}
function setNtotaltaxmny() {
  const rows = viewModel.get("pk_fct_ar_b_nbList").getRows();
  let ntotaltaxmny = 0;
  rows.forEach((item) => (ntotaltaxmny += item.norigtaxmny));
  viewModel.get("ntotaltaxmny").setValue(ntotaltaxmny);
  let norigmny = 0;
  rows.forEach((item1) => (norigmny += item1.norigmny));
  viewModel.get("untaxmny").setValue(norigmny);
  //设置表头税率
  if (rows) {
    viewModel.get("taxrate_name").setValue(rows[0].ctaxcodeid_name);
    viewModel.get("taxrate").setValue(rows[0].ctaxcodeid);
    viewModel.get("taxrate_ntaxRate").setValue(rows[0].ntaxRate);
  }
}
function createRecLine(data) {
  const rows = viewModel.get("pk_fct_ar_b_nbList").getRows();
  const bill = viewModel.getAllData();
  let openct = bill.openct;
  if (bill.openct == 1) {
    const row = rows[0];
    const srcRow = srcRowIndex(row); // 来源行
    refreshDetialLineRecLineMap();
    if (detialLineRecLineMap[srcRow]) {
      viewModel.get("pk_fct_ar_plan_nbList").deleteRows(detialLineRecLineMap[srcRow]);
    }
    const endtime = new Date(row.endtime);
    const date = new Date(endtime.getFullYear(), endtime.getMonth() + 1, 0);
    const rowData = {
      accountnum: 1,
      begindate: row.bengintime,
      enddate: row.endtime,
      date: formatDate(date),
      planmoney: row.norigtaxmny,
      unplanmoney: row.norigmny,
      taxmoney: row.ntax,
      srcRowIndex: srcRow,
      shuilv: row.ctaxcodeid,
      planrate: 100,
      shuilv_name: row.ctaxcodeid_name,
      advertisingtype: row.advertisingtype,
      advertisingtype_name: row.advertisingtype_name
    };
    const result = viewModel.get("pk_fct_ar_plan_nbList").appendRow(rowData);
  } else {
    for (let x = 0; x < rows.length; x++) {
      const row = rows[x];
      if (row.installmenttype_name && row.advertisingtype && row.norigtaxmny && row.bengintime && row.endtime && row.ntax) {
        const srcRow = srcRowIndex(row); // 来源行
        refreshDetialLineRecLineMap();
        if (detialLineRecLineMap[srcRow]) {
          viewModel.get("pk_fct_ar_plan_nbList").deleteRows(detialLineRecLineMap[srcRow]);
        }
        if (row.installmenttype_name == "客户盖章确认收入") {
          const endtime = new Date(row.endtime);
          const date = new Date(endtime.getFullYear(), endtime.getMonth() + 1, 0);
          const rowData = {
            accountnum: 1,
            begindate: row.bengintime,
            enddate: row.endtime,
            date: formatDate(date),
            planmoney: row.norigtaxmny,
            unplanmoney: row.norigmny,
            taxmoney: row.ntax,
            srcRowIndex: srcRow,
            shuilv: row.ctaxcodeid,
            shuilv_name: row.ctaxcodeid_name,
            advertisingtype: row.advertisingtype,
            advertisingtype_name: row.advertisingtype_name
          };
          const result = viewModel.get("pk_fct_ar_plan_nbList").appendRow(rowData);
        }
        if (row.installmenttype_name == "按月确认收入" || row.installmenttype_name == "按季度确认收入") {
          let mnyPerDay = Math.floor((row.norigtaxmny / getDays(row.bengintime, row.endtime)) * 100) / 100;
          let months;
          if (row.installmenttype_name == "按月确认收入") {
            months = groupByMonth(row, mnyPerDay, srcRow);
          }
          if (row.installmenttype_name == "按季度确认收入") {
            months = groupByQuarter(row, mnyPerDay, srcRow);
          }
          months.forEach((item, index) => {
            item.accountnum = index + 1;
            const result = viewModel.get("pk_fct_ar_plan_nbList").appendRow(item);
          });
          debugger;
        }
      }
    }
  }
}
function srcRowIndex(row) {
  return row.advertisingtype + row.bengintime + row.endtime;
}
function groupByMonth(row, price, srcRowIndex) {
  const totalMoney = row.norigtaxmny;
  const tax = row.ntax;
  const startDate = new Date(row.bengintime);
  const endDate = new Date(row.endtime);
  let startMonthNum = startDate.getFullYear() * 12 + startDate.getMonth();
  const endMonthNum = endDate.getFullYear() * 12 + endDate.getMonth();
  let results = [];
  let sumMoney = 0; // 确认收入含税金额
  let sumTax = 0;
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
    result.rate = Math.floor((result.planmoney / totalMoney) * 100);
    result.date = formatDate(end);
    result.taxmoney = Math.round((result.rate / 100) * tax);
    result.unplanmoney = result.planmoney - result.taxmoney;
    result.srcRowIndex = srcRowIndex;
    result.advertisingtype = row.advertisingtype;
    result.advertisingtype_name = row.advertisingtype_name;
    (result.shuilv = row.ctaxcodeid), (result.shuilv_name = row.ctaxcodeid_name), results.push(result);
    sumMoney += result.planmoney;
    sumTax += result.taxmoney;
    startMonthNum++;
  }
  results[0].planmoney = results[0].planmoney + totalMoney - sumMoney;
  results[0].taxmoney = results[0].taxmoney + tax - sumTax;
  results[0].unplanmoney = results[0].planmoney - results[0].taxmoney;
  debugger;
  return results;
}
function groupByQuarter(row, price, srcRowIndex) {
  const totalMoney = row.norigtaxmny;
  const tax = row.ntax;
  const startDate = new Date(row.bengintime);
  const endDate = new Date(row.endtime);
  let startMonthNum = startDate.getFullYear() * 12 + startDate.getMonth();
  const endMonthNum = endDate.getFullYear() * 12 + endDate.getMonth();
  let results = [];
  let begining;
  let sumMoney = 0;
  let sumTax = 0;
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
      result.rate = Math.floor((result.planmoney / totalMoney) * 100);
      result.date = formatDate(end);
      result.taxmoney = Math.round((result.rate / 100) * tax);
      result.unplanmoney = result.planmoney - result.taxmoney;
      result.srcRowIndex = srcRowIndex;
      result.advertisingtype = row.advertisingtype;
      result.advertisingtype_name = row.advertisingtype_name;
      (result.shuilv = row.ctaxcodeid), (result.shuilv_name = row.ctaxcodeid_name), (begining = null);
      sumMoney += result.planmoney;
      sumTax += result.taxmoney;
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
    result.rate = Math.floor((result.planmoney / totalMoney) * 100);
    result.date = formatDate(end);
    result.taxmoney = Math.round((result.rate / 100) * tax);
    result.unplanmoney = result.planmoney - result.taxmoney;
    result.srcRowIndex = srcRowIndex;
    result.advertisingtype = row.advertisingtype;
    result.advertisingtype_name = row.advertisingtype_name;
    (result.shuilv = row.ctaxcodeid), (result.shuilv_name = row.ctaxcodeid_name), (begining = null);
    sumMoney += result.planmoney;
    sumTax += result.taxmoney;
    results.push(result);
  }
  results[0].planmoney = results[0].planmoney + totalMoney - sumMoney;
  results[0].taxmoney = results[0].taxmoney + tax - sumTax;
  results[0].unplanmoney = results[0].planmoney - results[0].taxmoney;
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
viewModel.on("customInit", function (data) {
  // 广告及宣传服务合同详情--页面初始化
  const rows = viewModel.get("pk_fct_ar_plan_nbList").getRows();
  const ntotaltaxmny = viewModel.get("ntotaltaxmny").getValue();
  if (rows) {
    let sumRate = 0;
    rows.forEach((item, index) => {
      sumRate += Math.round((item.planmoney / ntotaltaxmny) * 100);
      viewModel.get("pk_fct_ar_plan_nbList").setCellValue(index, "planrate", Math.round((item.planmoney / ntotaltaxmny) * 100));
    });
    if (sumRate != 100) {
      const planrate = viewModel.get("pk_fct_ar_plan_nbList").getCellValue(0, "planrate");
      viewModel.get("pk_fct_ar_plan_nbList").setCellValue(0, "planrate", planrate + 100 - sumRate);
    }
  }
});
viewModel.get("pk_fct_ar_plan_nbList") &&
  viewModel.get("pk_fct_ar_plan_nbList").on("afterCellValueChange", function (data) {
    // 确认收入含税金额--值改变
    if (data.cellName == "planmoney") {
      debugger;
      setPlanRate();
    }
  });
viewModel.on("afterWorkflowBeforeQueryAsync", function (args) {
  debugger;
  const bill = viewModel.getAllData();
  let htwbsc = bill.vdef9;
});
viewModel.get("button116tb") &&
  viewModel.get("button116tb").on("click", function (data) {
    // 按钮--
    debugger;
    var mode = viewModel.getParams().mode;
    if (mode !== "edit") {
      viewModel.get("button116tb").setVisible(false);
      viewModel.get("subscribedate").setVisible(true);
      viewModel.get("subscribedate").setState("bCanModify", true);
      viewModel.get("subscribedate").setState("bIsNull", false);
      viewModel.get("ordersrc_name").setState("bCanModify", false);
      viewModel.get("pk_org_v_name").setState("bCanModify", false);
      viewModel.get("depid_name").setState("bCanModify", false);
      viewModel.get("personnelid_name").setState("bCanModify", false);
      viewModel.get("ctname").setState("bCanModify", false);
      viewModel.get("vdef13_name").setState("bCanModify", false);
      viewModel.get("ordersrc_name").setState("bCanModify", false);
      viewModel.get("valdate").setState("bCanModify", false);
      viewModel.get("invallidate").setState("bCanModify", false);
      viewModel.get("xiangmu_name").setState("bCanModify", false);
      viewModel.get("openct").setState("bCanModify", false);
      viewModel.get("taxrate_name").setState("bCanModify", false);
      viewModel.get("untaxmny").setState("bCanModify", false);
      viewModel.get("settletype_name").setState("bCanModify", false);
      viewModel.get("guaranteeperiod").setState("bCanModify", false);
      viewModel.get("retentionmoney").setState("bCanModify", false);
      viewModel.get("earlysign").setState("bCanModify", false);
      viewModel.get("vdef18").setState("bCanModify", false);
      viewModel.get("vdef9").setState("bCanModify", false);
      viewModel.get("ccontract1_id").setState("bCanModify", false);
      viewModel.get("pk_customer_v_name").setState("bCanModify", false);
      viewModel.get("customerPsn").setState("bCanModify", false);
      viewModel.get("customerAddress").setState("bCanModify", false);
      viewModel.get("customerPhone").setState("bCanModify", false);
      viewModel.get("customerBank_openBank_name").setState("bCanModify", false);
      viewModel.get("customerBankAccount").setState("bCanModify", false);
      viewModel.get("party_name").setState("bCanModify", false);
      viewModel.get("partyDept_name").setState("bCanModify", false);
      viewModel.get("partyPsn_name").setState("bCanModify", false);
      viewModel.get("partyAddress").setState("bCanModify", false);
      viewModel.get("partyPhone").setState("bCanModify", false);
      viewModel.get("bankaccount").setState("bCanModify", false);
      viewModel.get("pk_fct_ar_b_nbList").setState("bCanModify", false);
      viewModel.get("pk_fct_ar_plan_nbList").setState("bCanModify", false);
      viewModel.get("pk_fct_ar_memora_nbList").setState("bCanModify", false);
      viewModel.biz.do("edit", viewModel);
    }
  });
viewModel.on("beforeSave", function (args) {
  debugger;
  //保存前判断表体金额含税和不含税合计
  const bill = viewModel.getAllData();
  const fct_bs = bill.pk_fct_ar_b_nbList;
  if (!fct_bs.length > 0) {
    cb.utils.alert("明细信息表体不能为空", "error");
    return false;
  }
  for (let i = 0; i < fct_bs.length; i++) {
    let fctb = fct_bs[i];
    if (fctb.ntax == "0") {
      fctb.ntax = 0;
    }
    if (fctb.norigmny == "0") {
      fctb.norigmny = 0;
    }
    const money = (fctb.norigmny + fctb.ntax).toFixed(2);
    if (money.toFixed(2) !== fctb.norigtaxmny.toFixed(2)) {
      cb.utils.alert("表体不含税金额+税额不等于含税金额", "error");
      return false;
    }
  }
  const fct_plan = bill.pk_fct_ar_plan_nbList;
  if (!fct_plan.length > 0) {
    cb.utils.alert("收入分期表体不能为空", "error");
    return false;
  }
  let ntotaltaxmny = 0;
  for (let x = 0; x < fct_plan.length; x++) {
    let fcplan = fct_plan[x];
    ntotaltaxmny = ntotaltaxmny + fcplan.planmoney;
  }
  if (ntotaltaxmny.toFixed(2) != bill.ntotaltaxmny.toFixed(2)) {
    cb.utils.alert("收入分期表体金额合计不等于合同总金额", "error");
    return false;
  }
});