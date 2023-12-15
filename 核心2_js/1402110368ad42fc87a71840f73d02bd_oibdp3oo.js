viewModel.get("province_1734190404237000713") &&
  viewModel.get("province_1734190404237000713").on("beforeDblClick", function (data) {
    // 表格--行双击前执行
  });
viewModel.get("button22gf") &&
  viewModel.get("button22gf").on("click", function (data) {
    // 同步省信息--单击
    cb.utils.isPremisesEnv();
    cb.rest.invokeFunction("AT16388E3408680009.Custom.Province", { r: 2 }, function (err, res) {
      console.log(err);
      console.log(res);
    });
  });