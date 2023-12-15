viewModel.get("button53zj") &&
  viewModel.get("button53zj").on("click", function (data) {
    //状态回传--单击
    let saleorder =
      '{"orderDefineCharacter_ICE00105":"Nav1.7等","orderDefineCharacter_ICE00106":"否","agentId":"1703191742186221","orderDefineCharacter_ICE00103":"ABQ-2023070401","corpContact":"10188","transactionTypeId":"XSICE001","orderPrices_currency":"CNY","ICE005":"3034","orderPrices_exchRate":1,"ICE006":"2010","ICE003":"01","ICE004":2,"orderDefineCharacter_ICE00101":"EPR","orderDefineCharacter_ICE00102":"手动离子通道检测","xmxz":"00000011","vouchdate":"2023-07-04","orderDetails":[{"crmid":2846122312221345,"productId":"1655419987231456","oriSum":2500,"priceQty":1,"qty":1,"subQty":1,"orderProductType":"SALE"},{"crmid":2846122312221346,"productId":"1655426739307138","oriSum":3000,"priceQty":1,"qty":1,"subQty":1,"orderProductType":"SALE"},{"crmid":2846122312221347,"productId":"1655293530899113","oriSum":3000,"priceQty":1,"qty":1,"subQty":1,"orderProductType":"SALE"},{"crmid":2846122312221348,"productId":"1655340286935721","oriSum":2500,"priceQty":1,"qty":1,"subQty":1,"orderProductType":"SALE"},{"crmid":2846122312221349,"productId":"1655710733501165","oriSum":2500,"priceQty":1,"qty":1,"subQty":1,"orderProductType":"SALE"},{"crmid":2846122312221350,"productId":"1655710733501165","oriSum":2500,"priceQty":1,"qty":1,"subQty":1,"orderProductType":"SALE"},{"crmid":2846122312221351,"productId":"1655714481816258","oriSum":2500,"priceQty":1,"qty":1,"subQty":1,"orderProductType":"SALE"},{"crmid":2846122312221353,"productId":"1655475400049290","oriSum":5000,"priceQty":2,"qty":2,"subQty":2,"orderProductType":"SALE"},{"crmid":2855215439119023,"productId":"2341503956894359","oriSum":3500,"priceQty":1,"qty":1,"subQty":1,"orderProductType":"SALE"}],"orderCode":"SO#20230704-0034","id":"1763364364952797186","orderDefineCharacter__ICE00104":"非FTE项目","salesOrgId":"A001"}';
    debugger;
    let result = cb.rest.invokeFunction(
      "SCMSA.backOpenApiFunction.saleOrderChange",
      { order: saleorder },
      function (err, res) {
        cb.utils.alert("回传成功");
      },
      viewModel,
      { async: false }
    );
    return {};
  });