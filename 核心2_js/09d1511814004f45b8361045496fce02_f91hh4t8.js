viewModel.get("pk_customer_v_name") &&
  viewModel.get("pk_customer_v_name").on("afterReferOkClick", function (data) {
    debugger;
    console.log("pk_customer_v_name");
    // 合同编码--值改变后
    cb.rest.invokeFunction("AT168837E809980003.front.queryCustInvoice", { data }, function (err, res) {
      debugger;
      viewModel.get("customerBank").setValue(res.res[0].name);
      viewModel.get("customerBankAccount").setValue(res.res[0].bankAccount);
      viewModel.get("customerPhone").setValue(res.res[0].telephone);
      viewModel.get("customerEmail").setValue(res.res[0].receievInvoiceEmail);
      viewModel.get("customerAddress").setValue(res.res[0].address);
      viewModel.get("customerPsn").setValue(res.rest[0].fullName);
      debugger;
    });
  });
viewModel.on("afterLoadData", function (args) {
  cb.rest.invokeFunction("AT168837E809980003.front.queryPsn", {}, function (err, res) {
    var id = res.res;
    var dd = res.ress;
    var currentUser = JSON.parse(id).currentUser;
    var psnid = currentUser.id;
    viewModel.get("baseOrg_name").setValue(currentUser.orgName);
    viewModel.get("personnelid_name").setValue(currentUser.name);
    viewModel.get("depid_name").setValue(currentUser.deptName);
    viewModel.get("party_name").setValue(currentUser.orgName);
    viewModel.get("partyPsn_name").setValue(currentUser.Name);
    viewModel.get("partyDept_id").setValue(currentUser.deptName);
    for (var i = 0; i < dd.length; i++) {
      if (dd[i].id == psnid) {
        viewModel.get("partyPhone").setValue(dd[i].mobile);
        debugger;
      }
    }
    debugger;
  });
  debugger;
});
viewModel.get("button60jd") &&
  viewModel.get("button60jd").on("click", function (data) {
    // 盖章--单击
    const bill = viewModel.getAllData();
    bill.pk_fct_ar_bList.forEach((item) => (item.pk_financeorg = bill.baseOrg_code));
    bill.pk_fct_ar_planList.forEach((item) => {
      item.pk_financeorg = bill.baseOrg_code;
      item.accountnum = item.accountnum + "";
    });
    cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.createNCCArCt", { bill }, function (err, res) {
      debugger;
    });
  });