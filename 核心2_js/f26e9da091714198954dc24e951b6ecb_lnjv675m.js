viewModel.on("customInit", function (data) {
  //账户余额初始化--页面初始化
  viewModel.on("afterMount", function () {
    //查询区相关脚本
    let filterViewModelInfo = viewModel.getCache("FilterViewModel");
    filterViewModelInfo.on("afterInit", function (data) {
      let filterModelInfo = filterViewModelInfo.get("BankAccount");
      let realModelInfo = filterModelInfo.getFromModel();
      //企业银行账户参照打开前事件
      realModelInfo.on("beforeBrowse", function () {
        //赋予查询区字段初始值
        let org_ids = filterViewModelInfo.get("org_id").getFromModel().getValue();
        if (org_ids !== undefined && org_ids !== null) {
          var myFilter = { isExtend: true, simpleVOs: [] };
          myFilter.simpleVOs.push({
            field: "orgid",
            op: "in",
            value1: org_ids
          });
          realModelInfo.setFilter(myFilter);
        } else {
          cb.utils.alert("请先选择组织！", "info");
          return false;
        }
      });
      //组织值改变后清空账户信息
      let filterModelInfo_org_id = filterViewModelInfo.get("org_id");
      let realModelInfo_org_id = filterModelInfo_org_id.getFromModel();
      realModelInfo_org_id.on("afterValueChange", function (data) {
        filterViewModelInfo.get("BankAccount").getFromModel().clear();
        filterViewModelInfo.get("BankAccount_no").getFromModel().clear();
      });
      let BankAccount = filterViewModelInfo.get("BankAccount");
      let realModelInfo_BankAccount = BankAccount.getFromModel();
      realModelInfo_BankAccount.on("afterValueChange", function (data) {
        filterViewModelInfo.get("BankAccount_no").getFromModel().clear();
      });
    });
  });
});