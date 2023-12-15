let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let billId = data[0].id;
    let supperId = data[0].up_source_id;
    let merchantInfo = {};
    if (typeof supperId !== "undefined") {
      let apiResponse = extrequire("GT22176AT10.publicFunction.getArrivalDetail").execute(supperId);
      merchantInfo = apiResponse.merchantInfo;
    }
    if (data[0].source_billtype != "sy01.71134f47") {
      return;
    }
    let arrivalOrders = merchantInfo.arrivalOrders;
    let arrivalorderArr = [];
    let arrivalorderObj = {};
    let object = { id: billId };
    let res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_medcrefusev2", object);
    //获取拒收单复查子表信息
    var cObject = { SY01_medcrefusev2_id: billId };
    var cRes = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_medrefuse_l", cObject);
    if (typeof cRes != "undefined") {
      for (let i = 0; i < cRes.length; i++) {
        arrivalorderObj = {};
        if (cRes[i].up_sourcechild_id) {
          arrivalorderObj._status = "Update";
          arrivalorderObj.id = cRes[i].up_sourcechild_id;
        }
        arrivalorderObj.source = arrivalOrders[i].source;
        arrivalorderObj.makeRuleCode = "st_purchaseorder2";
        arrivalorderObj.productsku = arrivalOrders[i].productsku;
        arrivalorderObj.product = arrivalOrders[i].product;
        arrivalorderObj.oriUnitPrice = arrivalOrders[i].oriUnitPrice;
        arrivalorderObj.oriTaxUnitPrice = arrivalOrders[i].oriTaxUnitPrice;
        arrivalorderObj.oriMoney = arrivalOrders[i].oriMoney;
        arrivalorderObj.oriSum = arrivalOrders[i].oriSum;
        arrivalorderObj.oriTax = arrivalOrders[i].oriTax;
        arrivalorderObj.taxRate = arrivalOrders[i].taxRate;
        arrivalorderObj.natUnitPrice = arrivalOrders[i].natUnitPrice;
        arrivalorderObj.natTaxUnitPrice = arrivalOrders[i].natTaxUnitPrice;
        arrivalorderObj.natMoney = arrivalOrders[i].natMoney;
        arrivalorderObj.natSum = arrivalOrders[i].natSum;
        arrivalorderObj.natTax = arrivalOrders[i].natTax;
        arrivalorderObj.qty = arrivalOrders[i].qty;
        arrivalorderObj.sourceautoid = arrivalOrders[i].sourceautoid;
        arrivalorderObj.sourceid = arrivalOrders[i].sourceid;
        arrivalorderObj.unit = arrivalOrders[i].unit;
        arrivalorderObj.purUOM = arrivalOrders[i].purUOM;
        arrivalorderObj.invExchRate = arrivalOrders[i].invExchRate;
        arrivalorderObj.priceUOM = arrivalOrders[i].priceUOM;
        arrivalorderObj.invPriceExchRate = arrivalOrders[i].invPriceExchRate;
        arrivalorderObj.unitExchangeType = arrivalOrders[i].unitExchangeType;
        arrivalorderObj.isLogisticsRelated = arrivalOrders[i].isLogisticsRelated;
        arrivalorderObj.unitExchangeTypePrice = arrivalOrders[i].unitExchangeTypePrice;
        arrivalorderObj.subQty = arrivalOrders[i].subQty;
        arrivalorderObj.priceQty = arrivalOrders[i].priceQty;
        arrivalorderObj.mainid = arrivalOrders[i].mainid; //主表ID
        arrivalorderObj.id = arrivalOrders[i].id;
        arrivalorderObj.extend_review_qty = cRes[i].refuseQty + arrivalOrders[i].refuseqty; //关联拒收数量
        //累计验收数量:totalInspectQty
      }
      arrivalorderArr.push(arrivalorderObj);
    }
    //生成唯一标识
    function generateUUID() {
      var d = new Date().getTime();
      var uuid = "youridHere".replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
      return uuid;
    }
    let json = {
      data: {
        resubmitCheckKey: generateUUID(),
        purchaseOrg: merchantInfo.purchaseOrg,
        org: merchantInfo.org,
        inInvoiceOrg: merchantInfo.org,
        isContract: merchantInfo.isContract,
        vouchdate: merchantInfo.vouchdate,
        busType: merchantInfo.busType,
        vendor: merchantInfo.vendor,
        invoiceSupplier: merchantInfo.invoiceSupplier,
        currency: merchantInfo.currency,
        natCurrency: merchantInfo.natCurrency,
        exchRateType: merchantInfo.exchRateType,
        exchRate: merchantInfo.exchRate,
        arrivalOrders: arrivalorderArr,
        _status: "update"
      }
    };
    //到货保存接口
    let apiResponseSaveArrival = extrequire("GT22176AT10.publicFunction.saveArrival").execute(json);
    let apiResponseArrival = JSON.stringify(apiResponseSaveArrival.merchantInfo);
    return {};
  }
}
exports({ entryPoint: MyTrigger });