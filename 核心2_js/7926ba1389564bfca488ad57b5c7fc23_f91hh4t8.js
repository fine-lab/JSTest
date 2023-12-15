viewModel.get("pk_customer_v_name") &&
  viewModel.get("pk_customer_v_name").on("afterReferOkClick", function (data) {
    // 甲方单位--参照弹窗确认按钮点击后
    debugger;
    cb.rest.invokeFunction("AT168837E809980003.front.queryCustInvoice", { data }, function (err, res) {
      debugger;
      viewModel.get("customerBankaccbas").setValue(res.res[0].name);
      viewModel.get("customerEmail").setValue(res.res[0].receievInvoiceEmail);
      viewModel.get("customerAddress").setValue(res.res[0].address);
      viewModel.get("bankaccbas").setValue(res.res[0].bankAccount);
      viewModel.get("customerTel").setValue(res.res[0].telephone);
      viewModel.get("customerjb").setValue(res.rest[0].fullName);
      debugger;
    });
  });
viewModel.get("button63oe") &&
  viewModel.get("button63oe").on("click", function (data) {
    // 盖章--单击
    const bill = viewModel.getAllData();
    bill.pk_fct_ap_bList.forEach((item) => (item.pk_financeorg = bill.baseOrg_code));
    bill.pk_fct_ap_planList.forEach((item) => {
      item.pk_financeorg = bill.baseOrg_code;
      item.accountnum = item.accountnum + "";
    });
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.createNCCApCt", { bill }, function (err, res) {
      debugger;
    });
  });