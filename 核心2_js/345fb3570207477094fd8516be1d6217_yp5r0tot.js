let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 调用高德地图api将中文地址转化出 地球经纬度
    let getHeader = {
      Accept: "application/json;charset=UTF-8"
    };
    // 获取本客户档案下地址信息中的默认地址
    let merchantAddressInfos = param.data[0].merchantAddressInfos;
    let lnglat;
    if (merchantAddressInfos) {
      merchantAddressInfos.forEach((item) => {
        if (item.address) {
          if (item.isDefault || item.isDefault === undefined) {
            context.address = item.address;
            param.data[0].address = item.address;
          } else if (item.isDefault === false) {
          }
        }
      });
    }
    return { context: context, param: param };
  }
}
exports({ entryPoint: MyTrigger });