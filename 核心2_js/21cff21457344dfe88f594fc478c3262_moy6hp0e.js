let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      let sql = "";
      let header = {
        "x-cdata-authtoken": "3q1S2b7m2J3p2l2K8w3a",
        "Content-Type": "application/xml",
        Cookie: "ASP.NET_SessionId=t2ptyinycvyuxy25wn2oekar"
      };
      let code = param.data[0].code; //销售发票编码
      sql =
        "select b.oriUnitPrice oriUnitPrice,c.code agentcode,agentId,issuedTaxMoney,natMoney,natSum,oriMoney,oriSum,currencyCode,taxRate,vouchdate,code,b.taxRate dettaxRate,b.invoiceSource invoiceSource,b.srcVoucherNo srcVoucherNo,b.firstupcode firstupcode,b.firstlineno firstlineno,b.qty qty,b.unitName unitName,b.oriSum DetailoriSum,b.oriTaxUnitPrice detoriTaxUnitPrice,b.unitName detunitName from voucher.invoice.SaleInvoice inner join voucher.invoice.SaleInvoiceDetail b on id=b.mainid left join aa.merchant.Merchant c on c.id=agentId  where code='" +
        code +
        "'";
      let dt = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售发票编码
      let { vouchdate, agentcode, taxRate, invoiceSource, firstupcode, srcVoucherNo, currencyCode, oriMoney, oriSum } = dt[0] || {};
      let CustomerCode = agentcode; //客户编码
      sql = "select code SaleoutCode,vouchdate Saleoutvouchdate from  st.salesout.SalesOut  where code='" + srcVoucherNo + "'";
      let dt2 = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库
      sql =
        "select  pr.erpCode erpCode,code OrderCode,vouchdate Ordervouchdate, c.productName productName,c.productId productId,b.define9 Orderdefine9,b.define14 Orderdefine14,b.define10 Orderdefine10,b.define11 Orderdefine11,b.define12 Orderdefine12,b.define13 Orderdefine13,c.lineno lineno,c.cBizName, d.define10 OrderDetaildefine10,d.define20 OrderDetaildefine20  from voucher.order.Order inner join voucher.order.OrderFreeDefine b on b.id=id     left join voucher.order.OrderDetail c on c.orderId=id inner join  voucher.order.OrderDetailFreeDefine d on d.id=c.id  left join  pc.product.Product pr on pr.id=c.productId  where code='" +
        firstupcode +
        "'";
      let dt1 = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售订单
      let { SaleoutCode, Saleoutvouchdate } = dt2[0] || {};
      sql = "select name,code,a.define1 define1, a.define2 define2,a.define3 define3 from aa.merchant.Merchant inner join  aa.merchant.MerchantDefine a on a.id=id where code='" + CustomerCode + "'";
      let dt5 = ObjectStore.queryByYonQL(sql, "productcenter"); //客户档案
      let { define1, define2, name, define3 } = dt5[0] || {}; //define2 津贴   define1 物料行津贴  define3 现金折扣
      if (!define1) {
        define1 = 0;
      }
      if (!define2) {
        define2 = 0;
      }
      if (!define3) {
        define3 = 0;
      }
      let xmlStr = "";
      xmlStr += "<Items>";
      xmlStr += "  <InvoiceHeader>";
      xmlStr += "    <CustomerName>" + (CustomerCode || "") + "</CustomerName>";
      xmlStr += "    <InvoiceType>" + "380" + "</InvoiceType>";
      xmlStr += "    <InvoiceNumber>" + (code || "") + "</InvoiceNumber>";
      xmlStr += "    <InvoiceDate>" + (this.formatDateTimeStr(vouchdate) || "") + "</InvoiceDate>";
      xmlStr += "    <ActualDeliveryDate>" + (this.formatDateTimeStr(Saleoutvouchdate) || "") + "</ActualDeliveryDate>";
      xmlStr += "    <DeliveryNoteNumber>" + (srcVoucherNo || "") + "</DeliveryNoteNumber>";
      xmlStr += "    <DeliveryNoteDate>" + (this.formatDateTimeStr(Saleoutvouchdate) || "") + "</DeliveryNoteDate>";
      xmlStr += "    <OrderNumber>" + (dt1[0].Orderdefine13 || "") + "</OrderNumber>";
      xmlStr += "    <OrderDate>" + (this.formatDateTimeStr(dt1[0].Ordervouchdate) || "") + "</OrderDate>";
      xmlStr += "    <InvoiceListNumber>" + (code || "") + "</InvoiceListNumber>";
      xmlStr += "    <InvoiceListDate>" + (this.formatDateTimeStr(vouchdate) || "") + "</InvoiceListDate>";
      xmlStr += "    <AgreementNumber>" + ("10" || "") + "</AgreementNumber>";
      xmlStr += "    <BuyerGLN>" + (dt1[0].Orderdefine11 || "") + "</BuyerGLN>";
      xmlStr += "    <DeliveryGLN>" + (dt1[0].Orderdefine12 || "") + "</DeliveryGLN>";
      xmlStr += "    <SupplierGLN>" + (dt1[0].Orderdefine10 || "") + "</SupplierGLN>";
      let upname = name.toLowerCase(); //客户名称
      if (upname.indexOf("metro") != -1) {
        xmlStr += "    <InvoiceeGLN>" + (dt1[0].Orderdefine14 || "") + "</InvoiceeGLN>";
      } else if (upname.indexOf("edeka") != -1) {
        xmlStr += "    <InvoiceeGLN>" + (dt1[0].Orderdefine11 || "") + "</InvoiceeGLN>";
      } else if (upname.indexOf("transgourmet") != -1) {
        xmlStr += "    <InvoiceeGLN>" + ("4388040000003" || "") + "</InvoiceeGLN>";
      }
      xmlStr += "    <SupplierTaxNumber>" + ("12858045755" || "") + "</SupplierTaxNumber>";
      xmlStr += "    <SupplierVATNumber>" + ("DE252118144" || "") + "</SupplierVATNumber>";
      xmlStr += "    <SupplierInternalNumber>" + (CustomerCode || "") + "</SupplierInternalNumber>";
      xmlStr += "    <PriceConditions>" + ("ST3" || "") + "</PriceConditions>";
      xmlStr += "    <PayerGLN>" + (dt1[0].Orderdefine11 || "") + "</PayerGLN>";
      xmlStr += "    <TaxRate>" + ("19" || "0") + "</TaxRate>";
      xmlStr += "    <TaxCategory>" + ("S" || "E") + "</TaxCategory>";
      xmlStr += "    <CurrencyCode>" + param.data[0].currency_code + "</CurrencyCode>";
      xmlStr += "    <AccountingInformation>" + ("BA" || "") + "</AccountingInformation>";
      xmlStr += "    <AllowanceChargeQualifier>" + ("A" || "") + "</AllowanceChargeQualifier>";
      xmlStr += "    <AllowanceChargeDescCode>" + ("EAB" || "") + "</AllowanceChargeDescCode>";
      let asnDetail = [{}];
      let lineTotalAmount = 0.0;
      for (var i = 0; i < dt.length; i++) {
        let detail = dt1.find((item) => item.lineno == dt[i].firstlineno);
        let { oriUnitPrice } = dt[i];
        xmlStr += "    <InvoiceDetail>";
        xmlStr += "      <ItemLineNo>" + (detail.lineno || "") + "</ItemLineNo>";
        xmlStr += "      <GTIN>" + (detail.OrderDetaildefine10 || "") + "</GTIN>";
        xmlStr += "      <SupplierItemNumber>" + (detail.erpCode || "") + "</SupplierItemNumber>"; //物料档案SAPcode
        xmlStr += "      <ItemDescription>" + (detail.productName || "") + "</ItemDescription>"; //物料名称
        xmlStr += "      <InvoicedQuantity>" + dt[i].qty + "</InvoicedQuantity>";
        xmlStr += "      <QuantityUnit>" + (dt[i].unitName || "") + "</QuantityUnit>";
        let allowanceChargeBasis = (oriUnitPrice * dt[i].qty).toFixed(2);
        let allowanceChargeAmount = (allowanceChargeBasis * define1 * 0.01).toFixed(2);
        let lineItemAmount = (allowanceChargeBasis - allowanceChargeAmount).toFixed(2);
        lineTotalAmount += Number(lineItemAmount);
        xmlStr += "      <LineItemAmount>" + lineItemAmount + "</LineItemAmount>";
        xmlStr += "      <UnitGrossPrice>" + oriUnitPrice + "</UnitGrossPrice>";
        xmlStr += "      <UnitPriceBasis>" + ("1" || "") + "</UnitPriceBasis>";
        xmlStr += "      <MeasureUnit>" + (dt[i].detunitName || "") + "</MeasureUnit>";
        xmlStr += "      <TaxRate>" + "19" + "</TaxRate>";
        xmlStr += "      <TaxCategory>" + ("S" || "") + "</TaxCategory>";
        xmlStr += "      <AllowanceChargeQualifier>" + ("A" || "") + "</AllowanceChargeQualifier>";
        xmlStr += "      <AllowanceChargeDescCode>" + ("DI" || "") + "</AllowanceChargeDescCode>";
        //计算
        if (define1 || define1 == 0) {
          xmlStr += "      <ItemTotalAllowanceChargeAmount>" + (-allowanceChargeAmount || "0") + "</ItemTotalAllowanceChargeAmount>";
          xmlStr += "      <AllowanceChargePercentage>" + (define1 || "0") + "</AllowanceChargePercentage>";
          xmlStr += "      <AllowanceChargeAmount>" + (allowanceChargeAmount || "0") + "</AllowanceChargeAmount>";
          xmlStr += "      <AllowanceChargeBasis>" + (allowanceChargeBasis || "0") + "</AllowanceChargeBasis>";
        } else {
          xmlStr += "      <ItemTotalAllowanceChargeAmount>" + ("" || "0") + "</ItemTotalAllowanceChargeAmount>";
          xmlStr += "      <AllowanceChargePercentage>" + ("" || "0") + "</AllowanceChargePercentage>";
          xmlStr += "      <AllowanceChargeAmount>" + ("" || "0") + "</AllowanceChargeAmount>";
          xmlStr += "      <AllowanceChargeBasis>" + (allowanceChargeBasis || "0") + "</AllowanceChargeBasis>";
        }
        xmlStr += "    </InvoiceDetail>";
      }
      xmlStr += "    <LineTotalAmount>" + lineTotalAmount.toFixed(2) + "</LineTotalAmount>";
      let totalAllowanceChargeAmount = Number((lineTotalAmount * define2 * 0.01).toFixed(2));
      xmlStr += "    <AllowanceChargeBasis>" + (lineTotalAmount || "0").toFixed(2) + "</AllowanceChargeBasis>";
      if (upname.indexOf("edeka") != -1) {
        //新增字段
        xmlStr += "    <CashDiscountPercentage>" + (define3 || 0) + "</CashDiscountPercentage>";
        let CashDiscountBasis = Number((lineTotalAmount - totalAllowanceChargeAmount).toFixed(2));
        xmlStr += "    <CashDiscountBasis>" + (CashDiscountBasis || 0) + "</CashDiscountBasis>";
        let CashDiscountAmount = Number((CashDiscountBasis * define3 * 0.01).toFixed(2)); //现金折扣
        let InvoiceTotalTaxableAmount = Number((CashDiscountBasis - CashDiscountAmount).toFixed(2));
        xmlStr += "    <CashDiscountAmount>" + (CashDiscountAmount || "0") + "</CashDiscountAmount>";
        let allTotalAll = Number((totalAllowanceChargeAmount + CashDiscountAmount).toFixed(2));
        xmlStr += "    <TotalAllowanceChargeAmount>" + (-allTotalAll || "0") + "</TotalAllowanceChargeAmount>";
        xmlStr += "    <AllowanceChargeAmount>" + (totalAllowanceChargeAmount || "0") + "</AllowanceChargeAmount>";
        //计算
        if (define2 || define2 == 0) {
          xmlStr += "    <AllowanceChargePercentage>" + (define2 || "0") + "</AllowanceChargePercentage>";
        } else {
          xmlStr += "    <AllowanceChargePercentage>" + ("" || "") + "</AllowanceChargePercentage>";
          xmlStr += "    <AllowanceChargeAmount>" + ("" || "") + "</AllowanceChargeAmount>";
          xmlStr += "    <AllowanceChargeBasis>" + ("" || "") + "</AllowanceChargeBasis>";
          xmlStr += "    <TotalAllowanceChargeAmount>" + ("" || "") + "</TotalAllowanceChargeAmount>";
        }
        xmlStr += "    <InvoiceTotalTaxableAmount>" + InvoiceTotalTaxableAmount + "</InvoiceTotalTaxableAmount>";
        let InvoiceTotalTaxAmount = Number((InvoiceTotalTaxableAmount * 0.19).toFixed(2));
        xmlStr += "    <InvoiceTotalTaxAmount>" + InvoiceTotalTaxAmount + "</InvoiceTotalTaxAmount>";
        xmlStr += "    <InvoiceTotalAmount>" + (InvoiceTotalTaxableAmount + InvoiceTotalTaxAmount).toFixed(2) + "</InvoiceTotalAmount>";
        xmlStr += "  </InvoiceHeader>";
        xmlStr += "</Items>";
      } else {
        xmlStr += "    <TotalAllowanceChargeAmount>" + (-totalAllowanceChargeAmount || "0") + "</TotalAllowanceChargeAmount>";
        xmlStr += "    <AllowanceChargeAmount>" + (totalAllowanceChargeAmount || "0") + "</AllowanceChargeAmount>";
        //计算
        if (define2 || define2 == 0) {
          xmlStr += "    <AllowanceChargePercentage>" + (define2 || "0") + "</AllowanceChargePercentage>";
        } else {
          xmlStr += "    <AllowanceChargePercentage>" + ("" || "") + "</AllowanceChargePercentage>";
          xmlStr += "    <AllowanceChargeAmount>" + ("" || "") + "</AllowanceChargeAmount>";
          xmlStr += "    <AllowanceChargeBasis>" + ("" || "") + "</AllowanceChargeBasis>";
          xmlStr += "    <TotalAllowanceChargeAmount>" + ("" || "") + "</TotalAllowanceChargeAmount>";
        }
        let InvoiceTotalTaxableAmount = Number((lineTotalAmount - totalAllowanceChargeAmount).toFixed(2));
        xmlStr += "    <InvoiceTotalTaxableAmount>" + InvoiceTotalTaxableAmount + "</InvoiceTotalTaxableAmount>";
        let InvoiceTotalTaxAmount = Number((InvoiceTotalTaxableAmount * 0.19).toFixed(2));
        xmlStr += "    <InvoiceTotalTaxAmount>" + InvoiceTotalTaxAmount + "</InvoiceTotalTaxAmount>";
        xmlStr += "    <InvoiceTotalAmount>" + (InvoiceTotalTaxableAmount + InvoiceTotalTaxAmount).toFixed(2) + "</InvoiceTotalAmount>";
        xmlStr += "  </InvoiceHeader>";
        xmlStr += "</Items>";
      }
      let SupplierGLN = dt1[0].Orderdefine12;
      let ly = dt1[0].Orderdefine9;
      console.log("供应商GLN=" + SupplierGLN);
      console.log("系统来源=" + ly);
      if (ly == "EDI") {
        console.log("xmlStr=" + xmlStr);
        apiResponse = postman("post", "http://159.75.254.235:8001/connector/WebhookTest/webhook.rsb", JSON.stringify(header), xmlStr);
      }
      return {};
    } catch (e) {
    }
  }
  // 格式时间字符串
  formatDateTimeStr(date, type = 1) {
    if (date === "" || !date) {
      return "";
    }
    var dateObject = new Date(date);
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
      return y + "" + m + "" + d;
    } else if (type === 2) {
      // 返回年月日 时分秒
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    }
  }
}
exports({ entryPoint: MyTrigger });