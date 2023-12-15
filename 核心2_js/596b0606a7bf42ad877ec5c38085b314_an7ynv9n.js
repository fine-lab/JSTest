let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    var details = param.data[0].ReceiveBill_b;
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
        //查询核销单日期
        let hxdate = queryHX(saleCode);
        updateSaleOrderParam.push({
          id: orders[0].id,
          code: saleCode,
          definesInfo: [
            {
              isHead: true,
              isFree: true,
              define17: hxdate
            }
          ]
        });
      } else {
        let orders = getSaleOrderData(self.orderno);
        //查询核销单日期
        let hxdate = queryHX(self.orderno);
        updateSaleOrderParam.push({
          id: orders[0].id,
          code: self.orderno,
          definesInfo: [
            {
              isHead: true,
              isFree: true,
              define17: hxdate
            }
          ]
        });
      }
    });
    //回写核销日期--zb
    if (updateSaleOrderParam.length > 0) {
      updateSaleOrderData(updateSaleOrderParam);
    }
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    //查询核销日期
    function queryHX(reqBody) {
      let data = {
        pageIndex: "1",
        pageSize: "100",
        orderno: reqBody
      };
      let verification = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(data));
      // 返回信息校验
      if (verification.code === "200") {
        return verification.data.pubts;
      }
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
    return {};
  }
}
exports({ entryPoint: MyTrigger });