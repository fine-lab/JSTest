let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 订单数据：订货门户requestData为字符串,需转为JSON和管理门户保持一致
    try {
      var requestData = param.requestData.orderDetails === undefined ? JSON.parse(param.requestData) : param.requestData;
    } catch (e) {
      // 变更单不走该逻辑
      return;
    }
    // 订单表体数据
    var orderDetails = requestData.orderDetails;
    // 获取token用来访问openApi接口
    var accessToken;
    wholeCarBusiness();
    verifyInventory();
    splitingRule();
    closeMaterialGroup();
    param.set("requestData", JSON.stringify(requestData));
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderSplitRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function wholeCarBusiness() {
      // 校验是否为整车业务
      if (requestData["headItem!define7"] !== "是") {
        // 非整车业务
        return false;
      }
      // 整车业务校验逻辑————————start
      // 校验整车标识号
      if (requestData["headItem!define3"] === undefined) {
        throw new Error("请维护整车标识号!");
      }
      // 客户信息
      var customerInfo = extrequire("GT80750AT4.backDefaultGroup.getCustomerInfo").execute({ agentId: requestData.agentId });
      if (customerInfo === undefined || customerInfo.apiResponse === undefined) {
        throw new Error("请维护客户信控比例!");
      }
      var customerInfoRes = JSON.parse(customerInfo.apiResponse).data;
      if (customerInfoRes === undefined || customerInfoRes.merchantDefine === undefined) {
        throw new Error("请维护客户信控比例!");
      }
      // 信控比例
      param.data[0].headItem.set("define5", customerInfoRes.merchantDefine.define10 + "");
      requestData["headItem!define5"] = param.data[0].headItem.define5;
      if (customerInfoRes.customerDefine !== undefined) {
        // 客户等级
        param.data[0].headItem.set("define6", customerInfoRes.customerDefine.customerDefine1 + "");
        requestData["headItem!define6"] = param.data[0].headItem.define6;
      }
      return true;
    }
    function verifyInventory() {
      // 库存校验返回信息
      var inventoryInfo = extrequire("SCMSA.saleOrderSplitRule.verifyInventoryApi").execute({
        salesOrgId: requestData.salesOrgId,
        orderDetails: orderDetails
      });
      // 校验库存——物料
      var idkey2Inventory = {};
      // 预售业务——物料
      var preProductIds = [];
      inventoryInfo.forEach((self) => {
        // 不走校验库存逻辑的物料 define11:是否控制库存
        // 目前物料批量查询接口没有自由自定义项，待后续openApi支持后优化为一次批量查询
        let materialInfo = getMaterialInfo({ id: self.productId });
        if (materialInfo.freeDefine !== undefined && materialInfo.freeDefine.define11 === "false") {
          // 该物料不校验库存
          return;
        }
        // 待校验库存物料
        idkey2Inventory[self.idKey] = self;
        // 预售业务——物料
        if (materialInfo.freeDefine !== undefined && materialInfo.freeDefine.define12 === "true" && materialInfo.freeDefine.define13 === "false") {
          // 停产不停售不走预售 define12:是否停产 define13:是否停售
          return;
        }
        // 执行预售业务的物料
        if (!includes(preProductIds, self.productId)) {
          preProductIds.push(self.productId);
        }
      });
      // 预售配置单信息
      var preSaleDatas = [];
      if (preProductIds.length > 0) {
        preSaleDatas = getPreSale(preProductIds);
      }
      // 是否需要更新预售配置单信息
      var isUpdatePre = false;
      // 释放预售值
      orderDetails.forEach((self, index) => {
        if (param.data[0].orderDetails[index].bodyItem === null || param.data[0].orderDetails[index].bodyItem === undefined) {
          let bodyItem = new Map();
          bodyItem.set("_realtype", true);
          bodyItem.set("_entityName", "voucher.order.OrderDetailDefine");
          bodyItem.set("_keyName", "orderDetailId");
          bodyItem.set("_status", "Insert");
          bodyItem.set("orderDetailId", param.data[0].orderDetails[index].id);
          bodyItem.set("code", param.data[0].orderDetails[index].code);
          bodyItem.set("orderDetailKey", param.data[0].orderDetails[index].idKey);
          bodyItem.set("orderId", param.data[0].orderDetails[index].orderId);
          param.data[0].orderDetails[index].set("_convert_bodyItem", "ok");
        } else {
          // 释放预售配置表预售值
          isUpdatePre = writePreNum({
            preNum: param.data[0].orderDetails[index].bodyItem.define3,
            productId: self.productId,
            productName: self.productName,
            proPresaledate: param.data[0].orderDetails[index].bodyItem.define5,
            preSaleDatas: preSaleDatas
          });
          // 重设预售标识
          // 表体预售标识
          param.data[0].orderDetails[index].bodyItem.set("define1", "否");
          // 表体预售数量
          param.data[0].orderDetails[index].bodyItem.set("define2", "0");
          // 表体预售数量
          param.data[0].orderDetails[index].bodyItem.set("define3", "0");
          requestData.orderDetails[index]["bodyItem!define1"] = param.data[0].orderDetails[index].bodyItem.define1;
          requestData.orderDetails[index]["bodyItem!define2"] = param.data[0].orderDetails[index].bodyItem.define2;
          requestData.orderDetails[index]["bodyItem!define3"] = param.data[0].orderDetails[index].bodyItem.define3;
        }
      });
      // 获取新预售配置单信息
      if (isUpdatePre && preProductIds.length > 0) {
        preSaleDatas = getPreSale(preProductIds);
      }
      // 循环校验表体
      orderDetails.forEach((self, index) => {
        // 库存校验
        if (idkey2Inventory[self.idKey] === undefined) {
          // 没有对应关系不校验库存
          return;
        }
        // 减完当前商品数量后的库存数量，(如果库存数量小于0，以0为基数减去当前商品数量)
        let lastCount = new Big(idkey2Inventory[self.idKey]["lastCount"]);
        if (lastCount >= 0) {
          // 库存满足，不需要走预售
          return;
        }
        // 查询是否为预售
        let preSaleData = preSaleDatas[self.productId];
        if (preSaleData !== undefined && preSaleData["enable"] === 1) {
          // 计算预售配置表预售数量
          let preSaleItems = preSaleData.items;
          if (preSaleItems === undefined || preSaleItems.length < 1) {
            throw new Error("请联系管理员维护商品[" + self.productName + "]预售配置表!");
          }
          // 待计算所需占用库存数量
          let preCount = new Big(lastCount).abs();
          // 按照时间排序
          for (var i = 0, pLen = preSaleItems.length; i < pLen; i++) {
            for (var j = i + 1, tLen = preSaleItems.length; j < tLen; j++) {
              if (new Date(preSaleItems[i].presaledate).getTime() > new Date(preSaleItems[j].presaledate).getTime()) {
                let tmp = preSaleItems[j];
                preSaleItems[j] = preSaleItems[i];
                preSaleItems[i] = tmp;
              }
            }
          }
          // 当前时间戳
          let nowDateTime = new Date().getTime();
          // 待修改[预售配置子表]
          let updatePreSaleParam = { id: preSaleData.id, items: [] };
          // 回写最终[预计发货时间]
          let updatePresaleDate;
          // 预售配置子表
          preSaleItems.forEach((ps) => {
            // 预计发货时间小于当前时间的跳过
            if (nowDateTime > new Date(ps.preoutdate).getTime()) {
              return;
            }
            let canusenum = ps.canusenum === undefined ? new Big(0) : new Big(ps.canusenum);
            if (preCount <= 0 || canusenum <= 0) {
              return;
            } else if (preCount.minus(canusenum) <= 0) {
              if (ps.num === undefined) {
                "请联系管理员维护商品[" + self.productName + "]预售配置表";
              }
              let updatePreSaleItemParam = {
                id: ps.id,
                canusenum: canusenum.minus(preCount),
                usednum: new Big(ps.num).minus(canusenum.minus(preCount))
              };
              updatePreSaleParam.items.push(updatePreSaleItemParam);
              preCount = 0;
            } else {
              let updatePreSaleItemParam = {
                id: ps.id,
                canusenum: 0,
                usednum: ps.num
              };
              updatePreSaleParam.items.push(updatePreSaleItemParam);
              preCount = preCount.minus(canusenum);
            }
            updatePresaleDate = ps.presaledate;
          });
          // 如果剩余[预占数量]大于0则提示
          if (preCount > 0) {
            throw new Error("商品[" + self.productName + "]缺少[" + preCount + "]预售量!");
          }
          updatePreSale(updatePreSaleParam);
          // 表头预售标识
          param.data[0].headItem.set("define9", "是");
          if (param.data[0].orderDetails[index].bodyItem !== null && param.data[0].orderDetails[index].bodyItem !== undefined) {
            // 表体预售标识
            param.data[0].orderDetails[index].bodyItem.set("define1", "是");
            requestData.orderDetails[index]["bodyItem!define1"] = param.data[0].orderDetails[index].bodyItem.define1;
            // 表体预售数量
            param.data[0].orderDetails[index].bodyItem.set("define2", new Big(lastCount).abs() + "");
            requestData.orderDetails[index]["bodyItem!define2"] = param.data[0].orderDetails[index].bodyItem.define2;
            // 表体预售数量
            param.data[0].orderDetails[index].bodyItem.set("define3", new Big(lastCount).abs() + "");
            requestData.orderDetails[index]["bodyItem!define3"] = param.data[0].orderDetails[index].bodyItem.define3;
            // 预计发货时间
            param.data[0].orderDetails[index].bodyItem.set("define5", updatePresaleDate);
            requestData.orderDetails[index]["bodyItem!define5"] = param.data[0].orderDetails[index].bodyItem.define5;
          }
        } else {
          throw new Error("商品[" + self.productName + "]缺少[" + new Big(lastCount).abs() + "]库存量!");
        }
      });
    }
    function getPreSale(param) {
      let req = {
        product: param
      };
      let res = postman(
        "post",
        "https://www.example.com/" + getAccessToken(),
        "",
        JSON.stringify(req)
      );
      // 转为JSON对象
      res = JSON.parse(res);
      // 返回信息校验
      if (res.code != "200") {
        throw new Error("查询预售配置单异常:" + res.message);
      }
      return res.data;
    }
    function splitingRule() {
      // 根据组织ID获取分单规则数据
      var allSplitingRule = postman(
        "post",
        "https://www.example.com/" + getAccessToken(),
        "",
        JSON.stringify({ orgId: requestData.salesOrgId })
      );
      // 转为JSON对象
      allSplitingRule = JSON.parse(allSplitingRule);
      // 返回信息校验
      if (allSplitingRule.code != "200") {
        throw new Error("分单规则api异常:" + allSplitingRule.message);
      }
      // 分单规则列表数据
      if (allSplitingRule.data === undefined || allSplitingRule.data.enable !== 1) {
        // 分单规则未启用
        return;
      }
      // 分单规则列表数据
      var splitingRuleData = allSplitingRule.data.materials;
      if (splitingRuleData === undefined) {
        return;
      }
      // 物料ID对应分单规则ID
      var oneTransCode;
      splitingRuleData.forEach((self) => {
        if (JSON.stringify(orderDetails[0].productId) === self.shangpin) {
          oneTransCode = self.transCode;
        }
      });
      // 设置该组织下默认交易类型
      let defTranId = extrequire("SCMSA.saleOrderSplitRule.getTranstypeId").execute({
        code: oneTransCode,
        defTranCode: allSplitingRule.data.defTranCode
      });
      // 确保只有原单赋值默认交易类型
      param.data[0].set("transactionTypeId", defTranId);
      param.data[0].set("transactionTypeId_code", "");
      param.data[0].set("transactionTypeId_name", "");
      requestData.transactionTypeId = defTranId;
      requestData.transactionTypeId_code = "";
      requestData.transactionTypeId_name = "";
    }
    function updatePreSale(param) {
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(param));
      // 转为JSON对象
      res = JSON.parse(res);
      // 返回信息校验
      if (res.code != "200") {
        throw new Error("更新预售配置单异常:" + res.message);
      }
    }
    function getMaterialInfo(param) {
      let res = postman("get", "https://www.example.com/" + getAccessToken() + "&orgId=666666&id=" + param.id, "", "");
      // 转为JSON对象
      res = JSON.parse(res);
      // 返回信息校验
      if (res.code != "200") {
        throw new Error("查询物料详情异常:" + res.message + ";商品ID[" + param.id + "]");
      }
      return res.data;
    }
    function closeMaterialGroup() {
      // 参数封装
      let agentId_code = requestData.agentId_code === undefined ? getMerchant({ id: requestData.agentId }).code : requestData.agentId_code;
      let params = {
        code: agentId_code,
        materialcodes: []
      };
      orderDetails.forEach((self) => {
        params.materialcodes.push(self.productCode);
      });
      // 进货权校验
      closeMaterialGroupByNcc(params);
    }
    function closeMaterialGroupByNcc(params) {
      // 响应信息
      let result = postman("post", "https://www.example.com/", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.msg);
        } else if (result.data === undefined) {
          throw new Error(JSON.stringify(result));
        } else if (result.data.state !== "0") {
          throw new Error(result.data.msg);
        }
      } catch (e) {
        throw new Error("进货权校验 " + e + ";参数:" + JSON.stringify(params));
      }
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
          if (new Date(preSaleItems[i].presaledate).getTime() < new Date(preSaleItems[j].presaledate).getTime()) {
            let tmp = preSaleItems[j];
            preSaleItems[j] = preSaleItems[i];
            preSaleItems[i] = tmp;
          }
        }
      }
      // 物料已占用的[预计发货时间]
      let proPresaledate = params.proPresaledate === undefined ? "" : new Date(params.proPresaledate).getTime();
      // 待修改[预售配置子表]
      let updatePreSaleParam = {
        id: preSaleData.id,
        items: []
      };
      // 倒序回写
      preSaleItems.forEach((ps) => {
        // 从最晚符合时间开始回写，为空则直接回写最新一条数据
        if (proPresaledate !== "" && proPresaledate < new Date(ps.presaledate).getTime()) {
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
          preNum = 0;
        } else {
          let updatePreSaleItemParam = {
            id: ps.id,
            canusenum: ps.num,
            usednum: 0
          };
          updatePreSaleParam.items.push(updatePreSaleItemParam);
          preNum = preNum.minus(usednum);
        }
      });
      updatePreSale(updatePreSaleParam);
      return true;
    }
    function getMerchant(params) {
      // 响应信息
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询客户档案详情 " + e);
      }
      return result.data;
    }
  }
}
exports({ entryPoint: MyTrigger });