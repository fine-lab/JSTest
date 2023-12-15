viewModel.get("button27cj") &&
  viewModel.get("button27cj").on("click", function (data) {
    //测试--单击
    let gm = viewModel.getGridModel("inquiry_SonList");
    let len = gm.getRows().length;
    for (let i = 0; i < len; i++) {
      let proid = gm.getCellValue(i, "product");
      cb.rest.invokeFunction("AT18B6A51C09080007.backDesignerFunction.apigetqty", { productid: proid }, function (err, res) {
        let shu = res.res[0].currentqty;
        gm.setCellValue(i, "qty", shu);
      });
    }
  });