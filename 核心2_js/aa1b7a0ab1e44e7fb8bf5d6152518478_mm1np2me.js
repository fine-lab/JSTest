viewModel.on("beforeSubmit", function (data) {
  let vouchdate = viewModel.get("vouchdate").getValue();
  let expiryDate = viewModel.get("headFreeItem!define4").getValue();
  var returnPromise = new cb.promise();
  vouchdate = Date.parse(vouchdate); //单据日期
  expiryDate = Date.parse(expiryDate); //合同失效日期
  if (!isNaN(expiryDate)) {
    //如果单据日期大于合同失效日期，提示合同失效，订单提交失败
    if (vouchdate > expiryDate) {
      cb.utils.alert("合同失效，订单提交失败", "error");
      return returnPromise;
    } else {
      let date = Math.ceil((expiryDate - vouchdate) / (1000 * 60 * 60 * 24));
      if (date <= 30) {
        cb.utils.alert("合同即将失效，请续签合同,还剩" + date + "天", "info");
      }
    }
  }
});