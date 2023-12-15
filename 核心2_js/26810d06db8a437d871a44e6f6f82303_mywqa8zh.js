let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var data1 = request.responseData;
    var a1 = data1.bill.bodys[0].product;
    var subQty = data1.bill.bodys[0].subQty; //件数
    var code = data1.bill.code;
    var warehouse = data1.bill.warehouse;
    //查询物料
    var sql3 = "select cName from aa.product.Product where id = " + a1;
    var res3 = ObjectStore.queryByYonQL(sql3, "productcenter");
    var name1 = res3[0].cName;
    //查询仓库
    var sql = "select * from aa.warehouse.Warehouse where id =" + warehouse;
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    var phone = res[0].phone;
    var linkman = res[0].linkman;
    var sheng = res[0].address;
    var strAddress = split(sheng, "市", 2);
    let shiStr = JSON.parse(strAddress);
    var shi = shiStr[0] + "市"; // 北京
    var quStrss = shiStr[1];
    var quStrs = split(quStrss, "区", 2);
    let quStr = JSON.parse(quStrs);
    let qu = quStr[0] + "区";
    var s = {
      notifyDelivery: false, // 等通知发货(boolean)
      smsNotify: true, // 是否短信通知(boolean)
      fuelSurcharge: true, // 燃油附加
      logisticID: code, // 外部电商订单号
      sendTelPhone: phone, // 发货人电话
      sendProvince: "北京", //发货人省
      sendCity: shi, //发货人市
      sendCounty: qu, //发货人区/县
      sendAddress: "北京", //发货人省
      acceptProvince: "山西省", //收货人省
      acceptCity: "大同市", //收货人市
      acceptArea: "北京", //发货人省
      sendPhone: phone, //发货人手机
      sendPerson: linkman, //发货人名称
      logisticCompanyID: "yourIDHere", //物流公司ID
      acceptAddress: data1.bill.cReceiveAddress, //	收货人详细地址
      acceptPerson: data1.bill.contactName, //收货人名称
      acceptPhone: data1.bill.receiveContacterPhone, //收货人手机
      gmtCommit: data1.bill.createTime, //订单提交时间
      cargo: name1, //贷物名称
      amount: subQty + "", //总件数
      paymentTypeId: "30", //付款方式 （30：发货人付款（现付）； 31：收货人付款（到付））
      serviceModeId: "347" //送贷方式 （346：中心自提；347：站点自提；57：派送（默认））
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
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });