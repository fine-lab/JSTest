let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    let minusGatheringParam = [];
    param.balancePayment.forEach((self) => {
      minusGatheringParam.push({
        id: self.saleVerifyId,
        amount: self.amount,
        voucherNo: self.matchedVouchNo,
        payDate: new Date().getTime(),
        bipNode: "余额支付",
        bipSelf: JSON.stringify(self)
      });
    });
    if (minusGatheringParam.length > 0) {
      minusGatheringSynNcc(minusGatheringParam);
    }
    function minusGatheringSynNcc(params) {
      var resData = postman("post", config.nccUrl + "/servlet/MinusGatheringBillSyn", "", JSON.stringify(params));
      // 转为JSON对象
      try {
        resData = JSON.parse(resData);
        // 返回信息校验
        if (resData.code + "" != "200") {
          throw new Error(resData.msg);
        }
      } catch (e) {
        throw new Error("NCC核销 " + e + ";请求:" + JSON.stringify(params));
      }
      return resData;
    }
  }
}
exports({ entryPoint: MyTrigger });