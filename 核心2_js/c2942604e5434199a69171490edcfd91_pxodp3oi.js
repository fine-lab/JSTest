let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
const getSaleOrderObj = (saleOrderDetailList, orderDetailId) => {
  for (var i in saleOrderDetailList) {
    if (saleOrderDetailList[i].id == orderDetailId) {
      return saleOrderDetailList[i];
    }
  }
  return null;
};
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let LogToDB = true;
    let APPCODE = "GT3734AT5"; //应用AppCode-固定值
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[businessIdArr.length - 1];
    let logToDBUrl = DOMAIN + "/" + tid + "/selfApiClass/glSelfApi/logToDB"; //发布的写日志接口
    let queryUrl = DOMAIN + "/yonbip/sd/voucherorder/detail";
    let sqlStr = "select *,(select * from saleInvoiceDetails) as saleInvoiceDetails  from voucher.invoice.SaleInvoice " + " where id = '" + businessId + "'";
    let queryRes = ObjectStore.queryByYonQL(sqlStr, "udinghuo");
    let dataDetail = queryRes[0];
    if (dataDetail.verifystate == 2) {
      //审核态
      let invoiceId = dataDetail.id;
      let invoiceCode = dataDetail.code;
      //查询红字订单，如果已经有了，先删除之 TODO 20231128
      let SaleOrderId = dataDetail.extendSaleOrderId;
      let SaleOrderCode = dataDetail.extendSaleOrderCode;
      if (SaleOrderId == undefined || SaleOrderId == null || SaleOrderId == "") {
        openLinker("POST", logToDBUrl, APPCODE, JSON.stringify({ LogToDB: true, logModule: 9, description: "销售发票审核异常-无销售订单ID", reqt: "", resp: "", usrName: usrName }));
        return;
      }
      let saleInvoiceList = dataDetail.saleInvoiceDetails;
      let apiResponse = openLinker("GET", queryUrl + "?id=" + SaleOrderId, APPCODE, JSON.stringify({ id: SaleOrderId }));
      let resDataObj = JSON.parse(apiResponse).data;
      let orderDetails = resDataObj.orderDetails;
      let redOrderDetailList = [];
      for (var i in saleInvoiceList) {
        let saleInvoiceObj = saleInvoiceList[i];
        let orderDetailId = saleInvoiceObj.orderDetailId;
        let qty = saleInvoiceObj.qty; //发票中数量
        let orderDetailObj = getSaleOrderObj(orderDetails, orderDetailId);
        let extendwlfl_name = orderDetailObj.extendwlfl_name; //物料分类
        if (extendwlfl_name == undefined || extendwlfl_name == null) {
          extendwlfl_name = "";
        }
        let piId = orderDetailObj.bodyItem.define1;
        let piName = orderDetailObj.bodyItem.define1_name;
        let natAmount = orderDetailObj.orderDetailPrices.natSum; //本币金额
        let oriAmount = orderDetailObj.orderDetailPrices.oriMoney; //原币金额
        let oriTax = orderDetailObj.orderDetailPrices.oriTax;
        let natTax = orderDetailObj.orderDetailPrices.natTax;
        let vendor = orderDetailObj.bodyFreeItem.define56; //供应商
        if (vendor == undefined || vendor == null) {
          vendor = "";
        }
        let costAmount = orderDetailObj.bodyFreeItem.define60;
        let taxAmount = orderDetailObj.bodyFreeItem.define59;
        if (costAmount == undefined || costAmount == null || costAmount == "") {
          costAmount = 0;
        } else {
          costAmount = Number(costAmount).toFixed(2);
        }
        if (taxAmount == undefined || taxAmount == null || taxAmount == "") {
          taxAmount = 0;
        } else {
          taxAmount = Number(taxAmount).toFixed(2);
        }
        let srcSubQty = orderDetailObj.subQty;
        let purcostPrice = (costAmount / srcSubQty).toFixed(2); //成本单价
        redOrderDetailList.push({
          hasDefaultInit: true,
          _status: "Insert",
          product: orderDetailObj.productId, //商品
          productCode: orderDetailObj.productCode, //商品编码
          specDescription: orderDetailObj.specDescription, //规格型号
          productUnit: orderDetailObj.iProductUnitId, //计价单位
          productName: orderDetailObj.productName, //商品名称
          productClsName: extendwlfl_name, //物料分类
          PIId: piId, //财务PI
          priceQty: qty, //计价数量
          taxRate: orderDetailObj.taxRate, //税率
          taxCode: orderDetailObj.taxCode, //税率编码
          oriTax: ((orderDetailObj.orderDetailPrices.oriTax * qty) / srcSubQty).toFixed(2), //税额
          oriSum: ((orderDetailObj.oriSum * qty) / srcSubQty).toFixed(2), //含税金额
          salePrice: orderDetailObj.oriTaxUnitPrice, //含税单价
          subQty: qty, //销售数量
          taxItems: orderDetailObj.taxItems, //税目
          natUnitPrice: orderDetailObj.orderDetailPrices.natUnitPrice, //无税单价
          natMoney: orderDetailObj.orderDetailPrices.oriMoney, //无税金额
          purcostPrice: purcostPrice, //成本单价
          purcostMoney: ((costAmount * qty) / srcSubQty).toFixed(2), //成本金额
          purcostTax: ((taxAmount * qty) / srcSubQty).toFixed(2), //成本税额extendwlfl
          natSum: ((orderDetailObj.orderDetailPrices.natSum * qty) / srcSubQty).toFixed(2), //本币含税金额
          natTax: ((orderDetailObj.orderDetailPrices.natTax * qty) / srcSubQty).toFixed(2), //本币税额
          srcPurcostSum: costAmount, //源单采购总成本
          srcSubQty: srcSubQty, //源单销售总数量
          srcOrderBillRowId: orderDetailObj.id, //源单行ID
          srcPurcostTax: taxAmount, //源单采购成本税额extendPurCost
          srcOriSum: orderDetailObj.oriSum,
          srcOriTax: orderDetailObj.orderDetailPrices.oriTax,
          srcNatSum: orderDetailObj.orderDetailPrices.natSum,
          srcNatTax: orderDetailObj.orderDetailPrices.natTax,
          source_id: invoiceId,
          sourcechild_id: orderDetailObj.id,
          source_billtype: "voucher_saleinvoice",
          bizFlowId: "yourIdHere",
          bizFlowName: "发票->红字订单",
          bizFlowVersion: "V16.0",
          bizFlowInstanceId: "",
          vendor: vendor //供应商
        });
      }
      let redOrderBillBody = {
        _status: "Insert",
        source_id: invoiceId,
        source_billtype: "voucher_saleinvoice",
        bizFlowId: "yourIdHere",
        bizFlowName: "发票->红字订单",
        bizFlowVersion: "V16.0",
        bizFlowInstanceId: "",
        org_id: resDataObj.salesOrgId,
        invoiceId: invoiceId,
        invoiceCode: invoiceCode,
        vouchdate: resDataObj.vouchdate, //单据日期
        saleOrderBillCode: SaleOrderCode, //销售订单编码(蓝字)
        saleOrderBillId: SaleOrderId, //销售订单ID
        corpContact: resDataObj.corpContact, //业务员
        transactionTypeId: resDataObj.transactionTypeId, //交易类型
        agentId: resDataObj.agentId, //客户
        originalName: resDataObj.orderPrices.originalName, //原币名称
        originalCode: resDataObj.orderPrices.originalCode, //原币Code
        salesOrgId: resDataObj.salesOrgId, //销售组织
        settlementOrgId: resDataObj.settlementOrgId, //财务组织
        exchRate: resDataObj.orderPrices.exchRate, //汇率
        saleDepartmentId: resDataObj.saleDepartmentId, //销售部门
        RedSaleOrderDetailList: redOrderDetailList
      };
      let insertRes = ObjectStore.insert("GT3734AT5.GT3734AT5.RedSaleOrderBill", redOrderBillBody, "1e5389cb");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });