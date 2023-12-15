let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sj = request.responseData.bill;
    var warehouse = sj.warehouse;
    var sql = "select * from aa.warehouse.Warehouse where id =" + warehouse;
    var fjrxx = ObjectStore.queryByYonQL(sql, "productcenter");
    var xxdz = fjrxx[0].address;
    var sheng = substring(xxdz, 0, 2); //省
    var shi = substring(xxdz, 0, 3);
    var ab = S4();
    var ba = S4();
    var logisticsNo = ab + ba;
    var params = {
      logisticsNo: sj.code,
      senderName: fjrxx[0].linkman,
      senderProvinceName: sheng,
      senderCityName: shi,
      senderAddress: xxdz,
      senderMobile: fjrxx[0].phone,
      recipientName: sj.cReceiver,
      recipientProvinceName: sj.cReceiveAddress,
      recipientCityName: sj.cReceiveAddress,
      recipientAddress: sj.cReceiveAddress,
      recipientMobile: sj.cReceiveMobile
    };
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let body = {
      data: JSON.stringify(params) + "privacy_create_adapterv1u2Z1F7Fh"
    };
    let url = "http://123.57.144.10:9995/allt/md5AndBase64Enc";
    let md5Response = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
    var sign1 = JSON.parse(md5Response);
    let sign = sign1.msg;
    let timestamp = new Date().getTime();
    let url1 = "https://openuat.yto56.com.cn:6443/open/privacy_create_adapter/v1/PptaYu/K21000119";
    let header1 = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let body1 = {
      timestamp: timestamp,
      param: JSON.stringify(params),
      sign: sign,
      format: "JSON"
    }; //请求参数
    let apiResponsesa = postman("POST", url1, JSON.stringify(header1), JSON.stringify(body1));
    //将返回值转成json格式
    const js = JSON.parse(apiResponsesa);
    let apiResponses = js.mailNo;
    sj.kdh = apiResponses;
    let func1 = extrequire("ST.backOpenApiFunction.updateXSCK");
    let bcdh = func1.execute(null, sj);
    return { js };
  }
}
exports({ entryPoint: MyAPIHandler });