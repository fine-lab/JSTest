let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id; //装箱单ID
    var agentId_ID = request.agentId_ID; //客户ID
    var agentId_addressID = request.agentId_addressID; //客户地址ID
    let token = ObjectStore.env().token;
    let body = { key: "yourkeyHere" };
    let url = "https://www.example.com/" + token + "&integration=true&id=" + agentId_ID;
    let apiResponse = openLinker("get", url, "AT175A93621C400009", JSON.stringify(body));
    var res = JSON.parse(apiResponse);
    if (res.code === "200") {
      var targetObject = res.data.merchantAddressInfos.find(function (item) {
        return item.id === agentId_addressID;
      });
      var mergerNameValue = targetObject.mergerName;
      var latitude = targetObject.latitude;
      var longitude = targetObject.longitude;
      var updateWrapper = new Wrapper();
      updateWrapper.eq("id", id);
      //待更新字段内容
      var toUpdate = {
        latitude: latitude,
        longitude: longitude
      };
      var res = ObjectStore.update("AT175A93621C400009.AT175A93621C400009.rzh01", toUpdate, updateWrapper, "rzh01");
      return { mergerNameValue: mergerNameValue, latitude: latitude, longitude: longitude, res: res };
    } else {
      return { result: "获取地址失败" };
    }
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });