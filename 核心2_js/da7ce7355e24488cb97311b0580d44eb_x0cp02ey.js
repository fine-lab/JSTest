let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = {};
    let salesReturnId = "";
    if (param != null && param != undefined) {
      data = param.data[0];
      salesReturnId = data.id;
      let salesReturnOrderUrl = "https://www.example.com/";
      salesReturnOrderUrl += `?id=${data.id}`;
      var apiResponseSalesReturn = openLinker("GET", salesReturnOrderUrl, "SCMSA", null);
      var salesReturn_Info = JSON.parse(apiResponseSalesReturn);
      var sqlExec = `select orderNo from voucher.salereturn.SaleReturnDetail a left join voucher.salereturn.SaleReturn b on a.saleReturnId = b.id where b.id ='youridHere'`;
      var salesReturnInfo = ObjectStore.queryByYonQL(sqlExec, "udinghuo");
      var salesOrderId = `select id from voucher.order.Order where code = '${salesReturnInfo[0].orderNo}'`;
      var salesOrder_Id = ObjectStore.queryByYonQL(salesOrderId, "udinghuo");
      let salesOrderUrl = "https://www.example.com/";
      salesOrderUrl += `?id=${salesOrder_Id[0].id}`;
      var apiResponseSales = openLinker("GET", salesOrderUrl, "SCMSA", null);
      var salesInfo = JSON.parse(apiResponseSales);
      var agentRequest = {};
      agentRequest.id = data.agentId;
      // 使用openLinker调用开放接口
      let agentRequestUrl = "https://www.example.com/";
      agentRequestUrl += `?id=${agentRequest.id}`;
      var agentResponse = openLinker("GET", agentRequestUrl, "SCMSA", null);
      // 这里的agentResponse是字符串
      let agentInfo = JSON.parse(agentResponse);
      let agentCode = agentInfo.data.code;
      // 声明传递的对象
      let request = {};
      request.orderCode = salesReturn_Info.data.code;
      request.opportunityCode = "";
      request.accountCode = agentCode;
      request.amount = -salesReturn_Info.data.payMoney;
      request.curr = salesReturn_Info.data.currencyCode;
      var currency_Code = salesReturn_Info.data.currencyCode;
      var currencyId = salesReturn_Info.data.currency;
      var targetId = "yourIdHere";
      if (currency_Code == "USD") {
        request.exchangeRate = 1;
      } else {
        let exchangeRateType = salesReturn_Info.data.exchangeRateType;
        // 获取汇率对象
        var sqlExchangeRate = `select * from bd.exchangeRate.ExchangeRateVO where 1=1 and exchangeRateType = '${exchangeRateType}' and sourceCurrencyId
  = '${currencyId}' and targetCurrencyId = 'yourIdHere' order by quotationDate desc limit 1`;
        var rowExchangeRate = ObjectStore.queryByYonQL(sqlExchangeRate, "ucfbasedoc");
        //获取汇率-销售订单的
        request.exchangeRate = data["orderPrices!exchRate"];
        //获取汇率-汇率模型的
        request.exchangeRate = rowExchangeRate[0].exchangeRate;
      }
      request.currencyUSD = request.amount * request.exchangeRate;
      let testDate = new Date(data.createDate);
      var Y = testDate.getFullYear();
      var M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      var D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let orderDate = `${Y}${M}${D}`;
      request.createdDate = orderDate;
      if (data.modifyTime == null || data.modifyTime == undefined) {
        request.ModifyiedDate = "";
      } else {
        let testModify = new Date(data.modifyTime);
        var Y = testModify.getFullYear();
        var M = testModify.getMonth() + 1 < 10 ? "0" + (testModify.getMonth() + 1) : testModify.getMonth() + 1;
        var D = testModify.getDate() < 10 ? "0" + testModify.getDate() : testModify.getDate();
        let modifyDate = `${Y}${M}${D}`;
        request.ModifiedDate = modifyDate;
      }
      let close_date = new Date();
      Y = close_date.getFullYear();
      M = close_date.getMonth() + 1 < 10 ? "0" + (close_date.getMonth() + 1) : close_date.getMonth() + 1;
      D = close_date.getDate() < 10 ? "0" + close_date.getDate() : close_date.getDate();
      let auditDate = `${Y}${M}${D}`;
      request.CloseDate = auditDate;
      request.SalesCode = salesReturn_Info.data.corpContact_code;
      request.oldOrder = salesReturnInfo[0].orderNo;
      let apiData = {
        data: request
      };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "AT1601184E09C80009", JSON.stringify(apiData));
      let apiResult = JSON.parse(apiResponse);
      if (apiResult.code == "400") {
        let apiMsg = apiResult.msg;
        return { apiMsg };
      } else {
        return { apiResult };
      }
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});