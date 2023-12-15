let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = request.code; //发货箱编码
    var singture = request.signature; //签收人
    var signatureDate = request.signatureDate; //签收日期
    var specification = request.specification; //规格是否一致
    var signaturePhone = request.signaturePhone; //签名电话
    var openbox = request.openbox; //开箱是否完好
    var updateWrapper = new Wrapper();
    updateWrapper.eq("code", code);
    var toUpdate = { QianShouRen: singture, QianShouDate: signatureDate, ShuLiang_Y: specification, HuoWu_Y: openbox };
    var res = ObjectStore.update("GT37846AT3.GT37846AT3.RZH_11", toUpdate, updateWrapper, "af6531a9");
    return { data: res };
  }
}
exports({ entryPoint: MyAPIHandler });