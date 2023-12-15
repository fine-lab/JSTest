let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      console.log(context);
      console.log(param);
      let sql = "";
      let header = {
        "x-cdata-authtoken": "3q1S2b7m2J3p2l2K8w3a",
        "Content-Type": "application/xml",
        Cookie: "ASP.NET_SessionId=t2ptyinycvyuxy25wn2oekar"
      };
      let code = param.data[0].code; //销售发票编码
      sql =
        "select c.code agentcode,agentId,issuedTaxMoney,natMoney,natSum,oriMoney,oriSum,currencyCode,taxRate,vouchdate,code,b.taxRate dettaxRate,b.invoiceSource invoiceSource,b.srcVoucherNo srcVoucherNo,b.firstupcode firstupcode,b.firstlineno firstlineno,b.qty qty,b.unitName unitName,b.oriSum DetailoriSum,b.oriTaxUnitPrice detoriTaxUnitPrice,b.unitName detunitName from voucher.invoice.SaleInvoice inner join voucher.invoice.SaleInvoiceDetail b on id=b.mainid left join aa.merchant.Merchant c on c.id=agentId  where code='" +
        code +
        "'";
      let dt = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售发票编码
      let { vouchdate, agentcode, taxRate, invoiceSource, firstupcode, srcVoucherNo, currencyCode, oriMoney, oriSum } = dt[0] || {};
      let CustomerName = agentcode; //客户编码
      sql = "select code SaleoutCode,vouchdate Saleoutvouchdate from  ia.saleout.SaleoutVO where code='" + srcVoucherNo + "'";
      let dt2 = ObjectStore.queryByYonQL(sql, "yonyoufi"); //销售出库
      sql =
        "select  code OrderCode,vouchdate Ordervouchdate,a.define10 Orderdefine10,a.define11 Orderdefine11,a.define12 Orderdefine12,a.define13 Orderdefine13,b.lineno lineno,b.cBizName,c.define10 OrderDetaildefine10 from voucher.order.Order left join voucher.order.OrderDefine a on id=a. orderId left join voucher.order.OrderDetail b on b.orderId=id left join voucher.order.OrderDetailDefine c on b.id=c.orderDetailId where code='" +
        firstupcode +
        "'";
      let dt1 = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售订单
      let { SaleoutCode, Saleoutvouchdate } = dt2[0] || {};
      let xmlStr = "";
      xmlStr += "<Items>";
      xmlStr += "  <InvoiceHeader>";
      xmlStr += "    <CustomerName>" + (CustomerName || "") + "</CustomerName>";
      xmlStr += "    <InvoiceType>" + param.data[0].invoiceType + "</InvoiceType>";
      xmlStr += "    <InvoiceNumber>" + (code || "") + "</InvoiceNumber>";
      xmlStr += "    <InvoiceDate>" + (vouchdate || "") + "</InvoiceDate>";
      xmlStr += "    <ActualDeliveryDate>" + (Saleoutvouchdate || "") + "</ActualDeliveryDate>";
      xmlStr += "    <DeliveryNoteNumber>" + (srcVoucherNo || "") + "</DeliveryNoteNumber>";
      xmlStr += "    <DeliveryNoteDate>" + (Saleoutvouchdate || "") + "</DeliveryNoteDate>";
      xmlStr += "    <OrderNumber>" + (dt1[0].Orderdefine13 || "") + "</OrderNumber>";
      xmlStr += "    <OrderDate>" + (dt1[0].Ordervouchdate || "") + "</OrderDate>";
      xmlStr += "    <InvoiceListNumber>" + (code || "") + "</InvoiceListNumber>";
      xmlStr += "    <InvoiceListDate>" + (vouchdate || "") + "</InvoiceListDate>";
      xmlStr += "    <AgreementNumber>" + (10 || "") + "</AgreementNumber>";
      xmlStr += "    <InvoiceRecipientGLN>" + (dt1[0].Orderdefine10 || "") + "</InvoiceRecipientGLN>";
      xmlStr += "    <GoodsRecipientGLN>" + (dt1[0].Orderdefine11 || "") + "</GoodsRecipientGLN>";
      xmlStr += "    <SupplierGLN>" + (dt1[0].Orderdefine12 || "") + "</SupplierGLN>";
      xmlStr += "    <SupplierTaxNumber>" + ("" || "") + "</SupplierTaxNumber>";
      xmlStr += "    <SupplierVATNumber>" + ("" || "") + "</SupplierVATNumber>";
      xmlStr += "    <SupplierInternalNumber>" + ("" || "") + "</SupplierInternalNumber>";
      xmlStr += "    <PriceConditions>" + ("ST3" || "") + "</PriceConditions>";
      xmlStr += "    <InvoiceeGLN>" + (dt1[0].Orderdefine10 || "") + "</InvoiceeGLN>";
      xmlStr += "    <PayerGLN>" + (dt1[0].Orderdefine10 || "") + "</PayerGLN>";
      xmlStr += "    <PayeeGLN>" + (dt1[0].Orderdefine10 || "") + "</PayeeGLN>";
      xmlStr += "    <TaxRate>" + ("19" || "") + "</TaxRate>";
      xmlStr += "    <TaxCategory>" + ("S" || "") + "</TaxCategory>";
      xmlStr += "    <CurrencyCode>" + (currencyCode || "") + "</CurrencyCode>";
      xmlStr += "    <AccountingInformation>" + ("BA" || "") + "</AccountingInformation>";
      xmlStr += "    <AllowanceChargeQualifier>" + ("" || "") + "</AllowanceChargeQualifier>";
      xmlStr += "    <AllowanceChargeDescCode>" + ("" || "") + "</AllowanceChargeDescCode>";
      xmlStr += "    <AllowanceChargePercentage>" + ("" || "") + "</AllowanceChargePercentage>";
      xmlStr += "    <AllowanceChargeAmount>" + ("" || "") + "</AllowanceChargeAmount>";
      xmlStr += "    <AllowanceChargeBasis>" + ("" || "") + "</AllowanceChargeBasis>";
      xmlStr += "    <InvoiceTotalAmount>" + (oriSum || "") + "</InvoiceTotalAmount>";
      xmlStr += "    <LineTotalAmount>" + (oriSum || "") + "</LineTotalAmount>";
      xmlStr += "    <InvoiceTotalTaxAmount>" + (oriSum - oriMoney || "") + "</InvoiceTotalTaxAmount>";
      xmlStr += "    <InvoiceTotalTaxableAmount>" + (oriSum - oriMoney || "") + "</InvoiceTotalTaxableAmount>";
      xmlStr += "    <TotalAllowanceChargeAmount>" + ("" || "") + "</TotalAllowanceChargeAmount>";
      let asnDetail = [{}];
      for (var i = 0; i < dt.length; i++) {
        let detail = dt1.find((item) => item.lineno == dt[i].firstlineno);
        xmlStr += "    <InvoiceDetail>";
        xmlStr += "      <ItemLineNo>" + (detail.lineno || "") + "</ItemLineNo>";
        xmlStr += "      <GTIN>" + (detail.OrderDetaildefine10 || "") + "</GTIN>";
        xmlStr += "      <SupplierItemNumber>" + ("" || "") + "</SupplierItemNumber>";
        xmlStr += "      <ItemDescription>" + ("" || "") + "</ItemDescription>";
        xmlStr += "      <InvoicedQuantity>" + (dt[i].qty || "") + "</InvoicedQuantity>";
        xmlStr += "      <QuantityUnit>" + (dt[i].unitName || "") + "</QuantityUnit>";
        xmlStr += "      <LineItemAmount>" + (dt[i].DetailoriSum || "") + "</LineItemAmount>";
        xmlStr += "      <ItemTotalAllowanceChargeAmount>" + ("" || "") + "</ItemTotalAllowanceChargeAmount>";
        xmlStr += "      <UnitGrossPrice>" + (dt[i].detoriTaxUnitPrice || "") + "</UnitGrossPrice>";
        xmlStr += "      <UnitPriceBasis>" + ("" || "") + "</UnitPriceBasis>";
        xmlStr += "      <MeasureUnit>" + (dt[i].detunitName || "") + "</MeasureUnit>";
        xmlStr += "      <TaxRate>" + (dt[i].dettaxRate || "") + "</TaxRate>";
        xmlStr += "      <TaxCategory>" + ("" || "") + "</TaxCategory>";
        xmlStr += "      <AllowanceChargeQualifier>" + ("" || "") + "</AllowanceChargeQualifier>";
        xmlStr += "      <AllowanceChargeDescCode>" + ("" || "") + "</AllowanceChargeDescCode>";
        xmlStr += "      <AllowanceChargePercentage>" + ("" || "") + "</AllowanceChargePercentage>";
        xmlStr += "      <AllowanceChargeAmount>" + ("" || "") + "</AllowanceChargeAmount>";
        xmlStr += "      <AllowanceChargeBasis>" + ("" || "") + "</AllowanceChargeBasis>";
        xmlStr += "    </InvoiceDetail>";
      }
      xmlStr += "  </InvoiceHeader>";
      xmlStr += "</Items>";
      apiResponse = postman("post", "http://159.75.254.235:8001/connector/WebhookTest/webhook.rsb", JSON.stringify(header), xmlStr);
      return {};
    } catch (e) {
    }
  }
}
exports({ entryPoint: MyTrigger });