let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: ""
    };
    try {
      console.log("接收报文");
      console.log(JSON.stringify(request));
      //正单和退单的报文不一致， 这里需要格式化报文
      let requestData = {};
      let requestReq;
      try {
        requestReq = JSON.parse(request.requestData);
      } catch (e) {
        requestReq = request.requestData;
      }
      if (requestReq.rm_retailvouch && requestReq.retailVouchDetails && requestReq.rm_retailvouch.length > 0 && requestReq.retailVouchDetails.length > 0) {
        //正单报文格式   code、fMoneySum、fSceneDiscountSum、fQuantitySum、retailVouchDetails
        requestData.code = requestReq.rm_retailvouch[0].code;
        requestData.fMoneySum = requestReq.rm_retailvouch[0].fMoneySum;
        requestData.fSceneDiscountSum = requestReq.rm_retailvouch[0].fSceneDiscountSum;
        requestData.fQuantitySum = requestReq.rm_retailvouch[0].fQuantitySum;
      } else {
        //退单报文格式
        requestData.code = requestReq.code;
        requestData.CoCode = requestReq.CoCode;
        requestData.fMoneySum = requestReq.fMoneySum;
        requestData.fSceneDiscountSum = requestReq.fSceneDiscountSum;
        requestData.fQuantitySum = requestReq.fQuantitySum;
      }
      requestData.retailVouchDetails = [];
      requestReq.retailVouchDetails.forEach((item, index) => {
        requestData.retailVouchDetails.push({
          product_cCode: item.product_cCode,
          fQuotePrice: item.fQuotePrice,
          fPrice: item.fPrice,
          fQuantity: item.fQuantity,
          fMoney: item.fMoney,
          fSceneDiscount: item.fSceneDiscount
        });
      });
      console.log("处理之后的报文");
      console.log(JSON.stringify(requestData));
      let isSucc = true;
      if (Number(requestData.fQuantitySum) > 0) {
        console.log("正单");
        if (request.crmCache != undefined && request.crmCache != "") {
          console.log("有缓存");
          let crmCache = JSON.parse(request.crmCache);
          switch (crmCache.crm) {
            case "ly":
              console.log("ly");
              isSucc = this.lycrm(requestData, crmCache);
              break;
            case "ezr":
              console.log("ezr");
              isSucc = this.ezrcrm(requestData, crmCache);
              break;
            default:
              throw new Error("crm会员系统不存在" + crmCache.crm);
          }
        }
      } else {
        console.log("退单");
        let func = extrequire("AT18623B800920000A.api.getCrmCache");
        let getCrm = func.execute({ code: requestData.CoCode });
        if (getCrm.code == "200") {
          if (getCrm.dataInfo) {
            let crmCache = JSON.parse(getCrm.dataInfo.cCrmCache);
            switch (crmCache.crm) {
              case "ly":
                console.log("ly");
                isSucc = this.lycrmTd(requestData, crmCache);
                break;
              case "ezr":
                console.log("ezr");
                isSucc = this.ezrcrmTd(requestData, crmCache);
                break;
              default:
                throw new Error("crm会员系统不存在" + crmCache.crm);
            }
          }
        } else {
          throw new Error("查询正单异常");
        }
      }
      if (!isSucc) {
        console.log("存在错误信息：请到【crm日志】中手动处理！");
        throw new Error("存在错误信息：请到【crm日志】中手动处理！");
      }
      console.log("成功");
    } catch (ex) {
      console.log("异常：" + ex.toString());
      rsp.code = 500;
      rsp.msg = ex.toString();
    }
    return rsp;
  }
  lycrm(requestData, crmCache) {
    let isSucc = true;
    let url, body, res;
    let func = extrequire("AT18623B800920000A.api.CRMAPI");
    let createtime = this.formatDateTimeStr(1);
    let datetimestr = this.formatDateTimeStr(2);
    let busCode = requestData.code;
    let yf = (Number(requestData.fMoneySum) + Number(requestData.fSceneDiscountSum)).toFixed(2);
    let sf = Number(requestData.fMoneySum).toFixed(2);
    let crmBusLog = {};
    crmBusLog.cType = "ly";
    crmBusLog.cCode = busCode;
    crmBusLog.cCrmCache = JSON.stringify(crmCache);
    crmBusLog.isRed = "zd";
    try {
      //判断是否使用了券抵扣a
      if (crmCache.no != undefined && crmCache.no != "") {
        url = ":8102/ipmsgroup/coupon/onlineUseNoAccountCoupon";
        body = {
          couponNo: crmCache.no,
          useSource: "WEBRM",
          totalPrice: yf
        };
        res = func.execute({
          url: url,
          body: body,
          ccode: busCode,
          cbustype: "核销"
        });
        crmBusLog.cBusType = "qhx";
        crmBusLog.url = url;
        crmBusLog.post = JSON.stringify(body);
        crmBusLog.res = JSON.stringify(res);
        if (res.code != 200) {
          isSucc = false;
          crmBusLog.isSucc = "sb";
          console.log("绿云 券核销失败" + res.msg);
        } else {
          crmBusLog.isSucc = "cg";
        }
        this.saveBusLog(crmBusLog);
      }
      //交易数据上传crm
      url = ":8101/ipmsmember/membercard/memberProductionInfo";
      let productionList = [];
      productionList.push({
        taCode: crmCache.taCode,
        accntNum: 1,
        charge: yf,
        createDatetime: createtime
      });
      body = {
        memName: crmCache.memName,
        cardId: crmCache.cardId,
        cardNo: crmCache.cardNo,
        orderNo: busCode,
        totalAmount: yf,
        orderCreateDatetime: createtime,
        sta: "O",
        remark: "",
        productionList: JSON.stringify(productionList)
      };
      res = func.execute({
        url: url,
        body: body,
        ccode: busCode,
        cbustype: "交易记录上传"
      });
      crmBusLog.cBusType = "jysc";
      crmBusLog.url = url;
      crmBusLog.post = JSON.stringify(body);
      crmBusLog.res = JSON.stringify(res);
      if (res.code != 200) {
        isSucc = false;
        crmBusLog.isSucc = "sb";
        console.log("绿云 交易记录上传失败" + res.msg);
      } else {
        crmBusLog.isSucc = "cg";
      }
      this.saveBusLog(crmBusLog);
    } catch (e) {
      isSucc = false;
      console.log("处理异常" + e.toString());
    }
    return isSucc;
  }
  ezrcrm(requestData, crmCache) {
    let isSucc = true;
    let url, body, res;
    let func = extrequire("AT18623B800920000A.api.EZRAPI");
    let createtime = this.formatDateTimeStr(1);
    let datetimestr = this.formatDateTimeStr(2);
    let busCode = requestData.code;
    let yf = (Number(requestData.fMoneySum) + Number(requestData.fSceneDiscountSum)).toFixed(2);
    let sf = Number(requestData.fMoneySum).toFixed(2);
    let crmBusLog = {};
    crmBusLog.cType = "ezr";
    crmBusLog.cCode = busCode;
    crmBusLog.cCrmCache = JSON.stringify(crmCache);
    crmBusLog.isRed = "zd";
    try {
      //判断是否使用了券抵扣
      if (crmCache.no != undefined && crmCache.no != "") {
        //核销券
        url = "/api/ccoup/coupuse";
        body = {
          ShopCode: crmCache.shopCode, //核销门店
          SalesNo: busCode,
          SalesMoney: sf, // crmCache.salesMoney,//核销金额
          CouponNos: [crmCache.no]
        };
        res = func.execute({
          url: url,
          data: body,
          ccode: busCode,
          cbustype: "核销",
          storeId: crmCache.storeId
        });
        crmBusLog.cBusType = "qhx";
        crmBusLog.url = url;
        crmBusLog.post = JSON.stringify(body);
        crmBusLog.res = JSON.stringify(res);
        if (res.code != 200) {
          isSucc = false;
          crmBusLog.isSucc = "sb";
          console.log("ezr 券核销失败" + res.msg);
        } else {
          crmBusLog.isSucc = "cg";
        }
        this.saveBusLog(crmBusLog);
      }
      //交易数据上传crm
      url = "/api/csale/vipsaleupload";
      body = [];
      body.push({
        ShopCode: crmCache.shopCode,
        SaleNo: busCode,
        RefSaleNo: "",
        SaleType: "S",
        VipOffCode: crmCache.cardNo,
        SaleDate: createtime,
        SaleQty: parseInt(requestData.fQuantitySum), //销售总数量
        SaleMoney: yf, //销售总金额
        SaleProdQty: parseInt(requestData.fQuantitySum),
        SaleOrigMoney: yf, //原始总金额数
        SalePayMoney: sf, //实付总金额
        CmdShopCode: "",
        Dtls: [] //商品明细
      });
      requestData.retailVouchDetails.forEach((item, index) => {
        body[0].Dtls.push({
          ProdCode: item.product_cCode,
          RetailPrice: item.fQuotePrice, //零售单价
          SalePrice: item.fPrice, //实际售价
          SaleQty: parseInt(item.fQuantity), //销售件数，
          SaleMoney: (Number(item.fMoney) + Number(item.fSceneDiscount)).toFixed(2), //销售金额
          CmdShopCode: "",
          CmdSalerCode: "",
          SalerCode: ""
        });
      });
      res = func.execute({
        url: url,
        data: body,
        ccode: busCode,
        cbustype: "交易记录上传",
        storeId: crmCache.storeId
      });
      crmBusLog.cBusType = "jysc";
      crmBusLog.url = url;
      crmBusLog.post = JSON.stringify(body);
      crmBusLog.res = JSON.stringify(res);
      if (res.code != 200) {
        isSucc = false;
        crmBusLog.isSucc = "sb";
        console.log("ezr 交易记录上传失败" + res.msg);
      } else {
        crmBusLog.isSucc = "cg";
      }
      this.saveBusLog(crmBusLog);
    } catch (e) {
      isSucc = false;
      console.log("处理异常" + e.toString());
    }
    return isSucc;
  }
  lycrmTd(requestData, crmCache) {
    let isSucc = true;
    let url, body, res;
    let func = extrequire("AT18623B800920000A.api.CRMAPI");
    let createtime = this.formatDateTimeStr(1);
    let datetimestr = this.formatDateTimeStr(2);
    let busCode = requestData.code;
    let yf = (Number(requestData.fMoneySum) + Number(requestData.fSceneDiscountSum)).toFixed(2);
    let sf = Number(requestData.fMoneySum).toFixed(2);
    let crmBusLog = {};
    crmBusLog.cType = "ly";
    crmBusLog.cCoCode = requestData.CoCode;
    crmBusLog.cCode = busCode;
    crmBusLog.cCrmCache = JSON.stringify(crmCache);
    crmBusLog.isRed = "td";
    try {
      //判断是否使用了券抵扣a
      if (crmCache.no != undefined && crmCache.no != "") {
        url = ":8102/ipmsgroup/coupon/onlineCouponUseCancel";
        body = { couponNo: crmCache.no, remark: "退单-核销" };
        res = func.execute({
          url: url,
          body: body,
          ccode: busCode,
          cbustype: "退单-核销"
        });
        crmBusLog.cBusType = "qhx";
        crmBusLog.url = url;
        crmBusLog.post = JSON.stringify(body);
        crmBusLog.res = JSON.stringify(res);
        if (res.code != 200) {
          isSucc = false;
          crmBusLog.isSucc = "sb";
          console.log("绿云 券核销失败" + res.msg);
        } else {
          crmBusLog.isSucc = "cg";
        }
        this.saveBusLog(crmBusLog);
      }
      //交易数据上传crm
      url = ":8101/ipmsmember/membercard/memberProductionInfo";
      let productionList = [];
      productionList.push({
        taCode: crmCache.taCode,
        accntNum: 1,
        charge: yf,
        createDatetime: createtime
      });
      body = {
        memName: crmCache.memName,
        cardId: crmCache.cardId,
        cardNo: crmCache.cardNo,
        orderNo: busCode,
        totalAmount: yf,
        orderCreateDatetime: createtime,
        sta: "O",
        remark: "",
        productionList: JSON.stringify(productionList)
      };
      res = func.execute({
        url: url,
        body: body,
        ccode: busCode,
        cbustype: "交易记录上传"
      });
      crmBusLog.cBusType = "jysc";
      crmBusLog.url = url;
      crmBusLog.post = JSON.stringify(body);
      crmBusLog.res = JSON.stringify(res);
      if (res.code != 200) {
        isSucc = false;
        crmBusLog.isSucc = "sb";
        console.log("绿云 交易记录上传失败" + res.msg);
      } else {
        crmBusLog.isSucc = "cg";
      }
      this.saveBusLog(crmBusLog);
    } catch (e) {
      isSucc = false;
      console.log("处理异常" + e.toString());
    }
    return isSucc;
  }
  ezrcrmTd(requestData, crmCache) {
    let isSucc = true;
    let url, body, res;
    let func = extrequire("AT18623B800920000A.api.EZRAPI");
    let createtime = this.formatDateTimeStr(1);
    let datetimestr = this.formatDateTimeStr(2);
    let busCode = requestData.code;
    let yf = (Number(requestData.fMoneySum) + Number(requestData.fSceneDiscountSum)).toFixed(2);
    let sf = Number(requestData.fMoneySum).toFixed(2);
    let crmBusLog = {};
    crmBusLog.cType = "ezr";
    crmBusLog.cCode = busCode;
    crmBusLog.cCoCode = requestData.CoCode;
    crmBusLog.cCrmCache = JSON.stringify(crmCache);
    crmBusLog.isRed = "td";
    try {
      //判断是否使用了券抵扣
      if (crmCache.no != undefined && crmCache.no != "") {
        //核销券
        url = "/api/ccoup/CoupCancelUse";
        body = {
          CancelUser: "api",
          Remark: "退单-核销",
          CouponNo: crmCache.no
        };
        res = func.execute({
          url: url,
          data: body,
          ccode: busCode,
          cbustype: "退单-核销",
          storeId: crmCache.storeId
        });
        crmBusLog.cBusType = "qhx";
        crmBusLog.url = url;
        crmBusLog.post = JSON.stringify(body);
        crmBusLog.res = JSON.stringify(res);
        if (res.code != 200) {
          isSucc = false;
          crmBusLog.isSucc = "sb";
          console.log("ezr 券核销失败" + res.msg);
        } else {
          crmBusLog.isSucc = "cg";
        }
        this.saveBusLog(crmBusLog);
      }
      //交易数据上传crm
      url = "/api/csale/vipsaleupload";
      body = [];
      body.push({
        ShopCode: crmCache.shopCode,
        SaleNo: busCode,
        RefSaleNo: requestData.CoCode,
        SaleType: "R",
        VipOffCode: crmCache.cardNo,
        SaleDate: createtime,
        SaleQty: parseInt(requestData.fQuantitySum), //销售总数量
        SaleMoney: yf, //销售总金额
        SaleProdQty: parseInt(requestData.fQuantitySum),
        SaleOrigMoney: yf, //原始总金额数
        SalePayMoney: sf, //实付总金额
        CmdShopCode: "",
        Dtls: [] //商品明细
      });
      requestData.retailVouchDetails.forEach((item, index) => {
        body[0].Dtls.push({
          ProdCode: item.product_cCode,
          RetailPrice: item.fQuotePrice, //零售单价
          SalePrice: item.fPrice, //实际售价
          SaleQty: parseInt(item.fQuantity), //销售件数，
          SaleMoney: (Number(item.fMoney) + Number(item.fSceneDiscount)).toFixed(2), //销售金额
          CmdShopCode: "",
          CmdSalerCode: "",
          SalerCode: ""
        });
      });
      res = func.execute({
        url: url,
        data: body,
        ccode: busCode,
        cbustype: "交易记录上传",
        storeId: crmCache.storeId
      });
      crmBusLog.cBusType = "jysc";
      crmBusLog.url = url;
      crmBusLog.post = JSON.stringify(body);
      crmBusLog.res = JSON.stringify(res);
      if (res.code != 200) {
        isSucc = false;
        crmBusLog.isSucc = "sb";
        console.log("ezr 交易记录上传失败" + res.msg);
      } else {
        crmBusLog.isSucc = "cg";
      }
      this.saveBusLog(crmBusLog);
    } catch (e) {
      isSucc = false;
      console.log("处理异常" + e.toString());
    }
    return isSucc;
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
  saveBusLog(crmBusLog) {
    try {
      //日志记录异常不管
      let func = extrequire("AT18623B800920000A.rule.getGateway");
      let getGatewayInfo = func.execute();
      let baseurl = getGatewayInfo.data.gatewayUrl; //网关
      let a = openLinker("POST", baseurl + "/b9v257wq/jz/crmjz01/CRMTransLogSave", "AT18623B800920000A", JSON.stringify(crmBusLog));
    } catch (e) {
      console.log("记录业务日志失败" + e.toString());
    }
  }
}
exports({ entryPoint: MyAPIHandler });