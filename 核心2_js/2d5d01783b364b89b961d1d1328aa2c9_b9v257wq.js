let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    console.log(JSON.stringify(param));
    let requestData = JSON.parse(param.requestData);
    if (requestData.crmCache != undefined && requestData.crmCache != "") {
      //当前单据使用了对接crm
      let crmCache = JSON.parse(requestData.crmCache);
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
    }
    return {};
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
        cbustype: "验券-核销"
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
          cbustype: "验券-反核销"
        });
        if (res.code != 200) {
          throw new Error("CRM验证券失败：" + res.msg);
        }
      }
    }
  }
  lycrm(requestData, crmCache) {
    let isHX = false;
    let couponNo = "";
    let url, body, res;
    let func = extrequire("AT18623B800920000A.api.CRMAPI");
    let datetimestr = this.formatDateTimeStr(2);
    let busCode = requestData.code + "_" + datetimestr;
    try {
      //判断是否使用了券抵扣a
      if (crmCache.no != undefined && crmCache.no != "") {
        couponNo = crmCache.no;
        url = ":8102/ipmsgroup/coupon/onlineUseNoAccountCoupon";
        body = {
          couponNo: crmCache.no,
          useSource: "WEBRM",
          totalPrice: parseFloat(requestData.fMoneySum) + parseFloat(crmCache.salesMoney)
        };
        res = func.execute({ url: url, body: body, ccode: busCode });
        if (res.code != 200) {
          throw new Error("CRM券核销失败：" + res.msg);
        }
        isHX = true;
      }
      //储值卡消费  判断最终结算方式是否包含储值卡消费
      let crmpay = requestData.retailVouchGatherings.find((v) => v.Paymentname == "CRM储值卡");
      if (crmpay) {
        //储值卡消费
        url = ":8101/ipmsmember/membercard/onlineChargeForCardAccount";
        body = {
          taCode: "9600",
          cardId: crmCache.cardId,
          money: crmpay.fMoney,
          transNo: busCode,
          crsNo: "",
          limitOnce: "",
          source: "WEBRM"
        };
        res = func.execute({ url: url, body: body, ccode: busCode });
        if (res.code != 200) {
          throw new Error("储值卡消费失败：" + res.msg);
        }
      }
      //交易数据上传crm
      url = ":8101/ipmsmember/membercard/memberProductionInfo";
      let productionList = [];
      productionList.push({
        taCode: crmCache.taCode,
        accntNum: 1,
        charge: (Number(requestData.fMoneySum) + Number(crmCache.salesMoney)).toFixed(2),
        createDatetime: requestData.createTime
      });
      body = {
        memName: crmCache.memName,
        cardId: crmCache.cardId,
        cardNo: crmCache.cardNo,
        orderNo: busCode,
        totalAmount: (Number(requestData.fMoneySum) + Number(crmCache.salesMoney)).toFixed(2),
        orderCreateDatetime: requestData.createTime,
        sta: "O",
        remark: "",
        productionList: JSON.stringify(productionList)
      };
      res = func.execute({ url: url, body: body, ccode: busCode });
      if (res.code != 200) {
        throw new Error("CRM交易数据上传失败：" + res.msg);
      }
    } catch (e) {
      let err = "";
      if (isHX) {
        //如果券已经核销 后续结算流程异常， 需要将券取消核销
        url = ":8102/ipmsgroup/coupon/onlineCouponUseCancel";
        body = { couponNo: couponNo, remark: "异常回滚" };
        res = func.execute({ url: url, body: body, ccode: busCode });
        if (res.code != 200) {
          throw new Error("券回滚异常：" + res.msg);
        }
      }
      throw new Error("[" + err + "]结算异常：" + e.toString());
    }
  }
  ezrcrm(requestData, crmCache) {
    let isHX = false;
    let couponNo = "";
    let url, body, res;
    let func = extrequire("AT18623B800920000A.api.EZRAPI");
    let datetimestr = this.formatDateTimeStr(2);
    let busCode = requestData.code + "_" + datetimestr;
    //判断是否使用了券抵扣
    if (crmCache.no != undefined && crmCache.no != "") {
      //核销券
      couponNo = crmCache.no;
      url = "/api/ccoup/coupuse";
      body = {
        ShopCode: crmCache.shopCode, //核销门店
        SalesNo: requestData.code,
        SalesMoney: requestData.fMoneySum, // crmCache.salesMoney,//核销金额
        CouponNos: [couponNo]
      };
      res = func.execute({ url: url, data: body, ccode: requestData.code });
      if (res.code != 200) {
        throw new Error("CRM券核销失败：" + res.msg);
      }
      isHX = true;
    }
    try {
      //交易数据上传crm
      url = "/api/csale/vipsaleupload";
      body = [];
      body.push({
        ShopCode: crmCache.shopCode,
        SaleNo: requestData.code,
        RefSaleNo: "",
        SaleType: "S",
        VipOffCode: crmCache.cardNo,
        SaleDate: this.formatDateTimeStr(1), //requestData.dDate,
        SaleQty: parseInt(requestData.fQuantitySum), //销售总数量
        SaleMoney: (Number(requestData.fMoneySum) + Number(crmCache.salesMoney)).toFixed(2), //销售总金额
        SaleProdQty: "",
        SaleOrigMoney: (Number(requestData.fMoneySum) + Number(crmCache.salesMoney)).toFixed(2), //原始总金额数
        SalePayMoney: requestData.fMoneySum, //实付总金额
        CmdShopCode: "",
        Dtls: [] //商品明细
      });
      requestData.retailVouchDetails.forEach((item, index) => {
        body[0].Dtls.push({
          ProdCode: item.product_cCode,
          RetailPrice: item.fPrice, //零售单价
          SalePrice: item.fPrice, //实际售价
          SaleQty: parseInt(item.fQuantity), //销售件数，
          SaleMoney: (Number(requestData.fMoneySum) + Number(crmCache.salesMoney)).toFixed(2), //销售金额
          CmdShopCode: "",
          CmdSalerCode: "",
          SalerCode: ""
        });
      });
      res = func.execute({ url: url, data: body, ccode: requestData.code });
    } catch (e) {
      console.log("卡券核销失败" + e.toString());
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
exports({ entryPoint: MyTrigger });