viewModel.on("customInit", function (data) {
  //上市许可持有人参照代码，主要实现了新增按钮弹出新增上市许可持有人的模态框
  viewModel.get("button1mh").on("click", function (data) {
    let orgId = viewModel.getCache("parentViewModel").get("org_id").getValue();
    let orgName = viewModel.getCache("parentViewModel").get("org_id_name").getValue();
    let billData = {
      billtype: "Voucher",
      billno: "4e371acc_add",
      params: {
        mode: "add",
        gspOrgId: orgId,
        gspOrgName: orgName
      }
    };
    cb.loader.runCommandLine("bill", billData, viewModel.getCache("parentViewModel"));
  });
});