let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ZTdata = request.responseData.bill;
    let body = {
      partnerType: "2",
      orderType: "2",
      partnerOrderCode: "商家自主定义",
      accountInfo: {
        accountId: "test",
        customerId: "yourIdHere",
        type: 1
      },
      senderInfo: {
        senderPhone: "010-22226789",
        senderName: "张三",
        senderAddress: "华志路",
        senderDistrict: "青浦区",
        senderMobile: "13900000000",
        senderProvince: "上海",
        senderCity: "上海市"
      },
      receiveInfo: {
        receiverCity: "郑州市",
        receiverAddress: "凤阳街XX路XX号",
        receiverPhone: "021-87654321",
        receiverName: "Jone Star",
        receiverDistrict: "高新区",
        receiverMobile: "13500000000",
        receiverProvince: "河南省"
      },
      hallCode: "S2044",
      summaryInfo: {
        quantity: 3,
        premium: 10,
        price: 30,
        otherCharges: 20,
        freight: 20,
        packCharges: 10,
        startTime: "2020-12-10 12:00:00",
        endTime: "2020-12-10 14:00:00",
        orderSum: 23
      },
      siteCode: "02100",
      siteName: "上海",
      remark: "小吉下单",
      orderItems: [],
      cabinet: {}
    };
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let body1 = {
      data: JSON.stringify(body) + "fb33d41b74820add039bfe051c09b0be"
    };
    let url = "http://123.57.144.10:9995/allt/md5AndBase64Enc";
    let md5Response = postman("POST", url, JSON.stringify(header), JSON.stringify(body1));
    var sign1 = JSON.parse(md5Response);
    let sign = sign1.msg;
    let timestamp = new Date().getTime();
    let header1 = {
      "Content-Type": "application/json;charset=UTF-8",
      "x-appKey": "0e6193fa003d7ee2a4b87",
      "x-datadigest": sign
    };
    //请求参数
    let url1 = "https://www.example.com/";
    let apiResponsesa = postman("POST", url1, JSON.stringify(header1), JSON.stringify(body));
    // 回写
    const js = JSON.parse(apiResponsesa);
    let apiResponses = js.result.billCode;
    //调取更新销售自定义更新接口
    let body4 = {
      id: ZTdata.id,
      kdh: apiResponses
    };
    let func1 = extrequire("ST.backOpenApiFunction.updateXSCK");
    let res = func1.execute(null, body4);
    return { res, apiResponsesa, body4 };
  }
}
exports({ entryPoint: MyAPIHandler });