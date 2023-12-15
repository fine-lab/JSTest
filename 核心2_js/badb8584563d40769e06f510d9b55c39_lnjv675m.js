viewModel.get("InvestRegisterClass_name") &&
  viewModel.get("InvestRegisterClass_name").on("afterValueChange", function (data) {
    //产权变动类型--值改变后
    let InvestRegisterClass_name = viewModel.get("InvestRegisterClass_name").getValue();
    if (InvestRegisterClass_name == "其他工商登记信息变更") {
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("Outtaxpayerid", "bCanModify", false);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("OutOrgName", "bCanModify", false);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("RegisteredCapital", "bCanModify", false);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("ShareholdingRatio", "bCanModify", false);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("PaidInCapital", "bCanModify", false);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("RegisteredCapitalDate", "bCanModify", false);
    } else {
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("Outtaxpayerid", "bCanModify", true);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("OutOrgName", "bCanModify", true);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("RegisteredCapital", "bCanModify", true);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("ShareholdingRatio", "bCanModify", true);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("PaidInCapital", "bCanModify", true);
      viewModel.getGridModel("OrgRegisterShareholderList").setColumnState("RegisteredCapitalDate", "bCanModify", true);
    }
  });