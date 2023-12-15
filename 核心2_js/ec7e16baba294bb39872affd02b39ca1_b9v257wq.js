let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: ""
    };
    return rsp;
    try {
      let requestData = request.requestData;
      let crmCache = request.crmCache;
      if (requestData.fQuantitySum > 0) {
        //正单
        switch (crmCache.crm) {
          case "ly":
            this.ly(requestData, crmCache);
            break;
          case "ezr":
            this.ezr(requestData, crmCache);
            break;
          default:
            throw new Error("crm会员系统不存在" + crmCache.crm);
        }
      }
    } catch (e) {
      console.log("异常：" + e.toString());
      rsp.code = 999;
      rsp.msg = e.toString();
    }
    return rsp;
  }
  ly(requestData, crmCache) {
    let url, body, res;
    let func = extrequire("AT18623B800920000A.api.CRMAPI");
    let datetimestr = this.formatDateTimeStr(2);
    let busCode = requestData.code + "_" + datetimestr;
    if (crmCache.no != undefined && crmCache.no != "") {
      url = ":8102/ipmsgroup/coupon/onlineUseNoAccountCoupon";
      body = {
        couponNo: crmCache.no,
        useSource: "WEBRM",
        totalPrice: parseFloat(requestData.fMoneySum) + parseFloat(requestData.fSceneDiscountSum)
      };
      res = func.execute({
        url: url,
        body: body,
        ccode: busCode,
        cbustype: "验券-核销"
      });
      if (res.code != 200) {
        throw new Error("CRM券核销失败：" + res.msg);
      } else {
        //核销的券返还、用来做券验证
        url = ":8102/ipmsgroup/coupon/onlineCouponUseCancel";
        body = { couponNo: crmCache.no, remark: "验证券" };
        res = func.execute({
          url: url,
          body: body,
          ccode: busCode,
          cbustype: "验券-反核销"
        });
        if (res.code != 200) {
          throw new Error("CRM验证券失败：" + res.msg);
        }
      }
    }
  }
  ezr(requestData, crmCache) {
    let url, body, res;
    let func = extrequire("AT18623B800920000A.api.EZRAPI");
    let datetimestr = this.formatDateTimeStr(2);
    let busCode = requestData.code + "_" + datetimestr;
    //判断是否使用了券抵扣
    if (crmCache.no != undefined && crmCache.no != "") {
      //核销券
      url = "/api/ccoup/coupuse";
      body = {
        ShopCode: crmCache.shopCode, //核销门店
        SalesNo: requestData.code,
        SalesMoney: requestData.fMoneySum, // crmCache.salesMoney,//核销金额
        CouponNos: [crmCache.no]
      };
      res = func.execute({
        url: url,
        data: body,
        ccode: busCode,
        cbustype: "验券-核销",
        storeId: crmCache.storeId
      });
      if (res.code != 200) {
        throw new Error("CRM券核销失败：" + res.msg);
      } else {
        //核销的券返还、用来做券验证
        url = "/api/ccoup/CoupCancelUse";
        body = {
          CancelUser: "api",
          Remark: "验证券",
          CouponNo: crmCache.no
        };
        res = func.execute({
          url: url,
          data: body,
          ccode: busCode,
          cbustype: "验券-反核销",
          storeId: crmCache.storeId
        });
        if (res.code != 200) {
          throw new Error("CRM验证券失败：" + res.msg);
        }
      }
    }
  }
  // 格式时间字符串
  formatDateTimeStr(type) {
    var timezone = 8; //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var dateObject = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var y = dateObject.getFullYear();
    var m = dateObject.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = dateObject.getDate();
    d = d < 10 ? "0" + d : d;
    var h = dateObject.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = dateObject.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = dateObject.getSeconds();
    second = second < 10 ? "0" + second : second;
    if (type === 1) {
      // 返回年月日
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    } else if (type === 2) {
      // 返回年月日 时分秒
      return h + "" + minute + "" + second;
    }
  }
}
exports({ entryPoint: MyAPIHandler });