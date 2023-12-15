let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //从新计算表体数据
    function calculateBody(bodyData, num) {
      //含税金额
      let oriSumValue = (num * bodyData.oriTaxUnitPrice).toFixed(2);
      //无税金额
      let oriMoneyValue = (oriSumValue / (1 + bodyData.taxRateNum / 100)).toFixed(2);
      //税额
      let oriTaxValue = (oriSumValue - oriMoneyValue).toFixed(2);
      bodyData.oriSum = oriSumValue;
      bodyData.oriMoney = oriMoneyValue;
      bodyData.oriTax = oriTaxValue;
      bodyData.qty = num;
      bodyData.priceQty = num;
      bodyData.subQty = num;
      return bodyData;
    }
    //组装接口表体
    function packageBody(bodyData, type) {
      let packageBody = {
        stockId: bodyData.stockName + "",
        "orderDetailPrices!natSum": bodyData.oriSum,
        "orderDetailPrices!natMoney": bodyData.oriMoney,
        productId: bodyData.agentProductCode + "",
        masterUnitId: bodyData.masterUnit + "",
        invExchRate: 1, //销售换算率
        unitExchangeTypePrice: 0, //浮动（销售）
        "orderDetailPrices!oriTax": bodyData.oriTax,
        particularlyMoney: bodyData.particularlyMoney, //特殊优惠
        iProductAuxUnitId: bodyData.productAuxUnitName,
        "orderDetailPrices!natUnitPrice": bodyData.oriUnitPrice,
        invPriceExchRate: 1, //计价换算率
        oriSum: bodyData.oriSum,
        "orderDetailPrices!oriMoney": bodyData.oriMoney,
        priceQty: bodyData.priceQty,
        stockOrgId: bodyData.stockOrgId,
        iProductUnitId: bodyData.productUnitName,
        "orderDetailPrices!natTaxUnitPrice": bodyData.oriTaxUnitPrice,
        orderProductType: bodyData.orderProductType,
        subQty: bodyData.subQty,
        consignTime: bodyData.consignTime,
        skuId: bodyData.skuId + "",
        taxId: bodyData.taxRate + "",
        qty: bodyData.qty,
        settlementOrgId: bodyData.settlementOrgId + "",
        oriTaxUnitPrice: bodyData.oriTaxUnitPrice,
        "orderDetailPrices!natTax": bodyData.oriTax,
        unitExchangeType: 0, //浮动（计价
        "orderDetailPrices!oriUnitPrice": bodyData.oriUnitPrice,
        _status: "Insert",
        sourcechild_id: bodyData.id + "", //上游单据子表主键
        source_id: bodyData.salesAdvanceOrder_id + "", //上游单据主表主键
        upcode: bodyData.salesAdvanceOrder_id + "", //协同来源单据号
        free1: bodyData.free1,
        free2: bodyData.free2,
        free3: bodyData.free3,
        free4: bodyData.free4,
        free5: bodyData.free5,
        bodyFreeItem: {
          define1: bodyData.frametype,
          define2: type + ""
        },
        bodyItem: {
          define1: bodyData.define1, //附加光度
          define2: bodyData.define2, //瞳距
          define3: bodyData.define3, //轴位
          define4: bodyData.define4, //瞳高
          define5: bodyData.define5, //左右眼RL
          define6: bodyData.define6, //镜片直径
          define7: bodyData.define7, //矫正视力
          define8: bodyData.define8, //折射率
          define10: bodyData.film //膜层
        },
        memo: bodyData.memo
      };
      return packageBody;
    }
    //组装接口
    function packageHead(selectData, type) {
      let transactionTypeId = "yourIdHere";
      let bizFlow = "c20643b2-4125-11ec-9896-6c92bf477043";
      let resubmitCheckKey = replace(uuid(), "-", "");
      let packageHead = {
        bizFlow: bizFlow,
        resubmitCheckKey: resubmitCheckKey,
        salesOrgId: selectData.org_id + "",
        transactionTypeId: transactionTypeId + "",
        vouchdate: selectData.vouchdate,
        agentId: selectData.agentId + "",
        saleDepartmentId: selectData.saleDepartmentId + "",
        corpContact: selectData.corpContact,
        settlementOrgId: selectData.org_id + "",
        "orderPrices!currency": selectData.orderPrices,
        "orderPrices!exchRate": 1, //汇率
        "orderPrices!exchangeRateType": selectData.exchangeRateType,
        "orderPrices!natCurrency": selectData.orderPrices,
        "orderPrices!taxInclusive": true, //单价含税
        receiver: selectData.receiver,
        receiveZipCode: selectData.receiveZipCode,
        receiveTelePhone: selectData.receiveTelePhone,
        receiveMobile: selectData.receiveMobile,
        receiveAddress: selectData.receiveAddress,
        invoiceAgentId: selectData.invoiceAgent + "",
        modifyInvoiceType: true, //发票类型可改
        invoiceUpcType: selectData.invoiceUpcType,
        invoiceTitleType: selectData.invoiceTitleType,
        invoiceTitle: selectData.invoiceTitle,
        taxNum: selectData.taxNum, //纳税识别号
        invoiceTelephone: selectData.invoiceTelephone, //营业电话
        invoiceAddress: selectData.invoiceAddress, //营业地址
        bankName: selectData.bankName,
        subBankName: selectData.subBankName,
        bankAccount: selectData.bankAccount,
        headFreeItem: {
          define1: selectData.define1, //销售合同编号
          define2: type + "", //是否通过齐套检查
          define3: selectData.membername, //会员名称
          define4: selectData.huiyuanname, //成员名称
          define5: selectData.membersex, //性别
          define6: selectData.memberbirthday, //出生年月
          define7: selectData.memberage, //年龄
          define8: selectData.membertxt, //联系电话
          define9: selectData.optometristnum, //验光师工号
          define10: selectData.optometristname //验光师名称
        },
        headItem: { define3: selectData.code }, //来源订单号
        purchaseNo: selectData.purchaseNo, //客户采购订单号
        _status: "Insert"
      };
      return packageHead;
    }
    //返回数据
    let ruturnData = {};
    //前台传递数据
    let selectData = request.selectData;
    var okOrderDetails = new Array(); //满足现存量的子数据
    var noOrderDetails = new Array(); //不满足现存量
    var oktotal = 0;
    var nototal = 0;
    //查询子表数据
    var queryBodySql = "select * from GT80266AT1.GT80266AT1.salesAdvanceOrder_b where dr=0 and salesAdvanceOrder_id=" + selectData.id;
    var bodyRes = ObjectStore.queryByYonQL(queryBodySql);
    var availableqtyMap = new Map();
    for (var i = 0; i < bodyRes.length; i++) {
      let bodyData = bodyRes[i];
      //查询物料详情信息，判断是不是框架
      let isframe = false;
      //依据主键查询物料档案的商品分类
      let queryMaterSql = "select productClass from pc.product.Product where id=" + bodyData.agentProductCode;
      var materRes = ObjectStore.queryByYonQL(queryMaterSql, "productcenter");
      if (materRes.length == 0) {
        ruturnData = { code: 999, message: "查询物料详情失败，请检查！" };
        return { ruturnData };
      }
      if (materRes[0].productClass == "2505130822587136") {
        //镜架
        isframe = true;
      } else {
        isframe = false;
      }
      //查询物料的现存量
      let queryCountNumAPI = extrequire("GT80266AT1.backDefaultGroup.queryCountNum");
      let param = { org: bodyData.stockOrgId, warehouse: bodyData.stockName, product: bodyData.agentProductCode, productsku: bodyData.skuId };
      let queryCountNumRes = queryCountNumAPI.execute(null, param);
      let availableqtyKey = "" + bodyData.stockOrgId + bodyData.stockName + bodyData.agentProductCode + bodyData.skuId;
      if (queryCountNumRes.result.code == 200) {
        //可用现存量
        let availableqty = queryCountNumRes.result.availableqty;
        if (availableqtyMap[availableqtyKey] != null) {
          let availableqtyValue = availableqtyMap[availableqtyKey];
          availableqty = availableqty - availableqtyValue;
          availableqtyMap[availableqtyKey] = bodyData.qty + availableqtyValue;
        } else {
          availableqtyMap[availableqtyKey] = bodyData.qty;
        }
        if (availableqty <= 0) {
          if (isframe) {
            ruturnData = { code: 999, message: "镜架库存不足，不可下推" };
            return { ruturnData };
          }
          nototal = nototal + bodyData.oriSum;
          noOrderDetails.push(packageBody(bodyData, false));
        } else if (availableqty >= bodyData.qty) {
          oktotal = oktotal + bodyData.oriSum;
          okOrderDetails.push(packageBody(bodyData, true));
        } else if (availableqty < bodyData.qty) {
          if (isframe) {
            ruturnData = { code: 999, message: "镜架库存不足，不可下推" };
            return { ruturnData };
          }
          //不满足数量
          let newQty = bodyData.qty - availableqty;
          let okBody = calculateBody(bodyData, availableqty);
          oktotal = oktotal + okBody.oriSum;
          okOrderDetails.push(packageBody(okBody, true));
          let noBody = calculateBody(bodyData, newQty);
          nototal = nototal + noBody.oriSum;
          noOrderDetails.push(packageBody(noBody, false));
        }
      } else {
        ruturnData = { code: queryCountNumRes.result.code, message: "查询现存量失败：" + queryCountNumRes.result.message };
        return { ruturnData };
      }
    }
    //处理满足现存量数据
    if (okOrderDetails.length > 0) {
      let okhead = packageHead(selectData, true);
      if (noOrderDetails.length > 0) {
        okhead.headFreeItem.define2 = "false";
        for (var j = 0; j < okOrderDetails.length; j++) {
          let ss = okOrderDetails[j];
          ss.bodyFreeItem.define2 = "false";
        }
      } else {
        okhead.headFreeItem.define2 = "true";
      }
      okhead.orderDetails = okOrderDetails;
      okhead.payMoney = oktotal;
      okhead.code = selectData.code + "-RC";
      let insertOkAPI = extrequire("GT80266AT1.backDefaultGroup.insertSalesOrder");
      let insertOkRes = insertOkAPI.execute(null, okhead);
      if (insertOkRes.result.code == 200) {
        let auditOkAPI = extrequire("GT80266AT1.backDefaultGroup.auditSalesOrder");
        let auditOkRes = auditOkAPI.execute(null, insertOkRes.result.data.id);
        if (auditOkRes.result.code != 200) {
          ruturnData = { code: auditOkRes.result.code, message: "审批已有现存量数据失败：" + auditOkRes.result.message };
          return { ruturnData };
        }
      } else {
        ruturnData = { code: insertOkRes.result.code, message: "保存已有现存量数据失败：" + insertOkRes.result.message };
        return { ruturnData };
      }
    }
    //处理不满足现存量数据
    if (noOrderDetails.length > 0) {
      let nohead = packageHead(selectData, false);
      nohead.orderDetails = noOrderDetails;
      nohead.payMoney = nototal;
      nohead.code = selectData.code + "-ZY";
      let insertNoAPI = extrequire("GT80266AT1.backDefaultGroup.insertSalesOrder");
      let insertNoRes = insertNoAPI.execute(null, nohead);
      if (insertNoRes.result.code != 200) {
        ruturnData = { code: insertNoRes.result.code, message: "保存缺少现存量数据失败：" + insertNoRes.result.message };
        return { ruturnData };
      }
    }
    var updateobject = { id: selectData.id, pushdown: "true" };
    var res = ObjectStore.updateById("GT80266AT1.GT80266AT1.salesAdvanceOrder", updateobject, "34d58361");
    ruturnData = {
      code: 200,
      message: "下推成功！"
    };
    return { ruturnData };
  }
}
exports({ entryPoint: MyAPIHandler });