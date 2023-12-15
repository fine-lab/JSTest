let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 逻辑：
    // 主表：单据编码，业务单据类型
    // 子表：udi，包装阶段，包装标识，扫码时间，行号，商品，批号，生产日期，有效期至，灭菌批号，序列号
    //主子表保存时必须要写 住户id 子表关联的主表id
    //对应的实体数据
    var proRes = ObjectStore.insert("GT22176AT10.GT22176AT10.UDIScanRecord", request.logObject, "UDIScanRecord"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    return { proRes };
  }
}
exports({ entryPoint: MyAPIHandler });