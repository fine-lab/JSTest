let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //该return如果打开会导致订货直接支付的核销记录传不到NCC，仅有在特殊处理退货退款时使用
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    var details = param.data[0].ReceiveBill_b;
    let minusGatheringParam = [];
    let returnGatheringParam = [];
    details.forEach((self) => {
      if (self.orderno === undefined) {
        return;
      } else if (includes(self.orderno, "UR-")) {
        // 原销售订单号
        let recordList = saleReturnByCode({ code: self.orderno });
        let saleCode = recordList.orderNo;
        if (saleCode === undefined) {
          saleCode = recordList.voucher_salereturnlist_userDefine001;
        }
        if (saleCode === undefined) {
          throw new Error("根据[" + self.orderno + "]未查询到原订单号");
        }
        returnGatheringParam.push({
          id: self.id,
          amount: self.oriSum * -1,
          voucherNo: saleCode,
          payDate: new Date().getTime(),
          orderNo: self.orderno,
          bipNode: "收款"
        });
      } else {
        minusGatheringParam.push({
          id: self.id,
          amount: self.oriSum,
          voucherNo: self.orderno,
          bipNode: "收款",
          payDate: new Date().getTime()
        });
      }
    });
    if (minusGatheringParam.length > 0) {
      minusGatheringSynNcc(minusGatheringParam);
    }
    if (returnGatheringParam.length > 0) {
      returnGatheringSynNcc(returnGatheringParam);
    }
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function minusGatheringSynNcc(params) {
      var resData = postman("post", config.nccUrl + "/servlet/MinusGatheringBillSyn", "", JSON.stringify(params));
      // 转为JSON对象
      try {
        resData = JSON.parse(resData);
        // 返回信息校验
        if (resData.code != "200") {
          throw new Error(resData.msg);
        }
      } catch (e) {
        throw new Error("NCC核销 " + e + ";请求:" + JSON.stringify(params));
      }
      return resData;
    }
    function returnGatheringSynNcc(params) {
      var resData = postman("post", config.nccUrl + "/servlet/ReturnGatheringBillSyn", "", JSON.stringify(params));
      // 转为JSON对象
      try {
        resData = JSON.parse(resData);
        // 返回信息校验
        if (resData == undefined || resData == null) {
          throw new Error("ncc返回空");
        }
        if (resData.code != "200") {
          throw new Error(resData.msg);
        }
      } catch (e) {
        throw new Error("NCC核销(退货) " + e + ";请求:" + JSON.stringify(params));
      }
      return resData;
    }
    function saleReturnByCode(params) {
      let reqBody = {
        code: params.code,
        pageIndex: "1",
        pageSize: "10",
        isSum: true
      };
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      try {
        result = JSON.parse(result);
        if (result.code != "200" || result.data === undefined) {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询销售退货  " + e);
      }
      return result.data.recordList[0];
    }
  }
}
exports({ entryPoint: MyTrigger });