let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apiPreAndAppListCode = extrequire("GT22176AT10.publicFunction.getApiPreAndAppCode").execute();
    let requestDataObject = JSON.parse(param.requestData);
    //查询条件
    let billObj = { id: requestDataObject[0].id };
    //放行单实体查询
    let billInfo = ObjectStore.selectByMap("ISY_2.ISY_2.release_order", billObj);
    let relationId = billInfo[0].relationId;
    let relationChildId = billInfo[0].relationChildId;
    if (relationId != null && typeof relationId != "undefined" && relationChildId != null && typeof relationChildId != "undefined") {
      let auditResult = billInfo[0].auditResult; //审核结果
      let status = "";
      if (auditResult == "1") {
        status = "已放行";
      } else {
        status = "未放行";
      }
      //查询质检单明细信息
      let selectBody = {
        check_rowids: [relationChildId]
      };
      function guid() {
        return "xxxxxxxxxxxxx4xy".replace(/[xy]/g, function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      let selectUrl = apiPreAndAppListCode.apiPrefix + "/yonbip/imcs/inspectioninfoapi/queryInspectResultDetail";
      let selectApiResponse = openLinker("POST", selectUrl, apiPreAndAppListCode.appCode, JSON.stringify(selectBody));
      selectApiResponse = JSON.parse(selectApiResponse);
      let selectData = selectApiResponse.data;
      if (typeof selectData != "undefined") {
        for (let i = 0; i < selectData.length; i++) {
          let body = {
            data: [
              {
                check_sourcetrowID: relationChildId,
                dataList: [
                  {
                    id: selectData[i].id,
                    passStatus: status
                  }
                ]
              }
            ]
          };
          let url = apiPreAndAppListCode.apiPrefix + "/yonbip/imcs/inspectioninfoapi/updatePassStatus";
          let apiResponse = openLinker("POST", url, apiPreAndAppListCode.appCode, JSON.stringify(body));
        }
      }
      let businessType = billInfo[0].businessType;
      if (businessType == "1") {
        let arrivaInfo = extrequire("ISY_2.public.getArrivalDetail").execute({ arrivaId: billInfo[0].relationId }).arrivalDetailData;
        let arrivaChildInfo = "arrivalOrders";
        let arrivaChildList = arrivaInfo[arrivaChildInfo];
        let arrivaChildListInfo = [];
        if (arrivaChildList != undefined) {
          for (let i = 0; i < arrivaChildList.length; i++) {
            if (arrivaChildList[i].id == billInfo[0].relationChildId) {
              arrivaChildListInfo.push({
                id: billInfo[0].relationChildId,
                makeRule: arrivaChildList[i].makeRule,
                source: arrivaChildList[i].source,
                makeRuleCode: arrivaChildList[i].makeRuleCode,
                productsku: arrivaChildList[i].productsku,
                product: arrivaChildList[i].product,
                oriUnitPrice: arrivaChildList[i].oriUnitPrice,
                oriTaxUnitPrice: arrivaChildList[i].oriTaxUnitPrice,
                oriMoney: arrivaChildList[i].oriMoney,
                oriSum: arrivaChildList[i].oriSum,
                oriTax: arrivaChildList[i].oriTax,
                taxitems_code: arrivaChildList[i].taxitems_code,
                natUnitPrice: arrivaChildList[i].natUnitPrice,
                natTaxUnitPrice: arrivaChildList[i].natTaxUnitPrice,
                natMoney: arrivaChildList[i].natMoney,
                natSum: arrivaChildList[i].natSum,
                natTax: arrivaChildList[i].natTax,
                qty: arrivaChildList[i].qty,
                sourceautoid: arrivaChildList[i].sourceautoid,
                sourceid: arrivaChildList[i].sourceid,
                unit: arrivaChildList[i].unit,
                purUOM: arrivaChildList[i].purUOM,
                invExchRate: arrivaChildList[i].invExchRate,
                priceUOM: arrivaChildList[i].priceUOM,
                invPriceExchRate: arrivaChildList[i].invPriceExchRate,
                isLogisticsRelated: arrivaChildList[i].isLogisticsRelated,
                unitExchangeTypePrice: arrivaChildList[i].unitExchangeTypePrice,
                subQty: arrivaChildList[i].subQty,
                priceQty: arrivaChildList[i].priceQty,
                extend_releasestatus: status,
                unitExchangeType: arrivaChildList[i].unitExchangeType,
                _status: "Update"
              });
            }
          }
        }
        let resubmitCheckKey = guid();
        let updateJson = {
          data: {
            id: relationId,
            resubmitCheckKey: resubmitCheckKey,
            purchaseOrg: arrivaInfo.purchaseOrg,
            org: arrivaInfo.org,
            inInvoiceOrg: arrivaInfo.inInvoiceOrg,
            code: arrivaInfo.code,
            isContract: arrivaInfo.isContract,
            vouchdate: arrivaInfo.vouchdate,
            busType: arrivaInfo.busType,
            vendor: arrivaInfo.vendor,
            invoiceSupplier: arrivaInfo.invoiceSupplier,
            currency: arrivaInfo.currency,
            natCurrency: arrivaInfo.natCurrency,
            exchRateType: arrivaInfo.exchRateType,
            exchRate: arrivaInfo.exchRate,
            arrivalOrders: arrivaChildListInfo,
            _status: "Update"
          }
        };
        let arrivaSave = extrequire("ISY_2.saveFunction.saveArrival").execute({ updateJson: updateJson }); //ISY_2.saveFunction.savefinishRepo
      } else if (businessType == "2") {
        let finishedReport = extrequire("ISY_2.public.getPoFinished").execute({ finishedId: billInfo[0].relationId }).finishedDetailData;
        let finishedReportChild = "finishedReportDetail";
        let finishedReportChildList = finishedReport[finishedReportChild];
        if (finishedReportChildList != undefined) {
          for (let i = 0; i < finishedReportChildList.length; i++) {
            if (finishedReportChildList[i].id == billInfo[0].relationChildId) {
              let finishedReportObject = {
                id: billInfo[0].relationId,
                finishedReportDetail: [
                  {
                    hasDefaultInit: true,
                    extend_releasestatus: status,
                    _status: "Update",
                    id: billInfo[0].relationChildId
                  }
                ]
              };
              let finishedReportRes = ObjectStore.updateById("po.finishedreport.FinishedReport", finishedReportObject, "FinishedReport", "productionorder");
              break;
            }
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });