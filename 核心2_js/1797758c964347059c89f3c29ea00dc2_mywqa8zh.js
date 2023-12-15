viewModel.get("button5vf").on("click", function (args) {
  debugger;
  let bglx = viewModel.getGridModel().getRow(args.index);
  if (bglx == 1) {
    var zt = 5;
    let Name = {
      billtype: "Voucher", // 单据类型
      billno: "770602ef", // 单据号
      params: {
        mode: "add", // (编辑态edit、新增态add)
        //传参
        can: zt
      }
    };
  }
});