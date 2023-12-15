let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var WuLiuDanHao = request.WuLiuDanHao;
    var RequestData = { ShipperCode: "STO", LogisticCode: WuLiuDanHao };
    var APIkey = "yourkeyHere";
    var str = JSON.stringify(RequestData);
    var RequestDatas = str + APIkey;
    var md5 = MD5Encode(RequestDatas);
    var Base64 = Base64Encode(md5);
    let method = "POST";
    let url = "https://www.example.com/";
    let header = { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" };
    let body = {
      RequestData: JSON.stringify(RequestData),
      EBusinessID: "yourIDHere",
      DataType: "2",
      DataSign: Base64,
      RequestType: "1002"
    };
    var strResponse = postman(method, url, "form", JSON.stringify(header), JSON.stringify(body));
    var result = JSON.parse(strResponse);
    if (result.State != 0) {
      var objects = { Tr_type1: "1" };
      var res = ObjectStore.deleteByMap("AT175A93621C400009.AT175A93621C400009.rzh03", objects);
      var arrayList = result.Traces;
      for (let i = 0; i < arrayList.length; i++) {
        let object = {
          Tr_type1: "1", //快递公司
          Location_time: arrayList[i].AcceptTime,
          sign: arrayList[i].AcceptStation,
          rzh01_id: request.id
        };
        var res = ObjectStore.insert("AT175A93621C400009.AT175A93621C400009.rzh03", object);
      }
      return { request: request, body: body, result: result.Traces };
    } else if (result.State === 0) {
      return { request: request.Reason };
    }
  }
}
exports({ entryPoint: MyAPIHandler });