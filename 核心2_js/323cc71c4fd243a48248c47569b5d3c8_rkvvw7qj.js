let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    var orderDetails = pdata.orderDetails;
    let receiveAddress = pdata.receiveAddress;
    //校验收货地址与表体行上物料的仓库的详细地址是否一致。
    for (let i = 0; i < orderDetails.length; i++) {
      let stockId = orderDetails[i].stockId;
      let sqlsti = "select address from aa.warehouse.Warehouse where id = '" + stockId + "'";
      var stockaddress = ObjectStore.queryByYonQL(sqlsti, "productcenter");
      var address = stockaddress[0].address;
      if (address !== receiveAddress) {
        throw new Error("收货地址与表体行上物料的仓库的详细地址不一致");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });