viewModel.on("afterClear", function (args) {
});
viewModel.on("beforeExecBottomActionLogic", function (args) {
  if (args.key == "Coupon") {
    let storeName = viewModel.getAppContext().user.defaultStoreName;
    //商品行输入后输入会员信息
    let products = viewModel.getBillingContext("products")();
    if (products.length == 0) {
      cb.utils.alert("请先输入商品信息！");
      return false;
    }
    let storeId = viewModel.getAppContext().user.storeId; //门店id
    let storecrminfo = cb.rest.invokeFunction(
      "AT18623B800920000A.api.getstorecrm",
      {
        md: storeId
      },
      function (err, res) {},
      viewModel,
      {
        async: false
      }
    );
    if (storecrminfo.result.code != "200") {
      cb.utils.alert(storecrminfo.result.msg);
      return false;
    }
    let crm = storecrminfo.result.dataInfo.crm; //对应crm
    let shopcode = storecrminfo.result.dataInfo.shopcode; //门店编码
    let taCode = storecrminfo.result.dataInfo.taCode; //crm营业点代码(绿云适用)
    let taName = storecrminfo.result.dataInfo.taName; //crm营业点名称(绿云适用)
    let data = {
      billtype: "Voucher",
      billno: "yb361154e7",
      domainKey: "yourKeyHere",
      params: {
        mode: "edit", // (编辑态edit、新增态add、浏览态browse)
        crm: crm,
        storeId: storeId,
        shopCode: shopcode,
        taCode: taCode,
        taName: taName
      }
    };
    cb.loader.runCommandLine("bill", data, viewModel);
    return false;
  } else {
    return true;
  }
});
viewModel.on("beforeSaveService", function (args) {
  //判断有没有crm缓存
  let crmCache = viewModel.getParams().crmCache;
  if (crmCache) {
    let saveInfo = JSON.parse(args.config.params.data);
    saveInfo.rm_retailvouch.crmCache = crmCache;
    args.config.params.data = JSON.stringify(saveInfo);
  }
});
viewModel.on("afterFinalDefaultSettle", function (argsdata) {
  let crmCache = viewModel.getParams().crmCache;
  if (crmCache) {
    let crm = JSON.parse(crmCache);
    if (crm.accountMoney != 0) {
      const billPaymodes = viewModel.getBillingContext("billPaymodes", "paymode")();
      const payment = viewModel.getBillingContext("payment", "paymode")();
      const finalPaymodes = Object.assign({}, payment, billPaymodes); //最终的结算方式:所有的修改都汇总到这个对象上面,不要更改自己不需要改的支付方式和属性
      let paymethodId = "";
      for (let key in finalPaymodes) {
        if (finalPaymodes[key].paymentMethodCode == "crmczk") {
          let paymode = finalPaymodes[key];
          paymode["show"] = true;
          paymode["value"] = crm.accountMoney;
          paymode["_readOnly"] = true;
          paymode["_noDelete"] = true;
          finalPaymodes[key] = paymode;
          paymethodId = paymode.paymethodId;
        }
      }
      viewModel.billingFunc.setReduxState(
        {
          visible: true,
          paymodes: finalPaymodes,
          currentFocus: paymethodId
        },
        "paymode"
      );
      return false;
    }
  }
});
viewModel.on("beforeShowSuccessTips", function (args) {
  let crmCache = viewModel.getParams().crmCache;
  viewModel.getParams().crmCache = undefined;
  let post = { requestData: args.result, crmCache: crmCache };
  let sendCrm = cb.rest.invokeFunction("AT18623B800920000A.api.ARAPSuccSendCrm", post, function (err, res) {}, viewModel, {
    async: false
  });
  if (sendCrm.result.code != "200") {
    cb.utils.alert(sendCrm.result.msg);
  }
});