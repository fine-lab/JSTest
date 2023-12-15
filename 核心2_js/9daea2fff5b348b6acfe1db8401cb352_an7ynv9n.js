let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var requestData = param.data[0];
    var accessToken;
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    let salereturn = vouchersalereturn({ id: requestData.id });
    if (salereturn.id === undefined) {
      return;
    }
    //退货回写
    writeBackStoreNum();
    //回写销售订单 销售退货业务后，回写订单表头固定自定义项32完成状态为 退货退款
    writeBackMoney(salereturn);
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getSaleOrderDetail(params) {
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      result = JSON.parse(result);
      if (result.code != "200") {
        throw new Error("查询销售订单异常:" + result.message);
      }
      return result.data;
    }
    function vouchersalereturn(params) {
      // 响应信息
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询销售退货  " + e);
      }
      return result.data;
    }
    function writeBackStoreNum() {
      let details = salereturn.saleReturnDetails;
      for (var prop of details) {
        let productid = prop.productId;
        let closedRowCount = prop.subQty;
        let orderid = prop.orderId;
        if (orderid == undefined || orderid == "") {
          continue;
        }
        //暂时没有更好的方法 用实体查询查询不到 后续优化
        let saleOrder = getSaleOrderDetail({ id: orderid });
        if (saleOrder == undefined || saleOrder == "") {
          return;
        }
        let storeid = saleOrder.headItem.define60;
        if (storeid == undefined || storeid == "") {
          return;
        }
        let orderCode = saleOrder.code;
        let req = {
          storeid: storeid,
          productid: productid,
          closedRowCount: closedRowCount,
          isClosed: false,
          orderCode: orderCode
        };
        var res = postman("post", config.bipSelfUrl + "/General_product_cla/rest/writeBackStoreNum?access_token=" + getAccessToken(), "", JSON.stringify(req));
        res = JSON.parse(res);
        if (res.code != "200") {
          throw new Error("新开门店商品已使用数量回写异常:" + storeid + "123 " + res.message);
        }
      }
      return res;
    }
    function writeBackStatus(params) {
      let saleOrderNo;
      let sql1;
      try {
        sql1 = "select orderNo from voucher.salereturn.SaleReturnDetail where saleReturnId = '" + params.id + "'";
        saleOrderNo = ObjectStore.queryByYonQL(sql1);
      } catch (e) {
        throw new Error("通过销售退货id查询对应的销售订单ID(afterAuditRule)+sql1: " + sql1 + ",," + e);
      }
      let saleOrderID;
      let sql2;
      try {
        sql2 = "select id,code from voucher.order.Order where code in ('" + saleOrderNo[0].orderNo + "')";
        saleOrderID = ObjectStore.queryByYonQL(sql2);
      } catch (e) {
        throw new Error("通过销售退货id查询对应的销售订单ID(afterAuditRule)+sql2: " + sql2 + ",," + e);
      }
      let Body = {
        billnum: "voucher_order", //来源单据-销售订单
        datas: [
          {
            id: saleOrderID[0].id,
            code: saleOrderID[0].code,
            definesInfo: [
              {
                define32: "",
                isHead: true,
                isFree: false
              }
            ]
          }
        ]
      };
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(Body));
    }
    function writeBackMoney(params) {
      let srcSaleOrder = getSaleOrderDetail({ id: params.saleReturnDetails[0].orderId });
      let details = params.saleReturnDetails;
      let timetem = parseTime(Date.parse(new Date()), "{y}-{m}-{d} {h}:{i}:{s}");
      let Body = {
        billnum: "voucher_order",
        datas: [
          {
            id: srcSaleOrder.id,
            code: srcSaleOrder.code,
            definesInfo: [
              {
                define5: 0,
                define6: 0,
                define9: timetem,
                isHead: true,
                isFree: true
              },
              {
                define32: " ",
                isHead: true,
                isFree: false
              }
            ]
          }
        ]
      };
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(Body));
    }
    function parseTime(time, cFormat, zone = 8) {
      if (arguments.length === 0) {
        return null;
      }
      const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
      let date;
      if (typeof time === "object") {
        date = time;
      } else {
        if (("" + time).length === 10) time = parseInt(time) * 1000;
        date = new Date(time);
      }
      // 时区调整
      const utc = time + new Date(time).getTimezoneOffset() * 60000;
      const wishTime = utc + 3600000 * zone;
      date = new Date(wishTime);
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      };
      const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === "a") {
          return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        if (result.length > 0 && value < 10) {
          value = "0" + value;
        }
        return value || 0;
      });
      return timeStr;
    }
  }
}
exports({ entryPoint: MyTrigger });