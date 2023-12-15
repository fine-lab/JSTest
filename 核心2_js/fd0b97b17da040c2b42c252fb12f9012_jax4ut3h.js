let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询数据
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer SlOGnl1vjjdngNsqg0b9YmRt36yuIPfD",
      apicode: "89076615-609f-45ef-85da-2fc0effd16bf",
      appkey: "yourkeyHere"
    };
    //参数
    let body = {
      app_id: "youridHere",
      entry_id: "youridHere",
      filter: {
        rel: "and",
        cond: [
          {
            field: "_widget_1666941387501",
            type: "text",
            method: "eq",
            value: "BX2022121300074"
          }
        ]
      }
    };
    //简道云地址
    let url = "https://www.example.com/";
    let apiResponse = apiman("post", url, JSON.stringify(header), JSON.stringify(body));
    let dataList = JSON.parse(apiResponse).data;
    let taxAmount = 0;
    let num = 0;
    let arr = [];
    dataList.forEach((row) => {
      taxAmount = row._widget_1666936807444;
      let reimburseDetail = row._widget_1669881349721;
      reimburseDetail.forEach((item) => {
        let detailMoney = item._widget_1669881349726;
        let proportion = (detailMoney / taxAmount) * 100;
        let real = MoneyFormatReturnBd(proportion, 6) * 1;
        num += real;
        arr.push(real);
      });
    });
    return { taxAmount, arr, num };
  }
}
exports({ entryPoint: MyAPIHandler });