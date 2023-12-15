function startFunction(event) {
  var viewModel = this;
  var url = "https://www.example.com/";
  var proxy = cb.rest.DynamicProxy.create({
    ensure: {
      url: url,
      method: "POST"
    }
  });
  var params = {
    isReturn: 0,
    keyword: "",
    billnum: "st_storecheckreality",
    codeType: "",
    snWarehouse: 2406013652047104,
    iSerialManage: false,
    isMaterial: false,
    storeCheckRange: 0,
    orgid: "youridHere",
    isGoodsPosition: true,
    transtype: "2404585276445972",
    keywords: '{"1004000001":1,"CM000001":1}'
  };
  proxy.ensure(params, function (err, result) {
    alert(err);
  });
}