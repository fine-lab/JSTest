let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let results = [];
    let mainids = [];
    var arrivalOrders = param.sendDataTosourcePO.data.arrivalOrders;
    arrivalOrders.forEach((item) => {
      mainids.push(item.firstsourceid);
    });
    //可能选中的行是同一个主表的,需要进行去重处理
    mainids = mainids.filter((x, index, self) => self.indexOf(x) === index);
    mainids.forEach((item) => {
      let url = "https://www.example.com/" + item;
      let apiResponse = openLinker("GET", url, "ycContractManagement", JSON.stringify({}));
      let body = JSON.parse(apiResponse);
      //判断返回结果状态，做好兼容
    });
    return { results };
  }
}
exports({
  entryPoint: MyTrigger
});