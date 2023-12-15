viewModel.get("button27di") &&
  viewModel.get("button27di").on("click", function (oo) {
    // 生成采购订单--单击
    let vmData = viewModel.getData();
    let SupplyDetailList = vmData.SupplyDetailList;
    function newPseudoGuid() {
      var guid = "";
      for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
      }
      return guid;
    }
    let request = {};
    request.uri = "/yonbip/scm/purchaseorder/singleSave_v1";
    let data = {};
    data.resubmitCheckKey = newPseudoGuid();
    data.bustype_code = "JY01_CGDD_ZDRK_WYF";
    data.currency_code = "CNY";
    data.code = vmData.code;
    data.exchRate = 1;
    data.exchRateType = "lnjv675m";
    data.invoiceVendor_code = vmData.SaleOrgCode; //供应商组织
    data.natCurrency_code = "CNY";
    data.natMoney = vmData.natMoney;
    data.natSum = vmData.natSum;
    data.org_code = vmData.PurchaseOrgCode;
    data.vouchdate = vmData.BillDate;
    data._status = "Insert";
    data.vendor_code = vmData.SaleOrgCode;
    data.purchaseOrders = [];
    for (let i = 0; i < SupplyDetailList.length; i++) {
      let details = SupplyDetailList[i];
      let obj = {};
      obj.inInvoiceOrg_code = vmData.PurchaseOrgCode; //收票组织编码
      obj.inOrg_code = vmData.PurchaseOrgCode; //收货组织编码
      obj.invExchRate = 1; //采购换算率
      obj.natTaxUnitPrice = details.DealPrice; //本币含税单价
      obj.natUnitPrice = details.DealPrice / (1 + details.intaxRate / 100); //本币无税单价
      obj.natMoney = obj.natUnitPrice * details.DealQuantity; //本币无税金额
      obj.natSum = details.DealPrice * details.DealQuantity; //本币含税金额
      obj.oriTax = obj.natSum - obj.natMoney; //税额
      obj.taxitems_code = details.intaxCode; //税目税率编码
      obj.priceQty = details.DealQuantity; //计价数量
      obj.product_cCode = details.PurchaseProductCode; //物料编码
      obj.priceUOM_Code = "KGM"; //计价单位
      obj.purUOM_Code = "KGM"; //采购单位
      obj.qty = details.DealQuantity; //数量
      obj.subQty = details.DealQuantity; //采购数量
      obj.unitExchangeTypePrice = 0; //计价单位转换率的换算方式：0固定换算；1浮动换算
      obj.unitExchangeType = 0; //采购单位转换率的换算方式：0固定换算；1浮动换算
      obj.invPriceExchRate = 1; //计价换算率
      obj.unit_code = "KGM"; //主计量
      obj.oriMoney = obj.natMoney; //无税金额
      obj.oriSum = obj.natSum; //含税金额
      obj.natTax = obj.natSum - obj.natMoney; //本币税额
      obj.oriTaxUnitPrice = details.DealPrice; //含税单价
      obj.oriUnitPrice = obj.natUnitPrice; //无税单价
      obj._status = "Insert";
      data.purchaseOrders.push(obj);
    }
    request.body = { data: data };
    cb.rest.invokeFunction("AT15A7A87008300006.purchaseorder.purchaseorder", request, function (err, res) {
      if (err) {
        console.log("err", JSON.stringify(err));
      }
      if (res) {
        console.log("res", res.sysOrder.message);
      }
    });
  });