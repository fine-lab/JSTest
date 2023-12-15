viewModel.on("customInit", function (data) {
  // 医药物料档案列表--页面初始化
  let gridModel = viewModel.getGridModel();
  viewModel.get("button16tb").on("click", function (data) {
    let type = gridModel.getRows()[data.index].isSku;
    if (type != 0 && type != "0") {
      cb.utils.alert("目前只支持首营方式为【物料】的分配", "error");
    } else {
      let id = data.id4ActionAuth;
      let billData = {
        billtype: "VoucherList",
        billno: "gspSelectOrgPop",
        params: {
          mode: "add",
          material: gridModel.getRows()[data.index].material,
          //这里distributionType只能为：material，customer，supplier
          distributionType: "material",
          relationId: id
        }
      };
      cb.loader.runCommandLine("bill", billData, viewModel);
    }
  });
});