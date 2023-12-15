viewModel.get("button19mh") &&
  viewModel.get("button19mh").on("click", function (data) {
    //存量--单击
    let productid = viewModel.get("product").getValue();
    cb.rest.invokeFunction("AT18B6A51C09080007.backDesignerFunction.apigetqty", { productid: productid }, function (err, res) {
      viewModel.get("new2").setValue(res.res[0].currentqty);
    });
  });