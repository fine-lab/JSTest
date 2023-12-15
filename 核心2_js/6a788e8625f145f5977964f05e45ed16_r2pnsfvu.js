let AbstractTrigger = require("AbstractTrigger");
// 外部协同-预订单-订单导入处理
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let { importMode } = param;
    if (!importMode) {
      return;
    }
    return new OrderImportValidateRule().validateAndUpdate(context, param);
  }
}
class OrderImportValidateRule {
  validateAndUpdate(context, param) {
    let data = param.data[0];
    let { org_id, cmmssn_merchant, merchant, operator, bustype, preorder_bList: children } = data;
    let errMsg = this.getLevelErr1(data);
    if (!errMsg) {
      throw new Error(errMsg);
    }
    this.checkMerchant(org_id, merchant);
    let productIds = children.map(function (v) {
      return v.product + "";
    });
    let set = new Set(productIds);
    productIds = Array.from(set);
    let productsInfoList = this.checkProducts(org_id, productIds);
    let productsInfoMap = {};
    productsInfoList.map(function (v) {
      productsInfoMap[v.id] = v;
    });
    children.map(function (v, i) {
      if (!productsInfoMap[v.product]) {
      } else if (productsInfoMap[v.product]["unit"] !== v.unit) {
      }
    });
    let { treeMap } = new RefRangeAPI().getMapping();
    let rangeOrgArray = Object.keys(treeMap);
    let hasNotMapping = `为找到相应的代理商客户品种:`;
    if (!rangeOrgArray.includes(org_id)) {
      throw new Error(hasNotMapping + "组织");
    }
    let cmmssn_merchantMapping = treeMap[org_id] || {};
    if (!Object.keys(cmmssn_merchantMapping).includes(cmmssn_merchant)) {
      throw new Error(hasNotMapping + "代理商");
    }
    let operatorMapping = cmmssn_merchantMapping[cmmssn_merchant] || {};
    if (!Object.keys(operatorMapping).includes(operator)) {
      throw new Error(hasNotMapping + "业务员");
    }
    let { merchants = [], products = [] } = operatorMapping[operator];
    if (!merchants.includes(merchant + "")) {
      throw new Error(hasNotMapping + "客户");
    }
    var productsErrMsg = "";
    for (let pId of productIds) {
      if (!products.includes(pId)) {
        productsErrMsg += `编码[${productsInfoMap[pId].code}]名称${productsInfoMap[pId].name}, `;
      }
    }
    if (productsErrMsg) {
      throw new Error(hasNotMapping + "物料" + productsErrMsg);
    }
    let bustypeInfo = this.getTranstype(bustype);
    var DaysOfAccountingPeriod;
    // 现销
    if (bustypeInfo["code"] == "CashSale") {
      DaysOfAccountingPeriod = 0;
      // 赊销
    } else if (bustypeInfo["code"] == "CreditSale") {
      DaysOfAccountingPeriod = this.getDays(cmmssn_merchant, merchant);
    } else {
      throw new Error(`交易类型编码集合限定[CashSale现销,CreditSale赊销]`);
    }
    data.DaysOfAccountingPeriod = DaysOfAccountingPeriod;
    data.transtypeCode = bustypeInfo["code"];
    // 单价精度
    let precisionPrice = 8;
    // 金额精度
    let precisionAmount = 2;
    let updateRestrictionHead = {
      DaysOfAccountingPeriod: "账期天数",
      transtypeCode: "交易类型编码"
    };
    let updateRestrictionBody = {
      unit: "单位",
      isTax: "是否含税",
      taxRate: "税率",
      taxAmount: "税额",
      amountIncludingTax: "含税金额",
      amountWithoutTax: "无税金额",
      transactionPriceIncludingTax: "含税成交价",
      transactionPriceWithoutTax: "无税成交价"
    };
    for (let child of children) {
      let productObj = productsInfoMap[child.product];
      let { price: priceArray, taxrateRes, unitRes } = new fillMaterialInfoAPI().fill(productObj.id, org_id, cmmssn_merchant, merchant, productObj.detail_productApplyRangeId);
      let num = child.num;
      child.unit = productObj["unit"];
      if (priceArray.length === 1) {
        let priceObj = priceArray[0];
        let ntaxrateContent = taxrateRes["ntaxrate"] ? taxrateRes.ntaxrate : 0;
        let ntaxrate = ntaxrateContent / 100.0;
        // 询到的价格
        let priceTemporal = priceObj.price;
        // 是否含税
        let isTax = priceObj.isPriceContainsTax;
        // 含税单价
        var priceWithTax;
        // 无税单价
        var priceWithoutTax;
        if ("Y" === isTax) {
          priceWithTax = new Number(priceTemporal).toFixed(precisionPrice);
          priceWithoutTax = (priceTemporal / (1 + ntaxrate)).toFixed(precisionPrice);
        } else {
          priceWithTax = (priceTemporal * (1 + ntaxrate)).toFixed(precisionPrice);
          priceWithoutTax = new Number(priceTemporal).toFixed(precisionPrice);
        }
        child.taxRate = new Number(ntaxrate).toFixed(precisionAmount);
        child.isTax = isTax;
        child.transactionPriceIncludingTax = priceWithTax;
        child.transactionPriceWithoutTax = priceWithoutTax;
        debugger;
        let amountIncludingTax = (new Number(priceWithTax) * num).toFixed(precisionAmount);
        child.amountIncludingTax = amountIncludingTax;
        let amountWithoutTax = (new Number(priceWithoutTax) * num).toFixed(precisionAmount);
        child.amountWithoutTax = amountWithoutTax;
        let taxAmount = (new Number(amountIncludingTax) - new Number(amountWithoutTax)).toFixed(precisionAmount);
        child.taxAmount = taxAmount;
      } else if (priceArray.length > 1) {
        throw new Error(`物料编码[${productObj.code}]名称[${productObj.name}]价格找到多条数据！`);
      } else {
        throw new Error(`物料编码[${productObj.code}]名称[${productObj.name}]价格未询到！`);
      }
    }
    let centCertApi = new EntCertCheckAPI();
    centCertApi.validate(org_id, merchant, null, 1);
    var index = 0;
    let scopeCheckProducts = children.map(function (v) {
      return {
        rowno: ++index + "",
        product: v.product + ""
      };
    });
    centCertApi.validate(org_id, merchant, scopeCheckProducts, 2);
    let updateProp = {
      id: data.id,
      initializationFlag: data.initializationFlag ? data.initializationFlag : "N",
      isImported: "Y",
      _status: "Update"
    };
    let headKeys = Object.keys(updateRestrictionHead);
    let bodyKeys = Object.keys(updateRestrictionBody);
    for (let updateKey of headKeys) {
      updateProp[updateKey] = data[updateKey];
    }
    let preorder_bList = [];
    for (let child of children) {
      let child4Update = {
        _status: "Update",
        id: child.id
      };
      for (let updateKey of bodyKeys) {
        child4Update[updateKey] = child[updateKey];
      }
      preorder_bList.push(child4Update);
    }
    updateProp.preorder_bList = preorder_bList;
    debugger;
    try {
      let updateRes = ObjectStore.updateById("GT7239AT6.GT7239AT6.test_preorder_h", updateProp);
    } catch (e) {
      throw new Error(JSON.stringify(e));
    }
    return { context, param };
  }
  // 赊销获取账期天数
  getDays(cmmssn_merchant, merchant) {
    let sql1 = `select account_period from GT7239AT6.GT7239AT6.business_credit_b where merchantId = 'yourIdHere' and  business_credit_bFk.cmmssn_merchant = '${cmmssn_merchant}'`;
    let account_period = ObjectStore.queryByYonQL(sql1);
    return account_period.length === 0 ? 0 : account_period[0]["account_period"];
  }
  getTranstype(transtype) {
    let url = `https://api.diwork.com/yonbip/digitalModel/transtype/detail?id=${transtype}`;
    let json = ublinker("get", url, HEADER_STRING, null);
    var obj = JSON.parse(json);
    if (obj.code == 200) {
      obj = obj.data;
    } else if (obj.code == 999) {
      throw new Error(obj.message);
    }
    return obj || {};
  }
  getTime() {
    return new Date().getTime();
  }
  checkOrg(org_id) {
    let url = `https://api.diwork.com/yonbip/digitalModel/orgunit/detail?id=${org_id}`;
    let resultJson = ublinker("get", url, HEADER_STRING, null);
    var resultObj = JSON.parse(resultJson);
    if (resultObj.code == 200) {
      resultObj = resultObj.data;
      if (!resultObj["id"]) {
        throw new Error(`组织${org_id}未找到`);
      }
    } else {
      throw new Error(resultObj.message);
    }
  }
  // 校验物料
  checkProducts(org_id, products) {
    let url = `https://api.diwork.com/yonbip/digitalModel/product/queryByPage`;
    let resultJson = ublinker(
      "post",
      url,
      HEADER_STRING,
      JSON.stringify({
        data: "id,code,name,unit,detail.productApplyRangeId",
        page: {
          pageIndex: 1,
          pageSize: 10
        },
        condition: {
          simpleVOs: [
            {
              logicOp: "and",
              conditions: [
                {
                  field: "id",
                  op: "in",
                  value1: products
                },
                {
                  field: "productApplyRange.orgId",
                  op: "eq",
                  value1: org_id
                }
              ]
            }
          ]
        }
      })
    );
    var resultObj = JSON.parse(resultJson);
    if (resultObj.code == 200) {
      resultObj = resultObj.data;
      if (!(resultObj["recordList"] && resultObj["recordList"].length > 0)) {
        throw new Error(`物料${products.join()}未找到`);
      }
      let persistProducts = resultObj.recordList.map(function (v) {
        return v.id;
      });
      if (persistProducts.length !== products.length) {
        throw new Error(`物料持久化数据与入参长度不一致。persistProducts= ${persistProducts.join()} ,products= ${products.join()}`);
      }
      return resultObj.recordList;
    } else {
      throw new Error(resultObj.message);
    }
  }
  // 校验客户
  checkMerchant(org_id, merchant) {
    let url = `https://api.diwork.com/yonbip/digitalModel/merchant/queryByPage`;
    let resultJson = ublinker(
      "post",
      url,
      HEADER_STRING,
      JSON.stringify({
        data: "id,code,name,merchantAddressInfos.mergerName,merchantAddressInfos.isDefault",
        page: {
          pageIndex: 1,
          pageSize: 10
        },
        condition: {
          simpleVOs: [
            {
              logicOp: "and",
              conditions: [
                {
                  field: "id",
                  op: "eq",
                  value1: merchant
                },
                {
                  field: "merchantAppliedDetail.merchantApplyRangeId.orgId",
                  op: "eq",
                  value1: org_id
                }
              ]
            }
          ]
        }
      })
    );
    var resultObj = JSON.parse(resultJson);
    if (resultObj.code == 200) {
      resultObj = resultObj.data;
      if (!(resultObj["recordList"] && resultObj["recordList"].length > 0)) {
        throw new Error(`客户${merchant}未找到`);
      }
      return resultObj.recordList;
    } else {
      throw new Error(resultObj.message);
    }
  }
  // 判断参照字段id是否为空
  getLevelErr1(data) {
    let headerMap = {
      org_id: "组织",
      cmmssn_merchant: "代理商",
      merchant: "客户",
      operator: "业务员",
      bustype: "交易类型"
    };
    let bodyMap = {
      product: "物料",
      unit: "单位",
      num: "数量"
    };
    var errMsg = "";
    Object.keys(headerMap).map(function (key) {
      if (!data[key]) {
        errMsg += headerMap[key] + "不可为空,";
      }
    });
    let children = data["preorder_bList"];
    Object.keys(bodyMap).map(function (key) {
      if (!children[key]) {
        errMsg += bodyMap[key] + "不可为空,";
      }
    });
    return errMsg;
  }
}
class fillMaterialInfoAPI {
  fill(materialId, org_id, cmmssnMerchant, merchant, productApplyRangeId) {
    let sql1 = `select basePrice from GT7239AT6.GT7239AT6.cmmssn_mar_basprc_b where product = '${materialId}' and  cmmssn_mar_basprc_bFk.org_id = 'youridHere' and cmmssn_mar_basprc_bFk.cmmssn_merchant = '${cmmssnMerchant}' `;
    let basePrice = ObjectStore.queryByYonQL(sql1);
    let sql2 = `select price,isPriceContainsTax from GT7239AT6.GT7239AT6.salesPriceList_b where product ='${materialId}' and salesPriceList_bFk.org_id = 'youridHere' and merchant = '${merchant}' `;
    let price = ObjectStore.queryByYonQL(sql2);
    debugger;
    var productRes = {},
      taxrateInfo = {};
    let productUrl = `https://api.diwork.com/yonbip/digitalModel/product/detail?id=${materialId}&productApplyRangeId=${productApplyRangeId}`;
    var productRes = ublinker("get", productUrl, HEADER_STRING, null);
    productRes = JSON.parse(productRes);
    if (productRes && productRes.data && productRes.data.id) {
      productRes = productRes.data;
      let taxrateUrl = `https://api.diwork.com/yonbip/digitalModel/taxrate/findById?id=${productRes.detail.outTaxrate}`;
      var taxrateJson = ublinker("get", taxrateUrl, HEADER_STRING, null);
      var taxrateRes = JSON.parse(taxrateJson);
      if (taxrateRes && taxrateRes.data && taxrateRes.data.id) {
        taxrateRes = taxrateRes.data;
      }
      let unitUrl = `https://api.diwork.com/yonbip/digitalModel/unit/detail?id=${productRes.unit}`;
      var unitJson = ublinker("get", unitUrl, HEADER_STRING, null);
      var unitRes = JSON.parse(unitJson);
      if (unitRes && unitRes.data && unitRes.data.id) {
        unitRes = unitRes.data;
      }
    }
    return { basePrice: basePrice, price, taxrateRes, taxrateRes, unitRes };
  }
}
class EntCertCheckAPI {
  validate(org_id, merchant, products = [], interfaceType = 0) {
    var strResponse;
    // 友企联数据翻译调用
    var transData = {
      data: JSON.stringify({ org_id, merchant, preorder_bList: products })
    };
    if (interfaceType === 1) {
      strResponse = ublinker("post", `https://api.diwork.com/commonProductCls/commonProduct/vochange/SINE_ENT_CERT_VALID_CHECK?appKey=${ENV_KEY}`, HEADER_STRING, JSON.stringify(transData));
    } else if (interfaceType === 2) {
      strResponse = ublinker("post", `https://api.diwork.com/commonProductCls/commonProduct/vochange/SINE_ENT_CERT_SCOPE_CHECK?appKey=${ENV_KEY}`, HEADER_STRING, JSON.stringify(transData));
    } else {
      throw new Error("未知的客户证照校验类型");
    }
    var ncObj = JSON.parse(strResponse);
    if (ncObj.status !== "success") {
      throw new Error(strResponse);
    }
    let data = JSON.parse(ncObj.data);
    var ncRes;
    if (interfaceType === 1) {
      ncRes = this.SINE_ENT_CERT_VALID_CHECK(data);
    }
    if (interfaceType === 2) {
      ncRes = this.SINE_ENT_CERT_SCOPE_CHECK(data);
    }
    return { ncRes, ncParam: data, ncObj: ncObj.data };
  }
  SINE_ENT_CERT_VALID_CHECK(data) {
    var param = {
      interface: "nc.pubitf.moq.entcert.alert.IEntCertValidit2",
      method: "validCheck",
      serviceMethodArgInfo: [
        {
          argType: "java.lang.String",
          argValue: data.pk_org,
          agg: false,
          isArray: false,
          isPrimitive: false
        },
        {
          argType: "java.lang.Integer",
          argValue: 1,
          agg: false,
          isArray: false,
          isPrimitive: false
        },
        {
          argType: "java.lang.String",
          argValue: "2020-11-25 17:37:30",
          agg: false,
          isArray: false,
          isPrimitive: false
        },
        {
          argType: "java.lang.String",
          argValue: data.ccustomerid,
          agg: false,
          isArray: false,
          isPrimitive: false
        }
      ]
    };
    let ctx = JSON.parse(AppContext()).currentUser;
    let url = `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/commonapi?appKey=${ENV_KEY}`;
    let strResponse = ublinker("post", url, HEADER_STRING, JSON.stringify(param));
    return JSON.parse(strResponse);
  }
  SINE_ENT_CERT_SCOPE_CHECK(data) {
    var param = {
      interface: "nc.pubitf.moq.entcert.alert.IEntCertValidit2",
      method: "scopeCheckInterceptForSaleOrder",
      serviceMethodArgInfo: [
        {
          argType: "java.lang.String",
          argValue: JSON.stringify(data),
          agg: false,
          isArray: false,
          isPrimitive: false
        }
      ]
    };
    let ctx = JSON.parse(AppContext()).currentUser;
    let url = `https://api.diwork.com/${ctx.tenantId}/commonProductCls/commonProduct/commonapi?appKey=${ENV_KEY}`;
    let strResponse = ublinker("post", url, HEADER_STRING, JSON.stringify(param));
    return JSON.parse(strResponse);
  }
}
class RefRangeAPI {
  getMapping() {
    let { psnOrgAndDept, user } = this.getPsnBasic();
    let psnBiz = this.getPsnLocal(psnOrgAndDept.id);
    // 获取代理商档案。
    let cmmssnMerchantList = this.getCmmssnMerchantList(psnBiz.id);
    let cmmssnMerchantIDList = cmmssnMerchantList.map(function (v) {
      return v.id;
    });
    // 代理商客户品种映射
    var simpleHeaderList;
    if (psnBiz.biz_man_tag == 1) {
      simpleHeaderList = this.getCMByBiz(psnBiz.id);
    } else {
      simpleHeaderList = this.getCMByByOutPerson(cmmssnMerchantIDList);
    }
    // 通过代理商客户品种id信息获取整体映射。
    let mapping = this.getValidAgentCustomerMaterialBasic(simpleHeaderList, cmmssnMerchantList);
    let { flatMap = {}, treeMap = {} } = mapping;
    return {
      psnBiz,
      user,
      flatMap,
      flatMapDesc: "id2Vo映射包含组织、代理商、业务员、客户。不含物料",
      treeMap,
      treeMapDesc: "组织-代理商-业务员-[客户id集合与物料id集合]"
    };
  }
  getCMByBiz(psnId) {
    let yql2 = `select id 
        ,operatorId,operatorId.code,operatorId.name
        ,org_id,org_id.name,org_id.code,
        cmmssn_merchant.id,cmmssn_merchant.code,cmmssn_merchant.name 
         from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where dr=0 and operatorId = 'yourIdHere'`;
    let relationSimpleList = ObjectStore.queryByYonQL(yql2);
    return relationSimpleList;
  }
  getValidAgentCustomerMaterialBasic(relationSimpleList /*代理商客户品种表头信息集合 必填*/, cmmssnMerchantList /* 代理商档案集合，外部业务员时有值*/) {
    let flatMap = {};
    // 组织-代理商-业务员映射
    let treeMap = {};
    // 组织集合
    var org_idArray = new Set();
    // 组织与对象集合映射
    let orgObjMapping = {};
    // 组织与表头集合映射
    let orgSimpleHeadersMapping = {};
    let id2VoMapping = {};
    if (cmmssnMerchantList && cmmssnMerchantList.length > 0) {
      for (let vo of cmmssnMerchantList) {
        flatMap[vo.org_id] = {
          org_id: vo.org_id,
          org_id_code: vo.org_id_code,
          org_id_name: vo.org_id_name
        };
        flatMap[vo.id] = {
          cmmssn_merchant_id: vo.id,
          cmmssn_merchant_code: vo.code,
          cmmssn_merchant_name: vo.name
        };
        if (!treeMap[vo.org_id]) {
          treeMap[vo.org_id] = {};
        }
        treeMap[vo.org_id][vo.id] = {};
      }
    }
    if (relationSimpleList && relationSimpleList.length > 0) {
      let queryProp = {
        ids: relationSimpleList.map(function (v) {
          return v.id;
        }),
        compositions: [
          {
            name: "cmmssn_cust_mar_mList"
          }
        ]
      };
      //实体查询，代理商主子表内容，并去除封存内容。
      let originList = ObjectStore.selectBatchIds("GT7239AT6.GT7239AT6.cmmssn_cust_mar_h", queryProp);
      for (let vo of originList) {
        let mList = vo["cmmssn_cust_mar_mList"];
        let mArray = [];
        for (let mvo of mList) {
          if (mvo["bsealFlag"] == "N") {
            mArray.push(mvo["product"]);
          }
        }
      }
      for (let vo of relationSimpleList) {
        flatMap[vo.org_id] = {
          org_id: vo.org_id,
          org_id_code: vo.org_id_code,
          org_id_name: vo.org_id_name
        };
        flatMap[vo.operatorId] = {
          operatorId: vo.operatorId,
          operatorId_code: vo.operatorId_code,
          operatorId_name: vo.operatorId_name
        };
        flatMap[vo.cmmssn_merchant_id] = {
          cmmssn_merchant_id: vo.cmmssn_merchant_id,
          cmmssn_merchant_code: vo.cmmssn_merchant_code,
          cmmssn_merchant_name: vo.cmmssn_merchant_name
        };
      }
      let relationSimpleIds = relationSimpleList.map(function (v) {
        return v.id;
      });
      let yql3 = `select cmmssn_cust_mar_cFk, merchant.name,merchant.code from GT7239AT6.GT7239AT6.cmmssn_cust_mar_c 
          where cmmssn_cust_mar_cFk.id in ('${relationSimpleIds.join("','")}') and bsealFlag='N' `;
      var customers = ObjectStore.queryByYonQL(yql3);
      var customerMap = {};
      for (let cust of customers) {
        if (!customerMap[cust.cmmssn_cust_mar_cFk]) {
          customerMap[cust.cmmssn_cust_mar_cFk] = [];
        }
        customerMap[cust.cmmssn_cust_mar_cFk].push(cust);
        flatMap[cust.merchant] = {
          merchant: cust.merchant,
          merchant_code: cust.merchant_code,
          merchant_name: cust.merchant_name
        };
      }
      for (let obj of originList) {
        let orgId = obj.org_id;
        obj["cmmssn_cust_mar_cList"] = customerMap[obj.id];
        id2VoMapping[obj.id] = obj;
        org_idArray.add(orgId);
        if (!orgObjMapping[orgId]) {
          orgObjMapping[orgId] = [];
        }
        orgObjMapping[orgId].push(obj);
      }
      for (let vo of relationSimpleList) {
        if (!orgSimpleHeadersMapping[vo.org_id]) {
          orgSimpleHeadersMapping[vo.org_id] = [];
        }
        orgSimpleHeadersMapping[vo.org_id].push(vo);
        if (!treeMap[vo.org_id]) {
          treeMap[vo.org_id] = {};
        }
      }
      org_idArray.forEach(function (v) {
        let headers = orgSimpleHeadersMapping[v];
        let agent2PsnListMapping = {};
        for (let header of headers) {
          if (!agent2PsnListMapping[header.cmmssn_merchant_id]) {
            agent2PsnListMapping[header.cmmssn_merchant_id] = {};
          }
          agent2PsnListMapping[header.cmmssn_merchant_id][header.operatorId] = {
            merchants:
              id2VoMapping[header.id]["cmmssn_cust_mar_cList"].map(function (v) {
                return v.merchant + "";
              }) || [],
            products:
              id2VoMapping[header.id]["cmmssn_cust_mar_mList"].map(function (v) {
                return v.product + "";
              }) || []
          };
        }
        treeMap[v] = agent2PsnListMapping;
      });
    }
    return {
      org_idArray: Array.from(org_idArray),
      treeMap,
      flatMap
    };
  }
  getCmmssnMerchantList(psnId) {
    let yql = `select cmmssn_merchant_bFk.id as id
      ,cmmssn_merchant_bFk.code as code
      ,cmmssn_merchant_bFk.name as name
      ,cmmssn_merchant_bFk.org_id as org_id
      ,cmmssn_merchant_bFk.org_id.code as org_id_code
      ,cmmssn_merchant_bFk.org_id.name as org_id_name
            from GT7239AT6.GT7239AT6.cmmssn_merchant_b where dr=0 and operatorId = 'yourIdHere'`;
    // 代理商id，业务员id，组织id
    let result = ObjectStore.queryByYonQL(yql);
    return result;
  }
  getCMByByOutPerson(agentIds) {
    if (!agentIds || agentIds.length == 0) {
      return [];
    }
    // 查询代理商客户品种档案表头关系
    let yql2 = `select id 
        ,operatorId,operatorId.code,operatorId.name
        ,org_id,org_id.name,org_id.code,
        cmmssn_merchant.id,cmmssn_merchant.code,cmmssn_merchant.name 
         from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where cmmssn_merchant in ('${agentIds.join("', '")}')`;
    let relationSimpleList = ObjectStore.queryByYonQL(yql2);
    return relationSimpleList;
  }
  getPsnBasic() {
    let ctx = JSON.parse(AppContext()).currentUser;
    let wrapperJson = listOrgAndDeptByUserIds("diwork", ctx.tenantId, [ctx.id]);
    let wrapperObj = JSON.parse(wrapperJson);
    let psnOrgAndDept = wrapperObj.data[ctx.id];
    if (!psnOrgAndDept || !psnOrgAndDept.id) {
      throw new Error("登录用户未关联员工！");
      return;
    }
    return { psnOrgAndDept, user: ctx };
  }
  getPsnLocal(psnId) {
    let yql = `select operator.biz_man_tag as biz_man_tag 
      from GT7239AT6.GT7239AT6.operatorQueryHelper where operator='${psnId}'`;
    var res = ObjectStore.queryByYonQL(yql);
    if (res.length === 0) {
      res = ObjectStore.insert("GT7239AT6.GT7239AT6.operatorQueryHelper", { operator: psnId }, "7d53ed57");
    } else {
      res = res[0];
    }
    return {
      biz_man_tag: res.biz_man_tag,
      id: res.operator
    };
  }
  getPsnInfo(psnId) {
    let psnInfoUrl = `https://api.diwork.com/yonbip/digitalModel/staff/detail?id=${psnId}`;
    let psnInfoJson = ublinker("get", psnInfoUrl, HEADER_STRING, null);
    var psnInfoObj = JSON.parse(psnInfoJson);
    if (psnInfoObj.code == 200) {
      psnInfoObj = psnInfoObj.data;
    } else if (psnInfoObj.code == 999) {
      throw new Error(psnInfoObj.message);
    } else {
      psnInfoObj = {};
    }
    var { mainJobList = [], ptJobList = [], biz_man_tag } = psnInfoObj;
    if (mainJobList.length > 0) {
      mainJobList = mainJobList
        .filter(function (v) {
          let enddate = v["enddate"];
          if (enddate) {
            return new Date(enddate) > new Date();
          }
          return true;
        })
        .map(function (v) {
          return v.org_id;
        });
    }
    if (ptJobList.length > 0) {
      ptJobList = ptJobList
        .filter(function (v) {
          let enddate = v["enddate"];
          if (enddate) {
            return new Date(enddate) > new Date();
          }
          return true;
        })
        .map(function (v) {
          return v.org_id;
        });
    }
    return {
      mainJobList,
      ptJobList,
      biz_man_tag,
      id: psnInfoObj.id
    };
  }
}
exports({ entryPoint: MyTrigger });