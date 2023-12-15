let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    var orderIds = request.orderIds;
    orderIds.forEach((selfid) => {
      // 销售订单表体
      orderDetails = getOrderDefined(selfid);
      // 待释放[预售量]商品
      var preProductIds = [];
      orderDetails.forEach((self) => {
        if (self === undefined || self.bodyItem.define3 === undefined || self.bodyItem.define3 === "0") {
          return;
        }
        preProductIds.push(self.productId);
      });
      // 有符合释放条件时进行预售释放
      if (preProductIds.length > 0) {
        // 预售配置单信息
        var preSaleDatas = getPreSale(preProductIds);
        orderDetails.forEach((self) => {
          if (includes(preProductIds, self.productId + "")) {
            // 释放预售配置表预售值
            writePreNum({
              preNum: self.bodyItem.define3,
              productId: self.productId,
              productName: self.productName,
              proPreoutdate: self.bodyItem.define5,
              preSaleDatas: preSaleDatas
            });
          }
        });
      }
    });
    function getOrderDefined(param) {
      let res = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + param, "", "");
      res = JSON.parse(res); //转成object对象
      // 返回信息校验
      if (res.code != "200") {
        throw new Error("获取销售订单异常:" + res.message);
      }
      return res.data.orderDetails;
    }
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function writePreNum(params) {
      // 没有预售值则不回写
      if (params === undefined || params.preNum === undefined) {
        return;
      }
      let preNum = new Big(params.preNum);
      if (preNum <= 0) {
        return;
      }
      let preSaleData = params.preSaleDatas[params.productId];
      var ysSaleData = deepClone(preSaleData);
      if (preSaleData === undefined || preSaleData["enable"] !== 1) {
        // 原先预售配置表改变了，无法回写
        return;
      }
      let preSaleItems = preSaleData.items;
      if (preSaleItems === undefined || preSaleItems.length < 1) {
        return;
      }
      // 按照时间排序,倒序
      for (var i = 0, pLen = preSaleItems.length; i < pLen; i++) {
        for (var j = i + 1, tLen = preSaleItems.length; j < tLen; j++) {
          if (new Date(preSaleItems[i].preoutdate).getTime() < new Date(preSaleItems[j].preoutdate).getTime()) {
            let tmp = preSaleItems[j];
            preSaleItems[j] = preSaleItems[i];
            preSaleItems[i] = tmp;
          }
        }
      }
      // 物料已占用的[预计发货时间]
      let proPreoutdate = params.proPreoutdate === undefined ? "" : new Date(params.proPreoutdate).getTime();
      // 待修改[预售配置子表]
      let updatePreSaleParam = {
        id: preSaleData.id,
        items: []
      };
      // 回写预售表 add by lkm
      let updatePreSaleParams = [];
      // 倒序回写
      preSaleItems.forEach((ps) => {
        // 从最晚符合时间开始回写，为空则直接回写最新一条数据
        if (proPreoutdate !== "" && proPreoutdate < new Date(ps.preoutdate).getTime()) {
          return;
        }
        if (ps.num === undefined) {
          "请联系管理员维护商品[" + params.productName + "]预售配置表";
        }
        // 预售配置表中已用数量
        let usednum = ps.usednum === undefined ? new Big(0) : new Big(ps.usednum);
        // 预售配置表中预售阈值
        let num = new Big(ps.num);
        if (preNum <= 0 || usednum <= 0) {
          return;
        } else if (preNum.minus(usednum) <= 0) {
          let updatePreSaleItemParam = {
            id: ps.id,
            usednum: usednum.minus(preNum),
            canusenum: num.minus(usednum.minus(preNum))
          };
          updatePreSaleParam.items.push(updatePreSaleItemParam);
          updatePreSaleParams.push({ update: updatePreSaleParam, yslog: ysSaleData });
          preNum = 0;
        } else {
          let updatePreSaleItemParam = {
            id: ps.id,
            canusenum: ps.num,
            usednum: 0
          };
          updatePreSaleParam.items.push(updatePreSaleItemParam);
          updatePreSaleParams.push({ update: updatePreSaleParam, yslog: ysSaleData });
          preNum = preNum.minus(usednum);
        }
      });
      updatePreSale(updatePreSaleParams[0]);
      return true;
    }
    function deepClone(obj) {
      if (typeof obj !== "object" || obj == null) {
        return obj;
      }
      let res;
      if (obj instanceof Array) {
        res = [];
      } else {
        res = {};
      }
      let keys = Object.keys(obj);
      keys.forEach((key) => {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            res[key] = deepClone(obj[key]);
          }
        }
      });
      return res;
    }
    function getPreSale(param) {
      let req = {
        product: param
      };
      let res = postman("post", config.bipSelfUrl + "/General_product_cla/General_product_clas/InterfacePublishinG?access_token=" + getAccessToken(), "", JSON.stringify(req));
      // 转为JSON对象
      res = JSON.parse(res);
      // 返回信息校验
      if (res.code != "200") {
        throw new Error("查询预售配置单异常:" + res.message);
      }
      return res.data;
    }
    function updatePreSale(param) {
      addYSLogs(param);
      let res = postman("post", config.bipSelfUrl + "/General_product_cla/General_product_clas/updata?access_token=" + getAccessToken(), "", JSON.stringify(param.update));
      // 转为JSON对象
      res = JSON.parse(res);
      // 返回信息校验
      if (res.code != "200") {
        throw new Error("更新预售配置单异常:" + res.message);
      }
    }
    function addYSLogs(param) {
      let items = param.update.items;
      let yslogitems = param.yslog.items;
      let subQty;
      orderDetails.forEach((self) => {
        if (self === undefined || self.bodyItem.define3 === undefined || self.bodyItem.define3 === "0") {
        } else {
          subQty = self.bodyItem.define3;
        }
      });
      for (let i = 0; i < items.length; i++) {
        let hisused = "";
        yslogitems.forEach((self) => {
          if (self != undefined && self["id"] == items[i].id)
            // 历史占用数
            hisused = self["usednum"] + "";
        });
        let object = {
          used: items[i].usednum, //本次更新后占用数
          subQty: subQty,
          dr: 0,
          hisused: hisused,
          orderCode: orderDetails[0].code,
          headid: param.update.id,
          bodyid: items[i].id,
          status: "释放"
        };
        let reslog = postman("post", config.bipSelfUrl + "/General_product_cla/General_product_clas/insertYslog?access_token=" + getAccessToken(), "", JSON.stringify(object));
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });