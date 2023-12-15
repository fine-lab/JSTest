let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      data: {
        orderCode: "SO13032305170002",
        accountCode: "0002022059",
        amount: 307.2,
        curr: "GBP",
        exchangeRate: 1.257132,
        currencyUSD: 386.19095039999996,
        createdDate: "20230517",
        ModifiedDate: "20230517",
        CloseDate: "20230518",
        SalesCode: "UK001",
        oldOrder: ""
      }
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT161BFEF009C80005", JSON.stringify(body));
    throw new Error(JSON.stringify(apiResponse));
    return {};
  }
}
exports({ entryPoint: MyTrigger });