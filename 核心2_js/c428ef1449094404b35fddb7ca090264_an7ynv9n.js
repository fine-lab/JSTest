let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    var details = param.data[0].ReceiveBill_b;
    let minusGatheringParam = [];
    let returnGatheringParam = [];
    let updateSaleOrderParam = [];
    details.forEach((self) => {
      if (self.orderno === undefined) {
        return;
      } else if (includes(self.orderno, "UR-")) {
        // 原销售订单号
        let saleCode = saleReturnByCode({ code: self.orderno }).orderNo;
        if (saleCode === undefined) {
          throw new Error("根据[" + self.orderno + "]未查询到原订单号");
        }
        let orders = getSaleOrderData(saleCode);
        updateSaleOrderParam.push({
          id: orders[0].id,
          code: saleCode,
          definesInfo: [{ isHead: true, isFree: true, define17: us_date_format(new Date()) }]
        });
        returnGatheringParam.push({
          id: self.id,
          amount: self.oriSum * -1,
          voucherNo: saleCode,
          payDate: new Date().getTime(),
          orderNo: self.orderno
        });
      } else {
        let orders = getSaleOrderData(self.orderno);
        updateSaleOrderParam.push({
          id: orders[0].id,
          code: self.orderno,
          definesInfo: [{ isHead: true, isFree: true, define17: us_date_format(new Date()) }]
        });
        minusGatheringParam.push({
          id: self.id,
          amount: self.oriSum,
          voucherNo: self.orderno,
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
    //回写核销日期--zb
    if (updateSaleOrderParam.length > 0) {
      updateSaleOrderData(updateSaleOrderParam);
    }
    //修改销售订单自定义项---ZB
    function updateSaleOrderData(params) {
      let data = { datas: params, billnum: "voucher_order" };
      let saleOrderupdateData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(data));
      let returnorderXX = JSON.parse(saleOrderupdateData);
      let returncode = returnorderXX.code;
      if (returncode != "200") {
        throw new Error(returnorderXX.message);
      }
    }
    function getSaleOrderData(params) {
      let reqBody = {
        pageIndex: "1",
        pageSize: "100",
        isSum: true,
        simpleVOs: [
          {
            op: "eq",
            value1: params,
            field: "code"
          }
        ]
      };
      // 响应信息
      let saleOrderData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      // 转为JSON对象
      saleOrderData = JSON.parse(saleOrderData);
      // 返回信息校验
      if (saleOrderData.code != "200") {
        throw new Error("查询销售订单异常(writeOrderOaStatus):" + saleOrderData.message);
      }
      if (saleOrderData.data !== undefined && saleOrderData.data.recordList !== undefined && saleOrderData.data.recordList.length != 0) {
        let id = saleOrderData.data.recordList[0].barCode;
        id = substring(id, 14, id.length);
        saleOrderData.data.recordList[0].id = id;
        return saleOrderData.data.recordList;
      } else {
        return [];
      }
    }
    function us_date_format(_date, fmt) {
      if (fmt == undefined) {
        fmt = "yyyy-MM-dd hh:mm:ss";
      }
      var o = {
        "M+": _date.getMonth() + 1, //月份
        "d+": _date.getDate(), //日
        "h+": _date.getHours(), //小时
        "m+": _date.getMinutes(), //分
        "s+": _date.getSeconds(), //秒
        "q+": Math.floor((_date.getMonth() + 3) / 3), //季度
        S: _date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return fmt;
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