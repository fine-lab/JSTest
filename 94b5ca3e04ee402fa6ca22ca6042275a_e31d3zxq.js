viewModel.on("customInit", function (data) {
  //真·对方业务员参照代码，主要实现了新增按钮弹出新增对方业务员的模态框
  viewModel.get("button6zj").on("click", function (data) {
    debugger;
    let parentParam = viewModel.getCache("parentViewModel").getParams();
    let billData = {
      billtype: "Voucher",
      billno: "fed3e035_add",
      params: {
        mode: "add",
        gspOrgId: parentParam.gspOrgId,
        gspOrgName: parentParam.gspOrgName,
        gspCustomer: parentParam.gspCustomer,
        gspCustomerName: parentParam.gspCustomerName,
        gspSupplier: parentParam.gspSupplier,
        gspSupplierName: parentParam.gspSupplierName
      }
    };
    cb.loader.runCommandLine("bill", billData, viewModel.getCache("parentViewModel"));
  });
});