viewModel.get("button63ke") &&
  viewModel.get("button63ke").on("click", function (data) {
    //按钮--单击
    let str = viewModel.getGridModel("inquiry_SonList");
    let len = str.getRows().length;
    console.log(str);
    for (let i = 0; i < len; i++) {
      let product = str.getCellValue(i, "product");
      cb.rest.invokeFunction("AT18B6A51C09080007.backDesignerFunction.test", { productid: product }, function (err, res) {
        let reslist = res.res[0].currentqty;
        str.setCellValue(i, "qty", reslist);
      });
    }
  });