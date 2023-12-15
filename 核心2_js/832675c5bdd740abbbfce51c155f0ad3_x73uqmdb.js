let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取请求数据
    var data = request.data;
    //置空时间戳，一定要置空，不然单据版本不是最新
    data.pubts = null;
    //更新信息
    var result = ObjectStore.updateById("GT63716AT28.GT63716AT28.taxcloud_properties", data);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });