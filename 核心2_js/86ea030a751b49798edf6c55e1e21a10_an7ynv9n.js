viewModel.getGridModel().on("afterCellValueChange", function (data) {
  let code = data.value.code;
  let index = data.rowIndex;
  let cellname = data.cellName;
  let specialid = viewModel.getAllData().businessprofile;
  //根据特价档案的商品id去查询对应的优惠数量
  if (cellname == "product_name_name") {
    cb.rest.invokeFunction("GT80750AT4.specialProduct.querySpecial", { specialid: specialid, code: code }, function (err, res) {
      let num = res.result[0].num;
      viewModel.get("storeprofile_bList").setCellValue(index, "specilnum", num);
      console.log(res);
    });
  }
});