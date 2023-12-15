let AbstractAPIHandler = require("AbstractAPIHandler");
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取参数-写入数据库
    let appContext = JSON.parse(AppContext());
    let usrName = appContext.currentUser.name;
    let voucherTime = getNowDate();
    let saleOrderCode = request.saleOrderCode;
    if (request.OrderType == 1) {
      //销售订单-凭证增加
      var res = ObjectStore.selectByMap("GT3734AT5.GT3734AT5.VoucherJson", { saleOrderCode: saleOrderCode });
      if (res == null || res.length == 0) {
        let object = { saleOrderCode: request.saleOrderCode, saleOrderId: request.saleOrderId, voucherJson: request.voucherJson, voucherTime: voucherTime };
        let insertRes = ObjectStore.insert("GT3734AT5.GT3734AT5.VoucherJson", object, "45f96d49");
      } else {
        //已有记录--修改
        let object = { id: res[0].id, saleOrderCode: request.saleOrderCode, saleOrderId: request.saleOrderId, voucherJson: request.voucherJson, voucherTime: voucherTime };
        let updateRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.VoucherJson", object, "45f96d49");
      }
    } else if (request.OrderType == -1) {
      //销售订单-凭证删除
      let saleOrderCode = request.saleOrderCode;
      //实体查询
      var res = ObjectStore.selectByMap("GT3734AT5.GT3734AT5.VoucherJson", { saleOrderCode: saleOrderCode });
      if (res == null || res.length == 0) {
      } else {
        //已有记录--删除
        let object = { id: res[0].id, saleOrderCode: request.saleOrderCode, saleOrderId: request.saleOrderId };
        let updateRes = ObjectStore.deleteById("GT3734AT5.GT3734AT5.VoucherJson", object, "45f96d49");
      }
      return { res };
    } else if (request.OrderType == 0) {
      //销售订单-查询
      let saleOrderCode = request.saleOrderCode;
      var res = ObjectStore.selectByMap("GT3734AT5.GT3734AT5.VoucherJson", { saleOrderCode: saleOrderCode });
      let resObj = { res };
      if (resObj == null || resObj.length == 0) {
        //没有就出错了
        return {};
      } else {
        //已有记录--删除
        let voucherJson = JSON.parse(resObj.res[0].voucherJson);
        let bodyList = voucherJson.bodies;
        for (var i = 0; i < bodyList.length; i++) {
          bodyList[i].description = bodyList[i].description + "[红字]";
          if (bodyList[i].debitOriginal) {
            bodyList[i].debitOriginal = bodyList[i].debitOriginal * -1;
            bodyList[i].debitOrg = bodyList[i].debitOrg * -1;
          }
          if (bodyList[i].creditOriginal) {
            bodyList[i].creditOriginal = bodyList[i].creditOriginal * -1;
            bodyList[i].creditOrg = bodyList[i].creditOrg * -1;
          }
        }
        return voucherJson;
      }
    } else if (request.OrderType == 2) {
      //红字销售订单-生成凭证
      var res = ObjectStore.selectByMap("GT3734AT5.GT3734AT5.VoucherJson", { saleOrderCode: saleOrderCode });
      if (res == null || res.length == 0) {
      } else {
        //已有记录--修改
        let object = { id: res[0].id, redSaleOrderCode: request.saleOrderCode, redSaleOrderId: request.saleOrderId, redVoucherJson: request.voucherJson, redVoucherTime: voucherTime };
        let updateRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.VoucherJson", object, "45f96d49");
      }
      return {};
    } else if (request.OrderType == -2) {
      //红字销售订单-删除凭证
      var res = ObjectStore.selectByMap("GT3734AT5.GT3734AT5.VoucherJson", { saleOrderCode: saleOrderCode });
      if (res == null || res.length == 0) {
      } else {
        //已有记录--修改
        let object = { id: res[0].id, redSaleOrderCode: "", redSaleredSaleOrderId: "", redVoucherJson: "", redVoucherTime: "" };
        let updateRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.VoucherJson", object, "45f96d49");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });