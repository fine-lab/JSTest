let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param;
    throw new Error(JSON.stringify(data));
    var s = {
      logisticID: "yourIDHere",
      logisticCompanyID: "yourIDHere",
      ecID: "yourIDHere",
      sendPerson: "黄维权",
      sendPhone: "18077777286",
      sendTelPhone: "18077777286",
      sendProvince: "广西壮族自治区",
      sendCity: "南宁市",
      sendCounty: "江南区",
      sendAddress: "广西壮族自治区南宁市江南区洞岭路",
      acceptProvince: "安徽省",
      acceptCity: "淮南市",
      acceptArea: "田家庵区",
      acceptAddress: "安徽省淮南市田家庵区淮南师范学院新校区泉山校区",
      acceptPerson: "李迎水",
      acceptPhone: "18009647333",
      gmtCommit: "2019-10-08 14:13:11",
      cargo: "厂家直供特级散装芒果干500g 5包包邮（西北.东北地区不包邮）",
      amount: "1",
      actualWeight: "35.0",
      cubic: "0.0",
      totalPrice: "89.0",
      paymentTypeId: "30",
      serviceModeId: "347",
      insureAmount: "1000.0",
      insurance: "5.0",
      checkOrderId: "0",
      notifyDelivery: false,
      smsNotify: true,
      smsNotifyPrice: "1.0",
      fuelSurcharge: true,
      fuelSurchargePrice: "3.0",
      packageInfoList: {
        packageInfo: [
          {
            packageID: "yourIDHere",
            packageItem: "bar_no:1224823351927051;item_id:JW-11-131588;col_id:2504;size_id:L;log_id:51;bar_qtys:3"
          },
          {
            packageID: "yourIDHere",
            packageItem: "bar_no:1224823351927051;item_id:JW-11-131588;col_id:2504;size_id:L;log_id:51;bar_qtys:3"
          }
        ]
      }
    };
    var urlCode = UrlEncode(JSON.stringify(s));
    let partnerKey = "yourKeyHere";
    let signStr = JSON.stringify(s) + partnerKey;
    var sign = MD5Encode(signStr);
    let header = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };
    let url = "https://www.example.com/" + urlCode + "&sign=" + sign;
    var strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(null));
    let response = JSON.parse(strResponse);
    return { response };
  }
}
exports({ entryPoint: MyTrigger });