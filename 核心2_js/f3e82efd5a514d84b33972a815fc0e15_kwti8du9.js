let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let dateApi = extrequire("B2Bpricing.uniti.getDataNow");
    let dateResultBeforOne = dateApi.execute(null, new Date(new Date().getTime() + 28200000)); //十分钟前的时间
    let dateResult = dateApi.execute(null, new Date(new Date().getTime() + 28800000)); //当前时间
    let startDate = dateResultBeforOne.dateView;
    let endDate = dateResult.dateView;
    var sqlTjd =
      "select * from marketing.price.PriceRecord where (priceTemplateId = 'yourIdHere' or priceTemplateId = 'yourIdHere') and enable = 1 and pubts >= '" +
      startDate +
      "' and pubts <= '" +
      endDate +
      "'";
    var resTjd = ObjectStore.queryByYonQL(sqlTjd, "marketingbill");
    for (let x = 0; x < resTjd.length; x++) {
      let type = 0;
      if (resTjd[x].priceTemplateId == "2369199784005888") {
        //客户+商品+sku:2369199784005888
        type = 1;
      } else if (resTjd[x].priceTemplateId == "2369199784005895") {
        //客户分类+商品+sku:2369199784005895
        type = 2;
      } else {
        //其他价格模板不执行以下流程
        throw new Error("========该调价单不属于需要同步的数据（暂时只支持同步：客户+商品+sku    客户分类+商品+sku）========");
      }
      //根据调价单的信息查询具体的价格表数据
      let body = {
        pageIndex: 1,
        pageSize: 100,
        priceTemplateId: resTjd[x].priceTemplateId,
        priceAdjustmentId: resTjd[x].priceAdjustmentId
      };
      let url = URLData.URL + "/iuap-api-gateway/yonbip/sd/pricing/record";
      let apiResponse = openLinker("POST", url, "B2Bpricing", JSON.stringify(body));
      apiResponse = JSON.parse(apiResponse);
      if (apiResponse.data.recordCount <= 0) {
        throw new Error(JSON.stringify(body) + "价格表接口没有返回数据" + JSON.stringify(apiResponse));
        return {};
      }
      //根据税率Id获取税率编码
      let bodyshuilv = {
        pageIndex: 0,
        pageSize: 100
      };
      let urlshuilv = URLData.URL + "/iuap-api-gateway/yonbip/tax/yonbip-fi-taxpubdoc/openapi/taxRate/findListWithPage";
      let apiResponseShuilv = openLinker("POST", urlshuilv, "B2Bpricing", JSON.stringify(bodyshuilv));
      apiResponseShuilv = JSON.parse(apiResponseShuilv);
      if (apiResponseShuilv.code != "200") {
        throw new Error("========查询税率信息出错，错误信息如下：========》" + JSON.stringify(apiResponseShuilv));
      }
      let jsonBody = "";
      for (let i = 0; i < apiResponse.data.recordList.length; i++) {
        let currentData = apiResponse.data.recordList[i];
        //商品Id
        let productIdView = currentData.dimension_productId;
        var sqlWuliao = "select * from pc.product.ProductDetail where productId = '" + productIdView + "'";
        var resWuliao = ObjectStore.queryByYonQL(sqlWuliao, "productcenter");
        if (resWuliao.length < 1) {
          throw new Error("========根据物料Id查询物料档案出错，查询的sql如下：========》" + sqlWuliao);
        }
        //根据税率Id获取税率编码
        let shuilvCode = "";
        let shuilv = "";
        for (let a = 0; a < apiResponseShuilv.data.recordList.length; a++) {
          if (apiResponseShuilv.data.recordList[a].id == resWuliao[0].outTaxrate) {
            shuilvCode = apiResponseShuilv.data.recordList[a].code;
            shuilv = apiResponseShuilv.data.recordList[a].ntaxrate;
          }
        }
        let shuilvBaifenbi = new Big(shuilv);
        shuilv = new Big(shuilv).div(new Big(100)).plus(1);
        let wushui = MoneyFormatReturnBd(new Big(currentData.recordGradients_price).div(new Big(shuilv)), 2);
        //根据适用组织id查询对应的编码
        var sqlSyzz = "select code from org.func.BaseOrg where id = '" + currentData.orgScopeId + "'";
        var resSyzz = ObjectStore.queryByYonQL(sqlSyzz, "ucf-org-center");
        if (resSyzz.length < 1) {
          throw new Error("========根据适用组织Id查询编码出错，查询的sql如下：========》" + sqlSyzz);
        }
        let jsonBodyItem;
        if (type == 1) {
          jsonBodyItem = {
            itemPricId: currentData.id, //YS价格表的唯一键，用来修改删除的
            dealerCategoryId: "", //客户分类ID
            itemId: currentData.dimension_productId, //商品Id
            itemCode: currentData.productId_code, //商品编码
            skuId: currentData.dimension_skuId, //货品Id
            skuCode: currentData.skuId_code, //货品编码
            barCode: "", //货品条码
            startDate: currentData.beginDate, //生效起始日期
            endDate: currentData.endDate, //生效截止日期
            status: "1", //状态
            ownerCode: resSyzz[0].code, //货主编码
            costPrice: "", //成本价
            salePrice: currentData.recordGradients_price, //销售价(单位分)
            insuredPrice: "", //保价金额
            wholesalePrice: "", //经销价(单位分)
            deliveryPrice: "", //配送价(单位分)
            unitNonTaxPrice: MoneyFormatReturnBd(GetBigDecimal(new Big(currentData.recordGradients_price).div(new Big(shuilv)) + ""), 2), //单位未税价
            unitTaxPrice: "", //吊牌价
            remarks: currentData.adjustDetails_remark, //备注
            extendProps: {
              type: type, //1:客户+商品+sku  2:客户分类+商品+sku
              customerId: currentData.dimension_agentId, //客户ID
              customerCode: currentData.agentId_code, //客户编码
              dealerCategoryType: "", //客户分类编码
              priceUnitId: currentData.priceUnit, //币种Id
              priceUnitName: currentData.priceUnit_name, //币种名称
              amountUnitName: currentData.amountUnit_name, //计量单位
              shuilvCode: shuilvCode, //税目税率编码
              taxRate: shuilvBaifenbi
            }
          };
        } else {
          let bodyKhfl = {};
          let urlKhfl = URLData.URL + "/iuap-api-gateway/yonbip/digitalModel/custcategory/newdetailbyid?id=" + currentData.dimension_agentClassId;
          let apiResponseKhfl = openLinker("GET", urlKhfl, "B2Bpricing", JSON.stringify(bodyKhfl));
          apiResponseKhfl = JSON.parse(apiResponseKhfl);
          jsonBodyItem = {
            itemPricId: currentData.id, //YS价格表的唯一键，用来修改删除的
            dealerCategoryId: currentData.dimension_agentClassId, //客户分类ID
            itemId: currentData.dimension_productId, //商品Id
            itemCode: currentData.productId_code, //商品编码
            skuId: currentData.dimension_skuId, //货品Id
            skuCode: currentData.skuId_code, //货品编码
            barCode: "", //货品条码
            startDate: currentData.beginDate, //生效起始日期
            endDate: currentData.endDate, //生效截止日期
            status: "1", //状态
            ownerCode: resSyzz[0].code, //货主编码
            costPrice: "", //成本价
            salePrice: currentData.recordGradients_price, //销售价(单位分)
            insuredPrice: "", //保价金额
            wholesalePrice: "", //经销价(单位分)
            deliveryPrice: "", //配送价(单位分)
            unitNonTaxPrice: MoneyFormatReturnBd(GetBigDecimal(new Big(currentData.recordGradients_price).div(new Big(shuilv)) + ""), 2), //单位未税价
            unitTaxPrice: "", //吊牌价
            remarks: currentData.adjustDetails_remark, //备注
            extendProps: {
              type: type, //1:客户+商品+sku  2:客户分类+商品+sku
              customerId: "", //客户ID
              customerCode: "", //客户编码
              priceUnitId: currentData.priceUnit, //币种Id
              priceUnitName: currentData.priceUnit_name, //币种名称
              dealerCategoryType: apiResponseKhfl.data.code, //客户分类编码
              amountUnitName: currentData.amountUnit_name, //计量单位
              shuilvCode: shuilvCode, //税目税率编码
              taxRate: shuilvBaifenbi
            }
          };
        }
        jsonBody = jsonBody + JSON.stringify(jsonBodyItem) + ",";
      }
      apiResponse = JSON.parse("[" + substring(jsonBody, 0, jsonBody.length - 1) + "]");
      let bodyOms = {
        appCode: "beiwei-base-data", //应用编码
        appApiCode: "standard.price.sync", //接口编码
        schemeCode: "beiwei_bd", //方案编码
        jsonBody: {
          jsonBody: apiResponse
        }
      };
      let headerOms = { "Content-Type": "application/json;charset=UTF-8" };
      let strResponse = postman("POST", "https://www.example.com/", JSON.stringify(headerOms), JSON.stringify(bodyOms));
      strResponse = JSON.parse(strResponse);
      if (strResponse.success == "false") {
        throw new Error("========价格表同步OMS报错========");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });