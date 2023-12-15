let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    let result = {};
    result.exchangeRate = 1.0;
    var quotationDate = request.quotationDate;
    var sourceCurrencyId = request.sourceCurrencyId;
    var targetCurrencyId = request.targetCurrencyId;
    if (!quotationDate) {
      quotationDate = formatDate(new Date());
    }
    let body = {
      pageSize: 200,
      pageIndex: 1,
      externalData: {
        quotationDate: quotationDate,
        activeKey: "yourKeyHere",
        exchangeRateType: "s9c8ri2r",
        serviceCode: "exchanagerate_u8c"
      }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT3407AT1", JSON.stringify(body));
    let crateObj = JSON.parse(apiResponse);
    result.crateObj = crateObj;
    if (crateObj.data && crateObj.data.recordList && crateObj.data.recordList.length > 0) {
      let recordList = crateObj.data.recordList;
      result.recordList = recordList;
      for (var num1 = 0; num1 < recordList.length; num1++) {
        let record = recordList[num1];
        if (record.sourceCurrencyId == sourceCurrencyId && record.targetCurrencyId == targetCurrencyId) {
          result.exchangeRate = parseFloat(record.exchangeRate);
          result.record = record;
        }
      }
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });