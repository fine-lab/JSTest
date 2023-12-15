let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let zhuIdList = "";
    let ziIDList = "";
    if (!param.isBiaotou) {
      for (var x = 0; x < param.selectData.length; x++) {
        if (!includes(zhuIdList, param.selectData[x].id)) {
          zhuIdList = zhuIdList + param.selectData[x].id + ",";
        }
        ziIDList = ziIDList + param.selectData[x].details_id + ",";
      }
    } else {
      for (var x = 0; x < param.selectData.length; x++) {
        if (!includes(zhuIdList, param.selectData[x].id)) {
          zhuIdList = zhuIdList + param.selectData[x].id + ",";
        }
      }
    }
    var limit = 1000;
    var idZhuList = split(substring(zhuIdList, 0, zhuIdList.length - 1), ",", limit); // ["today", "is", "Tuesday"]
    idZhuList = JSON.parse(idZhuList);
    let errorInfoMessage = "";
    for (var aa = 0; aa < idZhuList.length; aa++) {
      let bodyXiangqing = {};
      let urlXiangqing = "https://www.example.com/" + idZhuList[aa];
      let apiResponseXiangqing = openLinker("GET", urlXiangqing, "AT18526ADE08800003", JSON.stringify(bodyXiangqing));
      apiResponseXiangqing = JSON.parse(apiResponseXiangqing);
      if (apiResponseXiangqing.code != "200") {
        throw new Error(JSON.stringify(bodyXiangqing) + "------查询销售出库详情异常，异常如下：------" + JSON.stringify(apiResponseXiangqing));
      }
      if (apiResponseXiangqing.data.status != "0") {
        errorInfoMessage = errorInfoMessage + apiResponseXiangqing.data.code + ",";
        continue;
      }
      let details = ""; //-------------------------------------------------------------------
      if (param.isBiaotou) {
        //表头
        for (var b = 0; b < apiResponseXiangqing.data.details.length; b++) {
          let xsdj = 0;
          if (apiResponseXiangqing.data.details[b].salesOutsDefineCharacter.attrext21 != undefined && apiResponseXiangqing.data.details[b].salesOutsDefineCharacter.attrext21 != null) {
            xsdj = apiResponseXiangqing.data.details[b].salesOutsDefineCharacter.attrext21 * 1 * (1 + (param.value * 1) / 100);
          }
          let bfbshuilv = apiResponseXiangqing.data.details[b].taxRate / 100;
          let hanshuiDanAmount = Math.round(xsdj * 1000000) / 1000000; //含税单价
          let hanshuiAmount = (apiResponseXiangqing.data.details[b].qty * Math.round(xsdj * 1000000)) / 1000000; //含税金额=数量*含税单价
          let shuiAmount = (hanshuiAmount / (1 * 1 + bfbshuilv * 1)) * bfbshuilv; //税额=含税金额÷（1＋税率）×税率
          let wushuiAmount = hanshuiAmount * 1 - shuiAmount * 1; //无税金额＝含税金额－税额
          let wushuiDanjiaAmount = wushuiAmount / apiResponseXiangqing.data.details[b].qty; //无税单价=无税金额/数量
          let detail = {
            id: apiResponseXiangqing.data.details[b].id,
            _status: "Update", //是	操作标识, Insert:新增、Update:更新    示例：Insert
            source: apiResponseXiangqing.data.details[b].source, //是	来源单据类型, 0:无来源、st_purinrecord:采购入库单、1:发货单、2:销售订单、3:退货单、tradeorder:电商订单、refundorder:电商退换货订单、retailvouch:零售单、mallvouch:商城发货单、    示例：0
            taxRate: apiResponseXiangqing.data.details[b].taxRate, //是	税率    示例：1
            product: apiResponseXiangqing.data.details[b].product, //是	物料id或编码    示例：121000089
            productsku: apiResponseXiangqing.data.details[b].productsku, //否	商品SKUid或编码（未启用特征必填）    示例：121000089
            invExchRate: apiResponseXiangqing.data.details[b].invExchRate, //是	换算率    示例：1
            qty: apiResponseXiangqing.data.details[b].qty, //是	数量    示例：12
            stockUnit: apiResponseXiangqing.data.details[b].stockUnitId, //是	库存单位id或编码    示例：fgl_004
            priceUOM: apiResponseXiangqing.data.details[b].priceUOM, //是	计价单位id或编码    示例：fgl_004
            invPriceExchRate: apiResponseXiangqing.data.details[b].invPriceExchRate, //是	计价换算率    示例：1
            taxUnitPriceTag: apiResponseXiangqing.data.details[b].taxUnitPriceTag, //是	价格含税, true:是、false:否、    示例：true
            unitExchangeType: apiResponseXiangqing.data.details[b].unitExchangeType, //是	库存单位转换率的换算方式 0：固定 1：浮动 示例：0
            sourceid: apiResponseXiangqing.data.details[b].sourceid, //否	来源单据主表id，如果有来源则必输
            sourceautoid: apiResponseXiangqing.data.details[b].sourceautoid, //否	来源单据行id，有来源必输
            upcode: apiResponseXiangqing.data.details[b].upcode, //否	来源单据编号，有来源时必输
            makeRuleCode: apiResponseXiangqing.data.details[b].makeRuleCode, //否	单据转换规则，有来源时必输，deliveryTostoreout：发货单生销售出库，salereturnTosalesout：退货单生销售出库，orderTosalesout：销售订单生销售出库
            batchno: apiResponseXiangqing.data.details[b].batchno, //否	批次号,仓库商品均开启批次管理则必填
            producedate: apiResponseXiangqing.data.details[b].producedate, //否	生产日期，效期物料可在生产日期或失效日期中选择一个传入
            invaliddate: apiResponseXiangqing.data.details[b].invaliddate, //否	失效日期，效期物料可在生产日期或失效日期中选择一个传入
            taxId: apiResponseXiangqing.data.details[b].taxId, //是	税目id或编码    示例：8b99f589-bc47-4c3a-bfqw-13d78cad20b0
            goodsposition: apiResponseXiangqing.data.details[b].goodsposition, //否	货位，仓库开启货位则必填    示例：whhw2467516
            collaborationPodetailid: apiResponseXiangqing.data.details[b].collaborationPodetailid, //	否	协同来源单据子表id
            collaborationPoid: apiResponseXiangqing.data.details[b].collaborationPoid, //	否	协同来源单据id
            oriMoney: Math.round(wushuiAmount * 100) / 100, //是	无税金额
            oriUnitPrice: Math.round(wushuiDanjiaAmount * 1000000) / 1000000, //是	无税单价
            oriTax: Math.round(shuiAmount * 100) / 100, //是	税额
            oriSum: Math.round(hanshuiAmount * 100) / 100, //是	含税金额    示例：24
            oriTaxUnitPrice: Math.round(hanshuiDanAmount * 1000000) / 1000000, //含税单价
            salesOutsDefineCharacter: {
              id: apiResponseXiangqing.data.details[b].id,
              attrext1: param.value,
              _status: "Update"
            }
          };
          details = details + JSON.stringify(detail) + ",";
        }
      } else if (!param.isBiaotou) {
        //表头+表体
        for (var b = 0; b < apiResponseXiangqing.data.details.length; b++) {
          if (includes(ziIDList, apiResponseXiangqing.data.details[b].id)) {
            let xsdj = 0;
            if (apiResponseXiangqing.data.details[b].salesOutsDefineCharacter.attrext21 != undefined && apiResponseXiangqing.data.details[b].salesOutsDefineCharacter.attrext21 != null) {
              xsdj = apiResponseXiangqing.data.details[b].salesOutsDefineCharacter.attrext21 * 1 * (1 + (param.value * 1) / 100);
            }
            let bfbshuilv = apiResponseXiangqing.data.details[b].taxRate / 100;
            let hanshuiDanAmount = Math.round(xsdj * 1000000) / 1000000; //含税单价
            let hanshuiAmount = (apiResponseXiangqing.data.details[b].qty * Math.round(xsdj * 1000000)) / 1000000; //含税金额=数量*含税单价
            let shuiAmount = (hanshuiAmount / (1 * 1 + bfbshuilv * 1)) * bfbshuilv; //税额=含税金额÷（1＋税率）×税率
            let wushuiAmount = hanshuiAmount * 1 - shuiAmount * 1; //销售金额（不含税）＝含税金额－税额
            let wushuiDanjiaAmount = wushuiAmount / apiResponseXiangqing.data.details[b].qty; //无税单价=无税金额/数量
            let detail = {
              id: apiResponseXiangqing.data.details[b].id,
              _status: "Update", //是	操作标识, Insert:新增、Update:更新    示例：Insert
              source: apiResponseXiangqing.data.details[b].source, //是	来源单据类型, 0:无来源、st_purinrecord:采购入库单、1:发货单、2:销售订单、3:退货单、tradeorder:电商订单、refundorder:电商退换货订单、retailvouch:零售单、mallvouch:商城发货单、    示例：0
              taxRate: apiResponseXiangqing.data.details[b].taxRate, //是	税率    示例：1
              product: apiResponseXiangqing.data.details[b].product, //是	物料id或编码    示例：121000089
              productsku: apiResponseXiangqing.data.details[b].productsku, //否	商品SKUid或编码（未启用特征必填）    示例：121000089
              invExchRate: apiResponseXiangqing.data.details[b].invExchRate, //是	换算率    示例：1
              qty: apiResponseXiangqing.data.details[b].qty, //是	数量    示例：12
              stockUnit: apiResponseXiangqing.data.details[b].stockUnitId, //是	库存单位id或编码    示例：fgl_004
              priceUOM: apiResponseXiangqing.data.details[b].priceUOM, //是	计价单位id或编码    示例：fgl_004
              invPriceExchRate: apiResponseXiangqing.data.details[b].invPriceExchRate, //是	计价换算率    示例：1
              taxUnitPriceTag: apiResponseXiangqing.data.details[b].taxUnitPriceTag, //是	价格含税, true:是、false:否、    示例：true
              unitExchangeType: apiResponseXiangqing.data.details[b].unitExchangeType, //是	库存单位转换率的换算方式 0：固定 1：浮动 示例：0
              sourceid: apiResponseXiangqing.data.details[b].sourceid, //否	来源单据主表id，如果有来源则必输
              sourceautoid: apiResponseXiangqing.data.details[b].sourceautoid, //否	来源单据行id，有来源必输
              upcode: apiResponseXiangqing.data.details[b].upcode, //否	来源单据编号，有来源时必输
              makeRuleCode: apiResponseXiangqing.data.details[b].makeRuleCode, //否	单据转换规则，有来源时必输，deliveryTostoreout：发货单生销售出库，salereturnTosalesout：退货单生销售出库，orderTosalesout：销售订单生销售出库
              batchno: apiResponseXiangqing.data.details[b].batchno, //否	批次号,仓库商品均开启批次管理则必填
              producedate: apiResponseXiangqing.data.details[b].producedate, //否	生产日期，效期物料可在生产日期或失效日期中选择一个传入
              invaliddate: apiResponseXiangqing.data.details[b].invaliddate, //否	失效日期，效期物料可在生产日期或失效日期中选择一个传入
              taxId: apiResponseXiangqing.data.details[b].taxId, //是	税目id或编码    示例：8b99f589-bc47-4c3a-bfqw-13d78cad20b0
              goodsposition: apiResponseXiangqing.data.details[b].goodsposition, //否	货位，仓库开启货位则必填    示例：whhw2467516
              collaborationPodetailid: apiResponseXiangqing.data.details[b].collaborationPodetailid, //	否	协同来源单据子表id
              collaborationPoid: apiResponseXiangqing.data.details[b].collaborationPoid, //	否	协同来源单据id
              oriMoney: Math.round(wushuiAmount * 100) / 100, //是	无税金额
              oriUnitPrice: Math.round(wushuiDanjiaAmount * 1000000) / 1000000, //是	无税单价
              oriTax: Math.round(shuiAmount * 100) / 100, //是	税额
              oriSum: Math.round(hanshuiAmount * 100) / 100, //是	含税金额    示例：24
              oriTaxUnitPrice: Math.round(hanshuiDanAmount * 1000000) / 1000000, //含税单价
              salesOutsDefineCharacter: {
                id: apiResponseXiangqing.data.details[b].id,
                attrext1: param.value,
                _status: "Update"
              }
            };
            details = details + JSON.stringify(detail) + ",";
          }
        }
      }
      let body = {
        data: {
          id: apiResponseXiangqing.data.id,
          resubmitCheckKey: apiResponseXiangqing.data.id + S4(), //是	保证请求的幂等性,该值由客户端生成,并且必须是全局唯一的，长度不能超过32位。更多信息,请参见«MDD幂等性»
          receiveAccountingBasis: apiResponseXiangqing.data.receiveAccountingBasis, //是	立账开票依据, voucher_order:销售订单、voucher_delivery:销售发货单、st_salesout:销售出库单、unsettle:不结算、    示例：st_salesout
          salesoutAccountingMethod: apiResponseXiangqing.data.salesoutAccountingMethod, //是	出库立账方式, salesoutEstimate:出库暂估应收、salesoutConfirm:出库确认应收、invoiceConfirm:开票确认应收、    示例：salesoutConfirm
          accountOrg: apiResponseXiangqing.data.accountOrg, //是	会计主体id或编码    示例：guanlong_001
          org: apiResponseXiangqing.data.org, //是	发货组织id或编码    示例：guanlong_001
          salesOrg: apiResponseXiangqing.data.salesOrg, //是	销售组织id或编码    示例：guanlong_001
          invoiceOrg: apiResponseXiangqing.data.invoiceOrg, //是	开票组织id或编码    示例：guanlong_001
          vouchdate: apiResponseXiangqing.data.vouchdate, //是	单据日期    示例：2020-11-30 00:00:00
          bustype: apiResponseXiangqing.data.bustype, //是	交易类型id或编码    示例：A30001
          warehouse: apiResponseXiangqing.data.warehouse, //是	仓库id或编码    示例：Z001
          invoiceCust: apiResponseXiangqing.data.invoiceCust, //否	开票客户ID或编码，如果使用信用服务则必输    示例：_001000002
          cust: apiResponseXiangqing.data.cust, //是	客户id或编码    示例：_001000002
          srcBillType: apiResponseXiangqing.data.srcBillType, //是	来源类型, 0:无来源、st_purinrecord:采购入库单、1:发货单、2:销售订单、3:退货单、tradeorder:电商订单、refundorder:电商退换货订单、retailvouch:零售单、mallvouch:商城发货单、    示例：0
          natCurrency: apiResponseXiangqing.data.natCurrency, //是	本币id或编码    示例：CNY
          currency: apiResponseXiangqing.data.currency, //是	币种id或编码    示例：CNY
          sourcesys: apiResponseXiangqing.data.sourcesys, //否	有来源时必填，来源单据领域，udinghuo:销售，retail：零售，dst：电商
          details: JSON.parse("[" + details.substring(0, details.length - 1) + "]"),
          _status: "Update"
        }
      };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "AT18526ADE08800003", JSON.stringify(body));
      apiResponse = JSON.parse(apiResponse);
      if (apiResponse.code != "200") {
        throw new Error("------修改销售出库批改功能异常，异常如下：------" + JSON.stringify(apiResponse) + ";参数如下：" + JSON.stringify(body));
      }
    }
    if (errorInfoMessage != "") {
      throw new Error("单据号" + errorInfoMessage + "处于非开立状态，无法修改加价比例！！！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });