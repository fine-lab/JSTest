let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    for (var a = 0; a < param.data.length; a++) {
      //查询对应的调出单据详情
      let diaoboType = param.data[a].srcBillType; //来源上级单据类型, st_transferapply:调拨订单、st_storeout:调出单、st_storein:调入单
      if (diaoboType == undefined || diaoboType == null || diaoboType != "st_transferapply") {
        return {};
      }
      let diaoboId = ""; //来源上级单据编号
      let dcBody = {};
      let dcUrl = "https://www.example.com/" + param.data[a].id;
      let dcApiResponse = openLinker("GET", dcUrl, "ST", JSON.stringify(dcBody));
      var dcObject = JSON.parse(dcApiResponse);
      if (dcObject.data != undefined && dcObject.data != null && dcObject.data.details != undefined && dcObject.data.details != null && dcObject.data.details.length > 0) {
        diaoboId = dcObject.data.details[0].sourceid;
      }
      //查询所对应的调拨订单数据
      let dbBody = {};
      let dbUrl = "https://www.example.com/" + diaoboId;
      let dbApiResponse = openLinker("GET", dbUrl, "ST", JSON.stringify(dbBody));
      var dbObject = JSON.parse(dbApiResponse);
      //根据类型判断是请购单，还是采购入库单
      let type = "";
      let id = "";
      if (
        dbObject.data != null &&
        dbObject.data != undefined &&
        dbObject.data.transferApplys.length > 0 &&
        dbObject.data.transferApplys[0].source != null &&
        dbObject.data.transferApplys[0].source != undefined
      ) {
        type = dbObject.data.transferApplys[0].source;
        id = dbObject.data.transferApplys[0].sourceid;
      }
      if (type == "str_qgd") {
        //请购单
        let qgBody = {};
        let qgUrl = "https://www.example.com/" + id;
        let qgApiResponse = openLinker("GET", qgUrl, "ST", JSON.stringify(qgBody));
        var qgObject = JSON.parse(qgApiResponse);
        let diaochuDails = dcObject.data.details;
        let applyOrderList = "";
        for (var b = 0; b < diaochuDails.length; b++) {
          let diaoboZiId = diaochuDails[b].sourceautoid;
          let qinggouZhuId = "";
          let qinggouZiId = "";
          for (var c = 0; c < dbObject.data.transferApplys.length; c++) {
            if (dbObject.data.transferApplys[c].id == diaoboZiId) {
              qinggouZhuId = dbObject.data.transferApplys[c].sourceid;
              qinggouZiId = dbObject.data.transferApplys[c].sourceautoid;
            }
          }
          for (var d = 0; d < qgObject.data.applyOrders.length; d++) {
            if (qgObject.data.applyOrders[d].id == qinggouZiId) {
              //单独查询采购组织编码（根据Id）
              let cgSql = "select id,name,code from org.func.BaseOrg where id = '" + qgObject.data.applyOrders[d].purchaseOrg + "'";
              var cgObject = ObjectStore.queryByYonQL(cgSql, "ucf-org-center");
              var cgCode = "";
              for (var e = 0; e < cgObject.length; e++) {
                if (cgObject[b].code != undefined) {
                  cgCode = cgObject[b].code;
                }
              }
              //单独查询主计量编码（根据Id）
              let dwSql = "select id,name,code from pc.unit.Unit where id = '" + qgObject.data.applyOrders[d].unit + "'";
              var dwObject = ObjectStore.queryByYonQL(dwSql, "productcenter");
              var dwCode = "";
              for (var f = 0; f < dwObject.length; f++) {
                if (dwObject[f].code != undefined) {
                  dwCode = dwObject[f].code;
                }
              }
              let diaochuCount = qgObject.data.applyOrders[d].applyOrdersDefineCharacter.attrext10 * 1 - diaochuDails[b].qty * 1;
              let applyOrder = {
                id: qgObject.data.applyOrders[d].id, //
                applyOrdersDefineCharacter: {
                  id: qgObject.data.applyOrders[d].applyOrdersDefineCharacter.id,
                  attrext10: diaochuCount
                },
                product_cCode: qgObject.data.applyOrders[d].product_cCode, //物料编码    示例：00000002
                subQty: qgObject.data.applyOrders[d].subQty, //采购数量    示例：11
                purUOM_Code: qgObject.data.applyOrders[d].purUOM_Code, //采购单位编码    示例：001
                unit_code: dwCode, //主计量编码    示例：001
                qty: qgObject.data.applyOrders[d].qty, //数量    示例：220
                requirementDate: qgObject.data.applyOrders[d].requirementDate, //需求日期    示例：2021-03-04 00:00:00
                purchaseOrg_code: cgCode, //采购组织编码    示例：10011001
                invExchRate: qgObject.data.applyOrders[d].invExchRate, //采购换算率    示例：1
                _status: "Update" //
              };
              applyOrderList = applyOrderList + JSON.stringify(applyOrder) + ",";
              continue;
            }
          }
        }
        //单独查询需求组织编码（根据Id）
        let xqSql = "select id,name,code from org.func.BaseOrg where id = '" + qgObject.data.org + "'";
        var xqObject = ObjectStore.queryByYonQL(xqSql, "ucf-org-center");
        var xqCode = "";
        for (var g = 0; g < xqObject.length; g++) {
          if (xqObject[g].code != undefined) {
            xqCode = xqObject[g].code;
          }
        }
        var qguuid = uuid();
        let qinggouBody = {
          data: {
            resubmitCheckKey: replace(qguuid, "-", ""), //保证请求的幂等性,该值由客户端生成,并且必须是全局唯一的，长度不能超过32位。更多信息,请参见«MDD幂等性»
            id: qgObject.data.id, //
            bustype: qgObject.data.bustype, //交易类型code或交易类型id    示例：A5002
            org_code: xqCode, //需求组织编码    示例：001
            vouchdate: qgObject.data.vouchdate, //单据日期    示例：2021-03-04 00:00:00
            applyOrders: JSON.parse("[" + applyOrderList.substring(0, applyOrderList.length - 1) + "]"),
            _status: "Update"
          }
        };
        let qgUrlUpdate = "https://www.example.com/";
        let qgApiUpdateResponse = openLinker("POST", qgUrlUpdate, "ST", JSON.stringify(qinggouBody));
        var qgUpdateObject = JSON.parse(qgApiUpdateResponse);
        if (qgUpdateObject.code != "200") {
          throw new Error(JSON.stringify(qinggouBody) + "------修改请购单已调拨数量异常，异常如下：------" + JSON.stringify(qgUpdateObject));
        }
      } else if (type == "str_cgrk") {
        //采购入库
        let cgBody = {};
        let cgUrl = "https://www.example.com/" + id;
        let cgApiResponse = openLinker("GET", cgUrl, "ST", JSON.stringify(cgBody));
        var cgObject = JSON.parse(cgApiResponse);
        let diaochuDails = dcObject.data.details;
        let applyOrderList = "";
        for (var h = 0; h < diaochuDails.length; h++) {
          let diaoboZiId = diaochuDails[h].sourceautoid;
          let caigouZhuId = "";
          let caigouZiId = "";
          for (var i = 0; i < dbObject.data.transferApplys.length; i++) {
            if (dbObject.data.transferApplys[i].id == diaoboZiId) {
              caigouZhuId = dbObject.data.transferApplys[i].sourceid;
              caigouZiId = dbObject.data.transferApplys[i].sourceautoid;
            }
          }
          for (var j = 0; j < cgObject.data.purInRecords.length; j++) {
            if (cgObject.data.purInRecords[j].id == caigouZiId) {
              let diaochuCount = cgObject.data.purInRecords[j].purInRecordsDefineCharacter.attrext10 * 1 - diaochuDails[h].qty * 1;
              let applyOrder = {
                id: cgObject.data.purInRecords[j].id, //
                rowno: cgObject.data.purInRecords[j].rowno, //行号    示例：1
                isSerialNoManage: cgObject.data.purInRecords[j].isSerialNoManage, //序列号管理, true:是、false:否、    示例：false
                product: cgObject.data.purInRecords[j].product, //物料，传入id或code    示例：PD0817000001
                productsku: cgObject.data.purInRecords[j].productsku, //物料SKU，传入id或code（未启用特征必填）    示例：PD08170000010004
                free1: cgObject.data.purInRecords[j].free1, //物料规格1
                free2: cgObject.data.purInRecords[j].free2, //物料规格2
                isBatchManage: cgObject.data.purInRecords[j].isBatchManage, //是否批次管理    示例：true
                isExpiryDateManage: cgObject.data.purInRecords[j].isExpiryDateManage, //是否效期管理    示例：true
                batchno: cgObject.data.purInRecords[j].batchno, //批次号，批次管理的物料必输 示例：SH01    示例：SH01
                producedate: cgObject.data.purInRecords[j].producedate, //生产日期，效期管理的物料必输，格式：yyyy-MM-dd hh:mm:ss 示例：2020-09-24 00:00:00    示例：2020-09-24 00:00:00
                invaliddate: cgObject.data.purInRecords[j].invaliddate, //有效期至，效期管理的物料必输，格式：yyyy-MM-dd hh:mm:ss 示例：2020-10-24 00:00:00    示例：2020-10-24 00:00:00
                qty: cgObject.data.purInRecords[j].qty, //数量，实收数量与应收数量不能同时为空    示例：10
                unit: cgObject.data.purInRecords[j].unit, //主计量单位，传入id或code    示例：KGM
                invExchRate: cgObject.data.purInRecords[j].invExchRate, //库存换算率    示例：1
                unitExchangeType: cgObject.data.purInRecords[j].unitExchangeType, //库存换算率换算方式，0固定换算，1浮动换算    示例：0
                subQty: cgObject.data.purInRecords[j].subQty, //件数，浮动换算物料必输    示例：10
                stockUnitId: cgObject.data.purInRecords[j].stockUnitId, //库存单位，传入id或code    示例：KGM
                goodsposition: cgObject.data.purInRecords[j].goodsposition, //货位，传入id或code，仓库开启货位记存量时必输    示例：ck01_hw01
                contactsQuantity: cgObject.data.purInRecords[j].contactsQuantity, //应收数量，应收数量与实收数量不能同时为空    示例：10
                contactsPieces: cgObject.data.purInRecords[j].contactsPieces, //应收件数    示例：10
                unitExchangeTypePrice: cgObject.data.purInRecords[j].unitExchangeTypePrice, //计价换算率换算方式，0固定换算，1浮动换算    示例：0
                priceQty: cgObject.data.purInRecords[j].priceQty, //计价数量    示例：10
                invPriceExchRate: cgObject.data.purInRecords[j].invPriceExchRate, //计价换算率    示例：1
                priceUOM: cgObject.data.purInRecords[j].priceUOM, //计价单位，传入id或code    示例：KGM
                isGiftProduct: cgObject.data.purInRecords[j].isGiftProduct, //赠品, true:是、false:否    示例：false
                oriUnitPrice: cgObject.data.purInRecords[j].oriUnitPrice, //无税单价    示例：10
                oriTaxUnitPrice: cgObject.data.purInRecords[j].oriTaxUnitPrice, //含税单价    示例：10
                oriMoney: cgObject.data.purInRecords[j].oriMoney, //无税金额    示例：100
                oriSum: cgObject.data.purInRecords[j].oriSum, //含税金额    示例：100
                oriTax: cgObject.data.purInRecords[j].oriTax, //税额    示例：10
                taxitems: cgObject.data.purInRecords[j].taxitems_code, //税目税率，传入id或code    示例：VAT9
                natUnitPrice: cgObject.data.purInRecords[j].natUnitPrice, //本币无税单价    示例：10
                natTaxUnitPrice: cgObject.data.purInRecords[j].natTaxUnitPrice, //本币含税单价    示例：10
                natMoney: cgObject.data.purInRecords[j].natMoney, //本币无税金额    示例：100
                natSum: cgObject.data.purInRecords[j].natSum, //本币含税金额    示例：100
                natTax: cgObject.data.purInRecords[j].natTax, //本币税额    示例：10
                autoCalcCost: cgObject.data.purInRecords[j].autoCalcCost, //存货自动计算成本标识，是否由存货核算回写成本金额、成本单价    示例：false
                unDeductTaxRate: cgObject.data.purInRecords[j].unDeductTaxRate, //不可抵扣税率    示例：10
                unDeductTax: cgObject.data.purInRecords[j].unDeductTax, //不可抵扣税额    示例：1
                costUnitPrice: cgObject.data.purInRecords[j].costUnitPrice, //成本单价    示例：10
                costMoney: cgObject.data.purInRecords[j].costMoney, //成本金额    示例：101
                memo: cgObject.data.purInRecords[j].memo, //备注    示例：备注信息
                project: cgObject.data.purInRecords[j].project, //项目，传入id或code    示例：project_01
                pubts: cgObject.data.purInRecords[j].pubts, //时间戳
                purInRecordsDefineCharacter: {
                  id: cgObject.data.purInRecords[j].purInRecordsDefineCharacter.id,
                  attrext10: diaochuCount
                },
                _status: "Update" //
              };
              applyOrderList = applyOrderList + JSON.stringify(applyOrder) + ",";
              continue;
            }
          }
        }
        var cguuid = uuid();
        let caigouBody = {
          data: {
            resubmitCheckKey: replace(cguuid, "-", ""), //保证请求的幂等性,该值由客户端生成,并且必须是全局唯一的，长度不能超过32位。更多信息,请参见«MDD幂等性»
            needCalcLines: false, //表体行计算标识：不传或传入false时不对子表进行二次计算，需调用方保证数据的正确性；为true时，以原币无税金额和数量进行件数及其他金额、单价、成本的反算    示例：false
            id: cgObject.data.id, //
            code: cgObject.data.code, //单据编号，以系统编码规则配置为准，系统设置为手工编号时必输，系统设置为自动编号时非必输；更新操作时必填    示例：CGRK00001
            org: cgObject.data.org, //收货组织，传入id或code    示例：wzyqzn
            purchaseOrg: cgObject.data.purchaseOrg, //采购组织，传入id或code    示例：wzyqzn
            accountOrg: cgObject.data.accountOrg, //会计主体，传入id或code    示例：wzyqzn
            inInvoiceOrg: cgObject.data.inInvoiceOrg, //收票组织，传入id或code    示例：wzyqzn
            vouchdate: cgObject.data.vouchdate, //单据日期，日期格式:yyyy-MM-dd    示例：2021-03-05
            bustype: cgObject.data.bustype, //交易类型，传入id或code    示例：A15001
            store: cgObject.data.store, //门店，传入id或code    示例：store_code_01
            warehouse: cgObject.data.warehouse, //仓库，传入id或code    示例：ck_01
            vendor: cgObject.data.vendor, //供应商，传入id或code    示例：vendor_01
            invoiceVendor: cgObject.data.invoiceVendor, //开票供应商，传入id或code；不传入默认开票供应商=供应商。    示例：vendor_01
            department: cgObject.data.department, //部门，传入id或code    示例：dept_01
            paymentagrement: cgObject.data.paymentagrement, //付款协议档案，传入id或code    示例：pay_01
            invoicingDocEntryAndMgmt: cgObject.data.invoicingDocEntryAndMgmt, //立账开票依据，枚举值，{"st_purinrecord": "入库单", "st_purinvoice": "发票"}，与“入库立账方式”成对传入。立账开票依据“入库单”对应入库立账方式为“入库暂估应付”或“入库确认应付”，“发票”对应“开票确认应付”。立账开票依据与入库立账方式优先取保存前规则的设置，若业务流或者交易类型中保存前规则指定了入库立账方式，则API传入的值不生效，以业务流或者交易类型中的配置为准。    示例：st_purinvoice
            receiptDocEntryAndMgmt: cgObject.data.receiptDocEntryAndMgmt, //入库立账方式，枚举值，与“立账开票依据”成对传入。{"receipt_estimated_AP":"入库暂估应付","receipt_confirm_AP":"入库确认应付","invoicing_confirm_AP":"开票确认应付"}，立账开票依据“入库单”对应入库立账方式为“入库暂估应付”或“入库确认应付”，“发票”对应“开票确认应付”。立账开票依据与入库立账方式优先取保存前规则的设置，若业务流或者交易类型中保存前规则指定了入库立账方式，则API传入的值不生效，以业务流或者交易类型中的配置为准。    示例：invoicing_confirm_AP
            currency: cgObject.data.currency, //币种，传入id或code    示例：CNY
            natCurrency: cgObject.data.natCurrency, //本币，传入id或code    示例：CNY
            exchRateType: cgObject.data.exchRateType, //汇率类型，传入id或code    示例：01
            exchRate: cgObject.data.exchRate, //汇率    示例：1
            taxRate: cgObject.data.taxRate, //税率    示例：5
            contact: cgObject.data.contact, //联系人    示例：王XX
            contactTel: cgObject.data.contactTel, //联系人电话    示例：18800001111
            operator: cgObject.data.operator, //业务员，传入id或code    示例：operator_01
            stockMgr: cgObject.data.stockMgr, //库管员，传入id或code    示例：operator_02
            taxSettingType: cgObject.data.taxSettingType, //计税方式，"0"为行计税，"1"为整单计税，不传或传其他值默认为行计税    示例：0
            isBeginning: cgObject.data.isBeginning, //期初标识, true:是，false:否    示例：false
            memo: cgObject.data.memo, //备注    示例：XXX
            bizFlow: cgObject.data.bizFlow, //流程id    示例：a50fd3d2-e063-11ea-8c0b-98039b073634
            purInRecords: JSON.parse("[" + applyOrderList.substring(0, applyOrderList.length - 1) + "]"),
            _status: "Update"
          }
        };
        let caigouUrlUpdate = "https://www.example.com/";
        let caigouApiUpdateResponse = openLinker("POST", caigouUrlUpdate, "ST", JSON.stringify(caigouBody));
        var caigouUpdateObject = JSON.parse(caigouApiUpdateResponse);
        if (caigouUpdateObject.code != "200") {
          throw new Error(JSON.stringify(caigouBody) + "------修改采购入库已调拨数量异常，异常如下：------" + JSON.stringify(caigouUpdateObject));
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });