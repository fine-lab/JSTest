viewModel.on("afterLoadData", function (args) {
  cb.rest.invokeFunction("AT168837E809980003.backOpenApiFunction.queryCurrentUnit", {}, function (err, res) {
    if (res) {
      debugger;
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
      //采购组织 pk_org_v_name
      if (res.org && res.org[0]) {
        viewModel.get("pk_org_v").setValue(res.org[0].orgid);
        viewModel.get("pk_org_v_name").setValue(res.org[0].name);
      }
      //采购部门 depid_name
      if (res.dept && res.dept[0]) {
        viewModel.get("depid").setValue(res.dept[0].id);
        viewModel.get("depid_name").setValue(res.dept[0].name);
      }
      // 采购人员
      viewModel.get("personnelid").setValue(res.user.staffId);
      viewModel.get("personnelid_name").setValue(res.user.name);
    }
  });
});