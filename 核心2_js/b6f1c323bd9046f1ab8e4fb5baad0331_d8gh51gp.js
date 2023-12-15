let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { id: request.bodyId, zhuangtai: request.typeValue };
    if (request.tuihuiyuanyinValue) {
      //退回原因
      object.tuihuiyuanyin = request.tuihuiyuanyinValue;
    } else if (request.wuliudanhaoValue) {
      //物流单号
      object.wuliaodanhao = request.wuliudanhaoValue;
    } else if (request.typeValue == "20") {
      //发货按钮时清空退回原因
      object.tuihuiyuanyin = "";
    }
    var res = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", object, "63fb1ae5");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });