let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var biao1 = request.biao1;
    var id = biao1.id;
    var sql = "select org_id,danjuriqi,kehu,kaipiaozuzhi,bizhong,huilv,kaipiaokehu,hejihanshuijine from GT8325AT36.GT8325AT36.yXIAOSHOU where id=" + id;
    var SZ = ObjectStore.queryByYonQL(sql);
    var orgId = "";
    var date = "";
    var KeHu = "";
    var KaiPiao = "";
    var BiZhongId = "";
    var HuiLv = "";
    var KaiPiaoKH = "";
    var HejiHanShui = "";
    if (SZ != undefined && SZ.length > 0) {
      orgId = SZ[0].org_id;
      date = SZ[0].danjuriqi;
      KeHu = SZ[0].kehu;
      KaiPiao = SZ[0].kaipiaozuzhi;
      BiZhongId = SZ[0].bizhong;
      HuiLv = SZ[0].huilv;
      KaiPiaoKH = SZ[0].kaipiaokehu;
      HejiHanShui = SZ[0].hejihanshuijine;
    }
    var zisql =
      "select hanshuijine,wushuijine,shangpinbianma,jijiadanwei,shuie,xiaoshoudanwei,wushuichengjiaojia,xiaoshoushuliang,kucunzuzhi,ziduan15,jihuafahuoriqu,sku,shuilv from GT8325AT36.GT8325AT36.Z_102 where yXIAOSHOU_id=" +
      id;
    var ShuZu = ObjectStore.queryByYonQL(zisql);
    const items = [];
    if (ShuZu != undefined && ShuZu.length > 0) {
      for (let i = 0; i < ShuZu.length; i++) {
        var TaxAmount = ShuZu[i].hanshuijine;
        var NoTaxAmount = ShuZu[i].wushuijine;
        var commodity = ShuZu[i].shangpinbianma;
        var JiJia = ShuZu[i].jijiadanwei;
        var Tax = ShuZu[i].shuie;
        var XiaoShou = ShuZu[i].xiaoshoudanwei;
        var WuShuiPrice = ShuZu[i].wushuichengjiaojia;
        var SalesVolume = ShuZu[i].xiaoshoushuliang;
        var KuChun = ShuZu[i].kucunzuzhi;
        var HanShuiPrice = ShuZu[i].ziduan15;
        var JiHuaDate = ShuZu[i].jihuafahuoriqu;
        var WuLiaoSKU = ShuZu[i].sku;
        var ShuiLv = ShuZu[i].shuilv;
        const obj = {
          "orderDetailPrices!natSum": TaxAmount,
          "orderDetailPrices!natMoney": NoTaxAmount,
          productId: commodity,
          masterUnitId: JiJia,
          invExchRate: 4,
          unitExchangeTypePrice: 0,
          "orderDetailPrices!oriTax": Tax,
          iProductAuxUnitId: XiaoShou,
          "orderDetailPrices!natUnitPrice": WuShuiPrice,
          invPriceExchRate: 1,
          oriSum: TaxAmount,
          "orderDetailPrices!oriMoney": NoTaxAmount,
          priceQty: SalesVolume,
          stockOrgId: KuChun,
          iProductUnitId: JiJia,
          "orderDetailPrices!natTaxUnitPrice": HanShuiPrice,
          orderProductType: "SALE",
          subQty: SalesVolume,
          consignTime: JiHuaDate,
          skuId: WuLiaoSKU,
          taxId: ShuiLv,
          qty: SalesVolume,
          settlementOrgId: KaiPiao,
          oriTaxUnitPrice: HanShuiPrice,
          "orderDetailPrices!natTax": Tax,
          unitExchangeType: 0,
          "orderDetailPrices!oriUnitPrice": WuShuiPrice,
          _status: "Insert"
        };
        items.push(obj);
      }
    }
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let httpUrl = "https://www.example.com/";
    let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
    let httpResData = JSON.parse(httpRes);
    if (httpResData.code != "00000") {
      throw new Error("获取数据中心信息出错" + httpResData.message);
    }
    let httpurl = httpResData.data.gatewayUrl;
    let func1 = extrequire("GT8325AT36.TOKEN.gaitoken");
    let res = func1.execute(null);
    let token = res.access_token;
    let url = httpurl + "/yonbip/sd/voucherorder/singleSave?access_token=" + token;
    let body = {
      data: {
        resubmitCheckKey: replace(uuid(), "-", ""),
        salesOrgId: orgId,
        transactionTypeId: "yourIdHere",
        vouchdate: date,
        agentId: KeHu,
        settlementOrgId: KaiPiao,
        "orderPrices!currency": BiZhongId,
        "orderPrices!exchRate": 1,
        "orderPrices!exchangeRateType": HuiLv,
        "orderPrices!natCurrency": BiZhongId,
        "orderPrices!taxInclusive": true,
        invoiceAgentId: KaiPiaoKH,
        payMoney: HejiHanShui,
        orderDetails: items,
        _status: "Insert"
      }
    };
    let apiResponseRes = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    return { apiResponseRes };
  }
}
exports({ entryPoint: MyAPIHandler });