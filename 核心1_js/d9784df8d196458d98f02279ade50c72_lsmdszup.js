let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id; //快递公司编码
    var ShipperCodeKey = request.ShipperCodeKey; //快递公司编码
    var ExpType = request.ExpType; //业务类型
    var PayType = request.PayType; //运费支付方式
    var SenderName = request.SenderName; //发件人
    var SenderMobile = request.SenderMobile; //发件人手机号
    var SenderProvinceName = request.SenderProvinceName; //发件省
    var SenderCityName = request.SenderCityName; //发件市
    var SenderExpAreaName = request.SenderExpAreaName; //发件区
    var SenderAddress = request.SenderAddress; //发件人详细地址
    var Quantity = request.Quantity; //包裹数量
    var GoodsName = request.GoodsName; //商品品类
    var Remark = request.Remark; //备注
    var receiveContacter = request.receiveContacter; //收件人
    var receiveContacterPhone = request.receiveContacterPhone; //收件人联系电话
    var agentIdProvince = request.agentIdProvince; //收件人省
    var agentIdCity = request.agentIdCity; //收件人市
    var agentIdExpArea = request.agentIdExpArea; //收件人区
    var agentId_address = request.agentId_address; //收件人详细地址
    var OrderCode = uuid();
    var RequestData = {
      IsReturnPrintTemplate: "1",
      OrderCode: OrderCode,
      ShipperCode: ShipperCodeKey,
      PayType: PayType,
      ExpType: ExpType,
      Sender: { Name: SenderName, Mobile: SenderMobile, ProvinceName: SenderProvinceName, CityName: SenderCityName, ExpAreaName: SenderExpAreaName, Address: SenderAddress },
      Receiver: { Name: receiveContacter, Mobile: receiveContacterPhone, ProvinceName: agentIdProvince, CityName: agentIdCity, ExpAreaName: agentIdExpArea, Address: agentId_address },
      Commodity: [{ GoodsName: GoodsName }],
      Quantity: Quantity,
      Remark: Remark
    };
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
      RequestType: "1007"
    };
    var strResponse = postman(method, url, "form", JSON.stringify(header), JSON.stringify(body));
    var result = JSON.parse(strResponse);
    if (result.Reason === "成功") {
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      //待更新字段内容
      var toUpdate = {
        WuLiuDanHao: result.Order.LogisticCode,
        OrderCode: OrderCode
      };
      var res = ObjectStore.update("AT175A93621C400009.AT175A93621C400009.rzh01", toUpdate, updateWrapper, "rzh01");
      return { result: result };
    } else {
      return { result: result };
    }
  }
}
exports({ entryPoint: MyAPIHandler });