viewModel.on("afterLoadData", function (args) {
  debugger;
  let id = args.id;
  let yifangdanwei_1 = args.yifangdanwei;
  let org_id = args.org_id;
  let org_id_name = args.org_id_name;
  if (id) {
  } else {
    if (org_id_name == undefined) {
      cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.puordedata", {}, function (err, res) {
        debugger;
        if (res) {
          if (res.org && res.org[0]) {
            viewModel.get("yifangdanwei").setValue(res.org[0].orgid);
            viewModel.get("yifangdanwei_name").setValue(res.org[0].name);
            viewModel.get("org_id").setValue(res.org[0].orgid);
            viewModel.get("org_id_name").setValue(res.org[0].name);
            getbank(res.org[0].name, res.org[0].orgid);
          }
          //销售部门 depid_name
          if (res.dept && res.dept[0]) {
            viewModel.get("pk_dept").setValue(res.dept[0].id);
            viewModel.get("pk_dept_name").setValue(res.dept[0].name);
          }
          // 销售人员
          viewModel.get("pk_psndoc").setValue(res.user.staffId);
          viewModel.get("pk_psndoc_name").setValue(res.user.name);
        }
      });
    }
  }
});
//审批--单击
viewModel.on("afterWorkflow", function (args) {
  debugger;
  const bill = viewModel.getAllData();
  if (args.res.verifystate == 2) {
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.creatPurchase", { bill }, function (err, res) {
      debugger;
    });
  } else if (args.res.verifystate == 1) {
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.deletePurchase", { bill }, function (err, res) {
      debugger;
    });
  }
});
viewModel.get("po_orderct_bList") &&
  viewModel.get("po_orderct_bList").on("afterCellValueChange", function (data) {
    //税率--值改变
    if (data.cellName == "rate_name") {
      let rata = data.value.ntaxRate;
      rata = rata / 100;
      let ratatax = 1 + rata;
      const datacard = viewModel.getAllData();
      let money = datacard.po_orderct_bList[data.rowIndex].money;
      let materital = datacard.po_orderct_bList[data.rowIndex].name;
      debugger;
      let num = datacard.po_orderct_bList[data.rowIndex].num;
      let rateprice = ((money * num) / ratatax) * rata;
      let unratemoney = (money * num) / ratatax;
      let moneynum = money * num;
      viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "ratemoney", rateprice, null, true);
      viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "unratemoney", unratemoney, null, true);
      viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "moneynum", moneynum, null, true);
      let rows = viewModel.getGridModel().getRows();
      debugger;
      let money1 = null;
      rows.forEach((item) => {
        money1 = item.moneynum + money1;
        viewModel.get("hejijine").setValue(money1);
        debugger;
        if (money1 >= 5000) {
          viewModel.get("caigoujieguo_code").setState("bIsNull", false);
        } else {
          viewModel.get("caigoujieguo_code").setState("bIsNull", true);
        }
      });
      debugger;
    }
    if (data.cellName == "money") {
      let money = data.value;
      const datacard = viewModel.getAllData();
      debugger;
      let ratename = datacard.po_orderct_bList[data.rowIndex].rate;
      let ntaxrate = null;
      let ratatax = null;
      cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.raterax", { ratename }, function (err, res) {
        ntaxrate = res.res[0].ntaxRate;
        ntaxrate = ntaxrate / 100;
        ratatax = 1 + ntaxrate;
        let num = datacard.po_orderct_bList[data.rowIndex].num;
        let rateprice = ((money * num) / ratatax) * ntaxrate;
        let unratemoney = (money * num) / ratatax;
        let moneynum = money * num;
        viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "ratemoney", rateprice, null, true);
        viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "unratemoney", unratemoney, null, true);
        viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "moneynum", moneynum, null, true);
        let rows = viewModel.getGridModel().getRows();
        let money1 = null;
        rows.forEach((item) => {
          money1 = item.moneynum + money1;
          viewModel.get("hejijine").setValue(money1);
          debugger;
          if (money1 >= 5000) {
            viewModel.get("caigoujieguo_code").setState("bIsNull", false);
          } else {
            viewModel.get("caigoujieguo_code").setState("bIsNull", true);
          }
        });
        debugger;
      });
      debugger;
    }
    if (data.cellName == "num") {
      let num = data.value;
      const datacard = viewModel.getAllData();
      debugger;
      let ratename = datacard.po_orderct_bList[data.rowIndex].rate;
      let ntaxrate = null;
      let ratatax = null;
      cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.raterax", { ratename }, function (err, res) {
        ntaxrate = res.res[0].ntaxRate;
        ntaxrate = ntaxrate / 100;
        ratatax = 1 + ntaxrate;
        let money = datacard.po_orderct_bList[data.rowIndex].money;
        let rateprice = ((money * num) / ratatax) * ntaxrate;
        let unratemoney = (money * num) / ratatax;
        let moneynum = money * num;
        viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "ratemoney", rateprice, null, true);
        viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "unratemoney", unratemoney, null, true);
        viewModel.get("po_orderct_bList").setCellValue(data.rowIndex, "moneynum", moneynum, null, true);
        let rows = viewModel.getGridModel().getRows();
        let money1 = null;
        rows.forEach((item) => {
          money1 = item.moneynum + money1;
          viewModel.get("hejijine").setValue(money1);
          debugger;
          if (money1 >= 5000) {
            viewModel.get("caigoujieguo_code").setState("bIsNull", false);
          } else {
            viewModel.get("caigoujieguo_code").setState("bIsNull", true);
          }
        });
        debugger;
      });
    }
  });
viewModel.get("org_id_name") &&
  viewModel.get("org_id_name").on("afterValueChange", function (data) {
    //采购组织--值改变后
    debugger;
    viewModel.get("yifangdanwei").setValue(viewModel.get("org_id").getValue());
    viewModel.get("yifangdanwei_name").setValue(viewModel.get("org_id_name").getValue());
    const value = viewModel.get("yifangdanwei_name").getValue();
    const value1 = viewModel.get("yifangdanwei").getValue();
    getbank(value, value1);
  });
viewModel.get("yifangdanwei_name") &&
  viewModel.get("yifangdanwei_name").on("afterValueChange", function (data) {
    //甲方单位--值改变后
    debugger;
    const value = viewModel.get("yifangdanwei_name").getValue();
    const value1 = viewModel.get("yifangdanwei").getValue();
    getbank(value, value1);
  });
viewModel.get("yifangdanweinew_name") &&
  viewModel.get("yifangdanweinew_name").on("afterValueChange", function (data) {
    //乙方单位--值改变后
    const value = viewModel.get("yifangdanweinew").getValue();
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.supplierbank", { value }, function (err, res) {
      let account = res.res[0].account;
      viewModel.get("yinxingzhanghu").setValue(account);
      viewModel.get("danweidianhua").setValue(res.res2[0].contactphone);
      viewModel.get("yifangdizhi").setValue(res.res3[0].detailAddress);
      debugger;
    });
    debugger;
  });
viewModel.on("customInit", function (data) {
  //采购订单详情--页面初始化
});
function getbank(value, value1) {
  debugger;
  cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.bankname", { value, value1 }, function (err, aa) {
    debugger;
    let name = aa.res1[0].name;
    let id = aa.res1[0].id;
    let bankAccount = aa.res[0].bankAccount;
    viewModel.get("kaihuxing").setValue(aa.bank[0].id);
    viewModel.get("kaihuxing_name").setValue(aa.bank[0].acctName);
    viewModel.get("yinxingdanganzhujian").setValue(id);
    viewModel.get("yinxingdanganmingchen").setValue(name);
    viewModel.get("yinxingdanganbianma").setValue(aa.res1[0].code);
    viewModel.get("jiafangyinxingzhanghu").setValue(bankAccount);
  });
}