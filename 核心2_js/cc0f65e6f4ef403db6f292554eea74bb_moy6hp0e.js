let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: 200,
      message: "",
      data: null
    };
    let apiinfo = {
      url: "/moy6hp0e/11/111/voucherorder/save",
      action: "销售订单单个保存",
      body: "",
      responsedata: ""
    };
    let sql1 = "";
    try {
      let func = extrequire("AT15DCCE0808080001.backOpenApiFunction.getGateway");
      let getGatewayInfo = func.execute();
      let baseurl = getGatewayInfo.data.gatewayUrl;
      let url = baseurl + "/yonbip/sd/voucherorder/singleSave";
      let body = {
        data: {}
      };
      body.data.id = "";
      body.data._status = "Insert";
      body.data.agentId = request.agentId; //客户编码
      body.data.code = request.code;
      body.data.hopeReceiveDate = request.hopeReceiveDate; //希望到货日期
      body.data.invoiceAgentId = request.agentId;
      body.data.orderDetails = [];
      body.data.resubmitCheckKey = request.resubmitCheckKey;
      body.data.salesOrgId = "CSSG";
      body.data.settlementOrgId = "CSSG";
      body.data.transactionTypeId = "yourIdHere";
      body.data.vouchdate = request.vouchdate;
      body.data.orderDate = request.vouchdate;
      body.data.exchRateDate = request.vouchdate; //汇率日期
      sql1 = "select b.professSalesman professSalesman from aa.merchant.Merchant inner join aa.merchant.Principal b on b.merchantId=id where code='" + request.agentId + "'";
      let professSalesman = ObjectStore.queryByYonQL(sql1, "productcenter");
      if (professSalesman.length > 0) {
        body.data.corpContact = professSalesman[0].professSalesman; //业务员
      }
      //客户档案业务对象查询 customerLevel客户级别(价格目录)
      sql1 =
        "select dtl.taxRate taxRate,dtl.collectionAgreement collectionAgreement,dtl.deliveryWarehouse deliveryWarehouse,orgId,dtl.customerLevel customerLevel from aa.merchant.MerchantApplyRange  inner join aa.merchant.MerchantApplyRangeDetail dtl on id=dtl.merchantApplyRangeId inner join aa.merchant.Merchant main on main.id=merchantId where 1=1 and orgId=1665003471855681550 and main.code='" +
        request.agentId +
        "'";
      let MerchantApplyRangeDetail = ObjectStore.queryByYonQL(sql1, "productcenter");
      if (MerchantApplyRangeDetail.length > 0) {
        body.data.receiveAgreementId = MerchantApplyRangeDetail[0].collectionAgreement || ""; //收付款协议
      }
      //收货地址
      sql1 =
        "select b.id,b.addressCode,b.address,b.receiver receiver from aa.merchant.Merchant inner join aa.merchant.AddressInfo b on b.merchantId=id where code='" +
        request.agentId +
        "' and b.addressCode='" +
        request.define2 +
        "'";
      let receiveInfo = ObjectStore.queryByYonQL(sql1, "productcenter");
      if (receiveInfo.length > 0) {
        body.data.receiveAddress = receiveInfo[0].b_address; //收货地址
        body.data.receiveId = receiveInfo[0].b_id; //收货人id
        body.data.receiver = receiveInfo[0].receiver; //收货人
      }
      body.data.headFreeItem = {};
      body.data.headFreeItem.id = "";
      body.data.headFreeItem.define1 = "1821742341882380294"; //销售价格条款
      //发票地址
      sql1 =
        "select b.id,b.addressCode,b.address from aa.merchant.Merchant inner join aa.merchant.AddressInfo b on b.merchantId=id where code='" +
        request.agentId +
        "' and b.addressCode='" +
        request.define3 +
        "'";
      let define5Info = ObjectStore.queryByYonQL(sql1, "productcenter");
      if (define5Info.length > 0) {
        body.data.headFreeItem.define18 = define5Info[0].b_id; //  ship to
        body.data.headFreeItem.define7 = define5Info[0].b_address; //  ship to
      }
      body.data.headFreeItem.define8 = "EDI"; //系统来源
      body.data.headFreeItem.define10 = request.define1; //供应商GLN编号
      body.data.headFreeItem.define11 = request.define2; //采购方GLN编号
      body.data.headFreeItem.define12 = request.define3; //交付方GLN编号
      body.data.headFreeItem.define13 = request.code; //Edi单号
      body.data.headFreeItem.define14 = request.define4; //发票GLN
      //表体津贴
      sql1 = "select id,b.id,b.define1 define1,b.define2 define2,b.define3 define3 from aa.merchant.Merchant inner join aa.merchant.MerchantDefine b on b.id=id where code='" + request.agentId + "'";
      let dtMerchantDefine = ObjectStore.queryByYonQL(sql1, "productcenter");
      if (dtMerchantDefine.length > 0) {
        body.data.headFreeItem.define15 = dtMerchantDefine[0].define1 || ""; //物料行津贴
        body.data.headFreeItem.define16 = dtMerchantDefine[0].define2 || ""; //津贴
        body.data.headFreeItem.define17 = dtMerchantDefine[0].define3 || ""; //现金折扣
      }
      let MoneyAll = 0.0; //整单报价金额
      let MoneyAll01 = 0.0; //整单金额
      let discountMoney = 0.0; //折扣总金额
      body.data.headItem = {};
      body.data.headItem.orderId = "";
      body.data.headItem.define1 = "1544878777088081928"; //销售渠道
      body.data.payMoney = 0;
      body.data["orderPrices!currency"] = "EUR"; //币种
      body.data["orderPrices!exchRate"] = 1;
      body.data["orderPrices!exchangeRateType"] = "04";
      body.data["orderPrices!natCurrency"] = "EUR"; //本币
      body.data["orderPrices!taxInclusive"] = true;
      //计算扣率
      let wholeDiscountRate = 100.0;
      let jt01 = body.data.headFreeItem.define15 ? body.data.headFreeItem.define15 * 0.01 : 0; //物料行津贴
      let jt02 = body.data.headFreeItem.define16 ? body.data.headFreeItem.define16 * 0.01 : 0; //津贴
      let jt03 = body.data.headFreeItem.define17 ? body.data.headFreeItem.define17 * 0.01 : 0; //现金折扣
      wholeDiscountRate = Number(((1 - jt01) * (1 - jt02) * (1 - jt03) * 100.0).toFixed(4));
      body.data["orderPrices!wholeDiscountRate"] = wholeDiscountRate; //整单扣率
      let orderDetails = request.orderDetails;
      for (var i = 0; i < orderDetails.length; i++) {
        let Detail = {};
        Detail.id = "";
        Detail._status = "Insert";
        Detail.consignTime = request.vouchdate;
        Detail.priceQty = orderDetails[i].priceQty;
        Detail.qty = orderDetails[i].qty;
        Detail.subQty = orderDetails[i].subQty;
        Detail.invExchRate = 1;
        Detail.invPriceExchRate = 1;
        Detail["orderDetailPrices!natMoney"] = 0;
        Detail["orderDetailPrices!natSum"] = 0;
        Detail["orderDetailPrices!natTax"] = 0;
        Detail["orderDetailPrices!natTaxUnitPrice"] = 0;
        Detail["orderDetailPrices!natUnitPrice"] = 0;
        Detail["orderDetailPrices!oriMoney"] = 0;
        Detail["orderDetailPrices!oriTax"] = 0;
        Detail["orderDetailPrices!oriUnitPrice"] = 0;
        Detail.oriSum = 0;
        Detail.oriTaxUnitPrice = 0;
        Detail.unitExchangeType = 0;
        Detail.unitExchangeTypePrice = 0;
        Detail.oriSum = 0;
        Detail.oriTaxUnitPrice = 0;
        Detail.orderProductType = "SALE";
        Detail.settlementOrgId = "CSSG";
        Detail.stockOrgId = "CSSG";
        Detail.productId = "";
        Detail.realProductCode = "";
        Detail.taxId = "A7"; //科目税率
        if (MerchantApplyRangeDetail.length > 0) {
          Detail.taxId = MerchantApplyRangeDetail[0].taxRate || "A7"; //科目税率
        }
        if (MerchantApplyRangeDetail.length > 0) {
          Detail.stockId = MerchantApplyRangeDetail[0].deliveryWarehouse || ""; //发货仓库
        }
        Detail.iProductAuxUnitId = "";
        Detail.iProductUnitId = "";
        Detail.masterUnitId = "";
        Detail.bodyFreeItem = {};
        Detail.bodyFreeItem.define10 = orderDetails[i].define10; //GTIN物料编码号
        Detail.bodyFreeItem.define11 = orderDetails[i].define11; //买方物料号
        Detail.bodyFreeItem.define20 = orderDetails[i].define20; //德厨产品编码
        Detail.bodyFreeItem.define21 = orderDetails[i].productId + " " + orderDetails[i].define20; //添加条码+客户产品编码
        //查询物料
        let sql = "select id,unit,code,b.barCode from pc.product.Product inner join pc.product.ProductDetail b on b.productId=id where b.barCode='" + orderDetails[i].productId + "'";
        var productdata = ObjectStore.queryByYonQL(sql, "productcenter");
        let productId = "";
        if (productdata.length > 0) {
          let unit = productdata[0].unit;
          Detail.iProductAuxUnitId = unit;
          Detail.iProductUnitId = unit;
          Detail.masterUnitId = unit;
          Detail.productId = productdata[0].code;
          Detail.realProductCode = productdata[0].code;
          body.data.orderDetails.push(Detail);
          productId = productdata[0].id; //物料id
        } else {
          //匹配物料属性产品条形码  外箱条码字段
          let sql05 = "";
          let unit = "";
          let code = "";
          let product_Id = "";
          sql05 =
            "select  define23,productId,b.unit unit,b.code code from  pc.product.ProductDefine  productcenter inner join pc.product.Product  b on b.id=productId where define23=" +
            orderDetails[i].productId;
          let cptm = ObjectStore.queryByYonQL(sql05, "productcenter");
          if (cptm.length > 0) {
            unit = cptm[0].unit;
            code = cptm[0].code;
            product_Id = cptm[0].productId;
          } else {
            //匹配外箱条码
            sql05 =
              "select  define25,productId,b.unit unit,b.code code from  pc.product.ProductDefine  productcenter inner join pc.product.Product  b on b.id=productId where define25=" +
              orderDetails[i].productId;
            let wxtm = ObjectStore.queryByYonQL(sql05, "productcenter");
            if (wxtm.length > 0) {
              unit = wxtm[0].unit;
              code = wxtm[0].code;
              product_Id = wxtm[0].productId;
            } else {
              rsp.message += "条码【" + orderDetails[i].productId + "】未找到对应的物料/n";
            }
          }
          Detail.iProductAuxUnitId = unit;
          Detail.iProductUnitId = unit;
          Detail.masterUnitId = unit;
          Detail.productId = code;
          Detail.realProductCode = code;
          body.data.orderDetails.push(Detail);
          productId = product_Id; //物料id
        }
        let customerLevel = ""; //客户级别(价格表)
        if (MerchantApplyRangeDetail.length > 0) {
          customerLevel = MerchantApplyRangeDetail[0].customerLevel || ""; //客户级别(价格表)
        }
        if (customerLevel) {
          //存在就计算
          let oriUnitPrice = this.getOriTaxUnitPrice(customerLevel, productId); //含税单价没有打折  --无税单价
          let taxRate = 0; //税率  = "A7";
          if (Detail.taxId != "A7") {
            sql = "select ntaxrate from archive.taxArchives.TaxRateArchive where id=" + Detail.taxId; //获取税率
            let ntaxratedt = ObjectStore.queryByYonQL(sql, "yonbip-fi-taxpubdoc");
            if (ntaxratedt.length > 0) {
              taxRate = ntaxratedt[0].ntaxrate;
            }
          }
          if (oriUnitPrice > 0) {
            //含税价格大于0计算
            let Amountinfo = this.getAmount(Detail.qty, taxRate, body.data["orderPrices!exchRate"], oriUnitPrice); //没有折扣后的价格
            //判断是否维护了津贴折扣
            //报价
            Detail["cusDiscountMoney"] = 0.0; //报价扣额
            Detail["cusDiscountRate"] = 100.0; //报价扣率%
            Detail["orderDetailPrices!discountRate"] = wholeDiscountRate; //扣率 计算
            Detail["orderDetailPrices!saleCost_domestic_taxfree"] = Amountinfo.natMoney; //报价本币无税金额
            Detail["orderDetailPrices!saleCost_domestic"] = Amountinfo.natSum; //报价本币含税金额
            Detail["noTaxSalePrice"] = Amountinfo.oriUnitPrice; //无税报价
            Detail["salePrice"] = Amountinfo.oriTaxUnitPrice; //含税报价
            Detail["prodPrice"] = Amountinfo.oriTaxUnitPrice; //基础报价  等于报价
            Detail["orderDetailPrices!salePrice_domestic"] = Amountinfo.natTaxUnitPrice; //报价本币含税单价
            Detail["prodCost"] = Amountinfo.oriSum; //基础报价金额
            Detail["orderDetailPrices!salePrice_domestic_taxfree"] = Amountinfo.natUnitPrice; //报价本币无税单价
            Detail["noTaxSaleCost"] = Amountinfo.oriMoney; //报价无税金额
            Detail["saleCost"] = Amountinfo.oriSum; //报价含税金额
            MoneyAll += Number(Amountinfo.oriSum);
            let discountoriTaxUnitPrice = oriUnitPrice;
            if (wholeDiscountRate != 100.0) {
              discountoriTaxUnitPrice = Number((discountoriTaxUnitPrice * (wholeDiscountRate / 100)).toFixed(4));
              let lineDiscountMoney = 0.0;
              lineDiscountMoney = Number(((Detail["saleCost"] * (100 - wholeDiscountRate)) / 100).toFixed(4));
              Detail["orderDetailPrices!lineDiscountMoney"] = lineDiscountMoney; //行折扣金额
              discountMoney += lineDiscountMoney;
            }
            let discountAmountinfo = this.getAmount(Detail.qty, taxRate, body.data["orderPrices!exchRate"], discountoriTaxUnitPrice); //折扣后价格
            Detail["orderDetailPrices!natMoney"] = discountAmountinfo.natMoney; //本币无税金额
            Detail["orderDetailPrices!natSum"] = discountAmountinfo.natSum; //本币含税金额
            Detail["orderDetailPrices!natTax"] = discountAmountinfo.natTax; //本币税额
            Detail["orderDetailPrices!natUnitPrice"] = discountAmountinfo.natUnitPrice; //本币无税单价
            Detail["orderDetailPrices!oriMoney"] = discountAmountinfo.oriMoney; //无税金额
            Detail["orderDetailPrices!oriTax"] = discountAmountinfo.oriTax; //税额
            Detail["orderDetailPrices!oriUnitPrice"] = discountAmountinfo.oriUnitPrice; //无税成交价
            Detail.oriSum = discountAmountinfo.oriSum; //含税金额
            Detail.oriTaxUnitPrice = discountAmountinfo.oriTaxUnitPrice; //含税成交价
            Detail["orderDetailPrices!natTaxUnitPrice"] = discountAmountinfo.natTaxUnitPrice; //本币含税单价
            MoneyAll01 += Number(Detail.oriSum);
          }
        }
      }
      console.log("报价金额MoneyAlld------" + MoneyAll);
      console.log("discountMoney------" + discountMoney);
      body.data["orderPrices!discountAfterMoney"] = Number(MoneyAll01.toFixed(4)); //整单折后金额  ==总额
      body.data["orderPrices!discountMoney"] = Number((MoneyAll - MoneyAll01).toFixed(4)); //折扣总金额
      let allwholeDiscountRate = 100.0;
      if (discountMoney > 0) {
        allwholeDiscountRate = Number(((Number(MoneyAll01.toFixed(4)) / MoneyAll) * 100.0).toFixed(4));
      }
      body.data["orderPrices!wholeDiscountRate"] = allwholeDiscountRate; //整单扣率
      console.log("调用销售订单请求接口请求数据" + JSON.stringify(body));
      apiinfo.body = JSON.stringify(request);
      if (rsp.message == "") {
        let apiResponse = openLinker("POST", url, "AT15DCCE0808080001", JSON.stringify(body));
        let repdata = JSON.parse(apiResponse);
        if (repdata.code == "200") {
          rsp.message = "操作成功";
          rsp.data = repdata.data;
        } else {
          throw new Error(repdata.message);
        }
      } else {
        throw new Error(rsp.message);
      }
    } catch (e) {
      rsp.message = e.message;
      rsp.code = 999;
    } finally {
      apiinfo.responsedata = JSON.stringify(rsp);
      let apiSave = extrequire("AT15DCCE0808080001.backOpenApiFunction.apiSave");
      apiSave.execute(apiinfo);
      return rsp;
    }
  }
  getAmount(qty, taxRate, exchRate, price, isTax) {
    let res = {};
    if (isTax) {
      let oriTaxUnitPrice = price;
      let oriUnitPrice = (oriTaxUnitPrice / (1 + taxRate / 100)).toFixed(4); //无税单价
      let oriSum = (oriTaxUnitPrice * qty).toFixed(4); //含税金额
      let oriMoney = (oriSum / (1 + taxRate / 100)).toFixed(4); //无税金额
      let oriTax = (oriSum - oriMoney).toFixed(4); //税额
      //本币
      let natTaxUnitPrice = (oriTaxUnitPrice * exchRate).toFixed(4); //含税单价
      let natUnitPrice = (natTaxUnitPrice / (1 + taxRate / 100)).toFixed(4); //无税单价
      let natSum = (natTaxUnitPrice * qty).toFixed(4); //含税金额
      let natMoney = (natSum / (1 + taxRate / 100)).toFixed(4); //无税金额
      let natTax = (natSum - natMoney).toFixed(4); //税额
      res = { oriTaxUnitPrice, oriUnitPrice, oriSum, oriMoney, oriTax, natTaxUnitPrice, natUnitPrice, natSum, natMoney, natTax };
    } else {
      let oriUnitPrice = price; //无税单价
      let oriTaxUnitPrice = (oriUnitPrice * (1 + taxRate / 100)).toFixed(4); //含税单价
      let oriMoney = (oriUnitPrice * qty).toFixed(4); //无税金额
      let oriSum = (oriMoney * (1 + taxRate / 100)).toFixed(4); //含税金额
      let oriTax = (oriSum - oriMoney).toFixed(4); //税额
      //本币
      let natUnitPrice = (oriUnitPrice * exchRate).toFixed(4); //无税单价
      let natTaxUnitPrice = (natUnitPrice * (1 + taxRate / 100)).toFixed(4); //含税单价
      let natMoney = (natUnitPrice * qty).toFixed(4); //无税金额
      let natSum = (natMoney * (1 + taxRate / 100)).toFixed(4); //含税金额
      let natTax = (natSum - natMoney).toFixed(4); //税额
      res = { oriTaxUnitPrice, oriUnitPrice, oriSum, oriMoney, oriTax, natTaxUnitPrice, natUnitPrice, natSum, natMoney, natTax };
    }
    return res;
  }
  getOriTaxUnitPrice(agentLevelId, productId) {
    let sql =
      "select code,status,c.name,beginDate,endDate,b.price,b.priceUnit,b.amountUnit,d.exchangeRateType,d.outputRate from marketing.price.PriceAdjustment inner join marketing.price.PriceAdjustDetail b on b.priceAdjustmentId=id inner join marketing.price.PriceTemplate c on c.id=priceTemplateId inner join marketing.price.PriceAdjustDetailDimension d on b.id=d.priceAdjustDetailId where c.name='客户级别+商品'  and status=1 and d.agentLevelId='" +
      agentLevelId +
      "'  and d.productId=" +
      productId +
      "  order by beginDate desc";
    let dt = ObjectStore.queryByYonQL(sql, "marketingbill");
    let oriTaxUnitPrice = 0; //含税单价
    if (dt.length > 0) {
      oriTaxUnitPrice = dt[0].b_price;
    }
    return oriTaxUnitPrice;
  }
}
exports({ entryPoint: MyAPIHandler });