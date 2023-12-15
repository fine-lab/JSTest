let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取需要批改选中的数据来源是哪里：销售出库：xsck    调拨订单：dbdd
    let isSource = request.isSource;
    //获取需要批改选中的数据是选中的表头，还是表头+表体
    let isBiaotou = request.isBiaotou;
    //获取需要批改选中的数据
    let selectData = request.selectData;
    //获取需要批改为什么值
    let value = request.value;
    if (isSource == "xsck") {
      //销售出库做批改
      let param1 = {};
      let param2 = {
        isBiaotou: isBiaotou,
        selectData: selectData,
        value: value
      };
      let func = extrequire("AT18526ADE08800003.hdhs.updateXsck");
      let res = func.execute(param1, param2);
    } else if (isSource == "dbdd") {
      //调拨订单做批改
      let param1 = {};
      let param2 = {
        isBiaotou: isBiaotou,
        selectData: selectData,
        value: value
      };
      let func = extrequire("AT18526ADE08800003.hdhs.updateDbdd");
      let res = func.execute(param1, param2);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });