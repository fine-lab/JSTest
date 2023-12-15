let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let dataObj = param.data[0];
    let id = dataObj.id;
    let purchaseOrdersList = dataObj.purchaseOrders;
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let callbackUrl = DOMAIN + "/yonbip/sd/voucherorder/singleSave";
    let queryUrl = DOMAIN + "/yonbip/sd/voucherorder/detail";
    let sysDefineUrl = DOMAIN + "/yonbip/sd/api/updateDefinesInfo";
    let extendSrcBillIdArray = [];
    let srcBill = dataObj.srcBill;
    if (true) {
      return;
    }
    for (var i in purchaseOrdersList) {
      let extendSrcBillId = purchaseOrdersList[i].extendSrcBillId;
      if (extendSrcBillId == undefined || extendSrcBillId == "") {
        continue;
      }
      let isExisted = false;
      for (var j in extendSrcBillIdArray) {
        if (extendSrcBillIdArray[j] == extendSrcBillId) {
          isExisted = true;
          break;
        }
      }
      if (!isExisted) {
        extendSrcBillIdArray.push(extendSrcBillId);
      }
    }
    if (extendSrcBillIdArray.length == 0) {
      return { rst: true, msg: "没有符合条件的数据，不用回写!" };
    }
    for (var j in extendSrcBillIdArray) {
      let extendSrcBillId = extendSrcBillIdArray[j];
      let apiResponse = openLinker("GET", queryUrl + "?id=" + extendSrcBillId, "GT3734AT5", JSON.stringify({ id: extendSrcBillId }));
      let resDataObj = JSON.parse(apiResponse).data;
      let orderDetails = resDataObj.orderDetails;
      let sysDefineBody = {
        billnum: "voucher_order",
        datas: []
      };
      let defineObj59 = null;
      let defineObj60 = null;
      let defineObj56 = null; //供应商ID
      let defineObj55 = null; //供应商名称
      for (var k in orderDetails) {
        orderDetails[k]._status = "Update";
        for (var i in purchaseOrdersList) {
          let purchaseOrders = purchaseOrdersList[i];
          let extendSrcBillId = purchaseOrders.extendSrcBillId;
          let extendSrcBillNo = purchaseOrders.extendSrcBillNo;
          if (orderDetails[k].id == purchaseOrders.extendSrcBillEntryId) {
            orderDetails[k].extendPurCost = purchaseOrders.oriSum; //函数金额
            orderDetails[k].extendOriTax = purchaseOrders.oriTax; //税额
            orderDetails[k]._status = "Update";
            defineObj59 = {
              id: extendSrcBillId,
              code: extendSrcBillNo,
              definesInfo: [
                {
                  define59: purchaseOrders.oriTax,
                  isHead: false,
                  isFree: true,
                  detailIds: purchaseOrders.extendSrcBillEntryId
                }
              ]
            };
            defineObj60 = {
              id: extendSrcBillId,
              code: extendSrcBillNo,
              definesInfo: [
                {
                  define60: purchaseOrders.oriSum,
                  isHead: false,
                  isFree: true,
                  detailIds: purchaseOrders.extendSrcBillEntryId
                }
              ]
            };
            defineObj56 = {
              id: extendSrcBillId,
              code: extendSrcBillNo,
              definesInfo: [
                {
                  define56: dataObj.vendor,
                  isHead: false,
                  isFree: true,
                  detailIds: purchaseOrders.extendSrcBillEntryId
                }
              ]
            };
            defineObj55 = {
              id: extendSrcBillId,
              code: extendSrcBillNo,
              definesInfo: [
                {
                  define55: dataObj.vendor_name,
                  isHead: false,
                  isFree: true,
                  detailIds: purchaseOrders.extendSrcBillEntryId
                }
              ]
            };
            break;
          }
        }
        let tmp1 = {
          "orderDetailPrices!id": orderDetails[k].orderDetailPrices.id,
          "orderDetailPrices!natSum": orderDetails[k].orderDetailPrices.natSum,
          "orderDetailPrices!discountRate": orderDetails[k].orderDetailPrices.discountRate,
          "orderDetailPrices!code": orderDetails[k].orderDetailPrices.code,
          "orderDetailPrices!oriTax": orderDetails[k].orderDetailPrices.oriTax,
          "orderDetailPrices!rebateMoneyDomesticTaxfree": orderDetails[k].orderDetailPrices.rebateMoneyDomesticTaxfree,
          "orderDetailPrices!natTax": orderDetails[k].orderDetailPrices.natTax,
          "orderDetailPrices!rebateMoneyDomestic": orderDetails[k].orderDetailPrices.rebateMoneyDomestic,
          "orderDetailPrices!saleCost_orig_taxfree": orderDetails[k].orderDetailPrices.saleCost_orig_taxfree,
          "orderDetailPrices!lineDiscountMoney": orderDetails[k].orderDetailPrices.lineDiscountMoney,
          "orderDetailPrices!salePrice_domestic": orderDetails[k].orderDetailPrices.salePrice_domestic,
          "orderDetailPrices!particularlyMoneyDomesticTaxfree": orderDetails[k].orderDetailPrices.particularlyMoneyDomesticTaxfree,
          "orderDetailPrices!saleCost_domestic": orderDetails[k].orderDetailPrices.saleCost_domestic,
          "orderDetailPrices!oriUnitPrice": orderDetails[k].orderDetailPrices.oriUnitPrice,
          "orderDetailPrices!isDeleted": orderDetails[k].orderDetailPrices.isDeleted,
          "orderDetailPrices!promotionMoneyOrigTaxfree": orderDetails[k].orderDetailPrices.promotionMoneyOrigTaxfree,
          "orderDetailPrices!orderDetailId": orderDetails[k].orderDetailPrices.orderDetailId,
          "orderDetailPrices!saleCost_domestic_taxfree": orderDetails[k].orderDetailPrices.saleCost_domestic_taxfree,
          "orderDetailPrices!salePrice_domestic_taxfree": orderDetails[k].orderDetailPrices.salePrice_domestic_taxfree,
          "orderDetailPrices!particularlyMoneyDomestic": orderDetails[k].orderDetailPrices.particularlyMoneyDomestic,
          "orderDetailPrices!salePrice_orig_taxfree": orderDetails[k].orderDetailPrices.salePrice_orig_taxfree,
          "orderDetailPrices!oriMoney": orderDetails[k].orderDetailPrices.oriMoney,
          "orderDetailPrices!natTaxUnitPrice": orderDetails[k].orderDetailPrices.natTaxUnitPrice,
          "orderDetailPrices!natMoney": orderDetails[k].orderDetailPrices.natMoney,
          "orderDetailPrices!natUnitPrice": orderDetails[k].orderDetailPrices.natUnitPrice
        };
        if (orderDetails[k].taxId == undefined || orderDetails[k].taxId == "") {
          tmp1.taxCode = "VAT0";
          tmp1.taxId = "yourIdHere";
        }
        Object.assign(orderDetails[k], tmp1);
        resDataObj._status = "Update";
        resDataObj.orderDetails = orderDetails;
        let tmp = {
          "orderPrices!id": resDataObj.orderPrices.id,
          "orderPrices!exchRate": resDataObj.orderPrices.exchRate,
          "orderPrices!exchangeRateType": resDataObj.orderPrices.exchangeRateType,
          "orderPrices!currency": resDataObj.orderPrices.currency,
          "orderPrices!natCurrency": resDataObj.orderPrices.natCurrency,
          "orderPrices!taxInclusive": resDataObj.orderPrices.taxInclusive,
          "orderPrices!totalMoneyOrigTaxfree": resDataObj.orderPrices.totalMoneyOrigTaxfree,
          "orderPrices!orderPayMoneyOrigTaxfree": resDataObj.orderPrices.orderPayMoneyOrigTaxfree,
          "orderPrices!orderPayMoneyDomestic": resDataObj.orderPrices.orderPayMoneyDomestic,
          "orderPrices!orderPayMoneyDomesticTaxfree": resDataObj.orderPrices.orderPayMoneyDomesticTaxfree,
          "orderPrices!orderId": resDataObj.orderPrices.orderId,
          "orderPrices!wholeDiscountRate": resDataObj.orderPrices.wholeDiscountRate,
          "orderPrices!discountAfterMoney": resDataObj.orderPrices.discountAfterMoney,
          "orderPrices!discountMoney": resDataObj.orderPrices.discountMoney
        };
        Object.assign(resDataObj, tmp);
        resDataObj.resubmitCheckKey = replace(uuid(), "-", "");
        delete resDataObj.headFreeItem;
        if (defineObj60 != null) {
          sysDefineBody.datas.push(defineObj60);
          let respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
          sysDefineBody.datas[0] = defineObj59;
          respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
          sysDefineBody.datas[0] = defineObj56;
          respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
          sysDefineBody.datas[0] = defineObj55;
          respSaveDefine = openLinker("POST", sysDefineUrl, "GT3734AT5", JSON.stringify(sysDefineBody));
        }
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });