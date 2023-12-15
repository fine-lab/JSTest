let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT65230AT76.backDefaultGroup.getApitoken");
    let resToken = func1.execute();
    let token = resToken.access_token;
    let saleOrderurl = "https://www.example.com/" + token;
    let updateSaleOrderurl = "https://www.example.com/" + token;
    let saleOrderDetailUrl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let isNext = true;
    let index = 1;
    let response = [];
    while (isNext) {
      let body = {
        pageIndex: index,
        pageSize: 10,
        nextStatusName: "CONFIRMORDER",
        isSum: "true",
        simpleVOs: [
          {
            op: "eq",
            value1: "false",
            field: "headFreeItem.define1"
          }
        ]
      };
      isNext = false;
      let rst = "";
      let orderResponse = postman("POST", saleOrderurl, JSON.stringify(header), JSON.stringify(body));
      let orderresponseobj = JSON.parse(orderResponse);
      if ("200" == orderresponseobj.code) {
        rst = orderresponseobj.data;
        let recordList = rst.recordList;
        if (recordList.length > 0) {
          for (let i = 0; i < recordList.length; i++) {
            let record = recordList[i];
            let orderDetailResponse = postman("GET", saleOrderDetailUrl + "&id=" + record.id, JSON.stringify(header), null);
            let orderDetailResponseObj = JSON.parse(orderDetailResponse);
            record = orderDetailResponseObj.data;
            let orderPrices = record.orderPrices;
            //含税金额
            let money = orderPrices.payMoneyDomestic;
            let rateMoney = orderPrices.totalOriTax;
            let noRateMoney = orderPrices.payMoneyOrigTaxfree;
            let xszzid = record.salesOrgId;
            let xszzname = record.salesOrgId_name;
            let khCode = record.agentId_code;
            let object = {
              sale_code: record.code,
              productType: record.headFreeItem.define2_name,
              revenueMethod: record.headFreeItem.define6,
              salesCode: record.saleDepartmentId_code,
              salesDepartment: record.saleDepartmentId_name,
              order_date: record.vouchdate,
              money: money,
              merchant: record.agentId,
              shuie: rateMoney,
              wushuijine: noRateMoney,
              BaseOrg: xszzid,
              merchantCode: khCode
            };
            let objectBatch = [];
            let orderDetails = record.orderDetails;
            for (var j = 0; j < orderDetails.length; j++) {
              //分摊月数
              let FTS = 1;
              //收入确认类型
              let srqr = record.headFreeItem.define6;
              if (includes(srqr, "分摊")) {
                //分摊
                FTS = record.headFreeItem.define5;
              }
              let orderDetail = orderDetails[j];
              let orderDetailPrices = orderDetail.orderDetailPrices;
              //含税金额
              let moneyMonth = MoneyFormatReturnBd(orderDetailPrices.natSum / FTS, 2);
              //无税金额
              let moneyMonthNoRateMoneyMonth = MoneyFormatReturnBd(orderDetailPrices.oriMoney / FTS, 2);
              //税额
              let moneyRateMoneyMonth = moneyMonth - moneyMonthNoRateMoneyMonth;
              //总无税金额
              let moneyLastNoRateMonth = MoneyFormatReturnBd(orderDetailPrices.oriMoney, 2);
              //总含税金额
              let moneyLastMonth = MoneyFormatReturnBd(orderDetailPrices.natSum, 2);
              let shuimoney = orderDetail.taxItems;
              let rate = orderDetail.taxRate;
              for (let j = 0; j < FTS; j++) {
                let objectMonth = null;
                let now = new Date(record.vouchdate);
                //指定几个月后
                let license = record.headFreeItem.define4;
                license = new Date(license);
                let k = j;
                if (j == 0) {
                  //剩余天数首月结算规则
                  let lastDays = getSurplusData(license);
                  let totalDays = mGetDate(license.getFullYear(), license.getMonth() + 1);
                  moneyMonth = MoneyFormatReturnBd((orderDetailPrices.natSum / FTS / totalDays) * lastDays, 2);
                  moneyMonthNoRateMoneyMonth = MoneyFormatReturnBd((orderDetailPrices.oriMoney / FTS / totalDays) * lastDays, 2);
                  moneyRateMoneyMonth = moneyMonth - moneyMonthNoRateMoneyMonth;
                } else {
                  moneyMonth = MoneyFormatReturnBd(orderDetailPrices.natSum / FTS, 2);
                  //无税金额
                  moneyMonthNoRateMoneyMonth = MoneyFormatReturnBd(orderDetailPrices.oriMoney / FTS, 2);
                  //税额
                  moneyRateMoneyMonth = moneyMonth - moneyMonthNoRateMoneyMonth;
                }
                let wantDate = new Date(now.setMonth(now.getMonth() + k));
                let newDate = new Date(wantDate.getFullYear(), wantDate.getMonth() + 1, 0);
                let newDateStr = getData(newDate);
                if (j == FTS - 1) {
                  let moneyLastRateMoneyMonth = moneyLastMonth - moneyLastNoRateMonth;
                  objectMonth = {
                    voucher_date: newDateStr,
                    money: MoneyFormatReturnBd(moneyLastMonth, 2),
                    taxCode: orderDetail.taxCode,
                    wushuijine: moneyLastNoRateMonth,
                    wlclass_code: orderDetail.productCode,
                    shuie: moneyLastRateMoneyMonth,
                    voucher_status: 1,
                    shuilv: shuimoney,
                    isHC: 2
                  };
                } else {
                  moneyLastNoRateMonth = moneyLastNoRateMonth - moneyMonthNoRateMoneyMonth;
                  moneyLastMonth = moneyLastMonth - moneyMonth;
                  objectMonth = {
                    voucher_date: newDateStr,
                    money: moneyMonth,
                    taxCode: orderDetail.taxCode,
                    wlclass_code: orderDetail.productCode,
                    wushuijine: moneyMonthNoRateMoneyMonth,
                    shuie: moneyRateMoneyMonth,
                    voucher_status: 1,
                    shuilv: shuimoney,
                    isHC: 2
                  };
                }
                objectBatch.push(objectMonth);
              }
            }
            object.sales_split_bList = objectBatch;
            let resBatch = ObjectStore.insert("GT65230AT76.GT65230AT76.sale_accrual_h", object, "7a6a78a3");
            if (resBatch.length == objectBatch.length) {
              let updateBody = {
                billnum: "voucher_order",
                datas: [
                  {
                    id: record.id,
                    code: record.code,
                    definesInfo: [
                      {
                        define1: "true",
                        isHead: true,
                        isFree: true
                      }
                    ]
                  }
                ]
              };
              let orderUpdateResponse = postman("POST", updateSaleOrderurl, JSON.stringify(header), JSON.stringify(updateBody));
              let orderupdateresponseobj = JSON.parse(orderUpdateResponse);
              if ("200" != orderupdateresponseobj.code) {
                response.push(record.code, orderupdateresponseobj.message);
              }
            }
          }
        }
      }
      if (rst.pageCount > index) {
        index += 1;
      } else {
        isNext = false;
      }
    }
    function getData(date) {
      let data = "";
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      data = y + "-" + m + "-" + d;
      return data;
    }
    //获取本月剩余天书
    function getSurplusData(date) {
      var now = date.getDate();
      var year = date.getYear();
      if (year < 2000) year += 1900; // Y2K fix
      var month = date.getMonth();
      var monarr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) monarr[1] = "29";
      return monarr[month] - now + 1;
    }
    function mGetDate(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
    }
    return { response };
  }
}
exports({ entryPoint: MyAPIHandler });