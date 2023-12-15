let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //先查询许可量是否可用，如果当前许可大于或于购买许可就不能调用快递查询接口
    var sqlsum = "select CurrentLicense,PurchasePermit from AT175A93621C400009.AT175A93621C400009.rzh91 where id = 'youridHere'";
    var summain = ObjectStore.queryByYonQL(sqlsum);
    var usagemain = summain[0].CurrentLicense;
    var havemain = summain[0].PurchasePermit;
    if (usagemain <= havemain) {
      var id = request.id;
      var WuLiuDanHao = request.WuLiuDanHao;
      var receiveContacterPhone = request.receiveContacterPhone;
      var CourierServicesCode = request.CourierServicesCode;
      var phon = receiveContacterPhone.slice(-4);
      var RequestData = { ShipperCode: CourierServicesCode, LogisticCode: WuLiuDanHao, CustomerName: phon };
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
        RequestType: "8001"
      };
      var strResponse = postman(method, url, "form", JSON.stringify(header), JSON.stringify(body));
      var result = JSON.parse(strResponse);
      if (result.State != "0") {
        var objects = { Tr_type1: "1", rzh01_id: request.id };
        var resd = ObjectStore.deleteByMap("AT175A93621C400009.AT175A93621C400009.rzh03", objects);
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
        if (result.State === "3" || result.State === "4") {
          var objectu = { id: request.id, YeWu_state: "3", QianShouRen: "已签收" };
          var resu = ObjectStore.updateById("AT175A93621C400009.AT175A93621C400009.rzh01", objectu, "rzh01");
          //快递签收后查询许可查询表中的当前使用量然后加一并写入许可表中
          var sqlsum = "select CurrentLicense from AT175A93621C400009.AT175A93621C400009.rzh91 where id = 'youridHere'";
          var sum = ObjectStore.queryByYonQL(sqlsum);
          var usage = sum[0].CurrentLicense;
          var updateWrapper = new Wrapper();
          updateWrapper.eq("id", "1878150046000611335");
          var toUpdate = { CurrentLicense: usage + 1 };
          var res = ObjectStore.update("AT175A93621C400009.AT175A93621C400009.rzh91", toUpdate, updateWrapper, "rzh91");
          return { request: "已签收", State: result.State, sum: sum[0].CurrentLicense };
        }
        return { request: request, body: body, resultTraces: result.Traces };
      } else if (result.State === "0") {
        return { request: request.Reason };
      }
    }
    return { result: "许可不足", havemain: havemain, usagemain: usagemain };
  }
}
exports({ entryPoint: MyAPIHandler });