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
        "select b.saleInvoiceDetailDefineCharacter saleInvoiceDetailDefineCharacter,saleInvoiceDefineCharacter saleInvoiceDefineCharacter,prd.code productCode,b.oriUnitPrice oriUnitPrice,b.salePrice salePrice,c.code agentcode,agentId,issuedTaxMoney,natMoney,natSum,oriMoney,oriTax,oriSum,currencyCode,taxRate,vouchdate,code,b.taxRate dettaxRate,b.invoiceSource invoiceSource,b.srcVoucherNo srcVoucherNo,b.firstupcode firstupcode,b.firstlineno firstlineno,b.qty qty,b.unitName unitName,b.oriSum DetailoriSum,b.oriMoney DetailoriMoney,b.oriTaxUnitPrice detoriTaxUnitPrice,b.unitName detunitName,b.oriTax deoriTax from voucher.invoice.SaleInvoice inner join voucher.invoice.SaleInvoiceDetail b on id=b.mainid left join aa.merchant.Merchant c on c.id=agentId  left join pc.product.Product prd on prd.id=b.productId  where code='" +
        code +
        "'";
      let dt = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售发票编码
      let { vouchdate, agentcode, taxRate, invoiceSource, firstupcode, srcVoucherNo, currencyCode, oriMoney, oriSum, oriTax } = dt[0] || {};
      let CustomerCode = agentcode; //客户编码
      sql = "select code SaleoutCode,vouchdate Saleoutvouchdate from  st.salesout.SalesOut  where code='" + srcVoucherNo + "'";
      let dt2 = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库
      sql =
        "select  pr.erpCode erpCode,code OrderCode,vouchdate Ordervouchdate, c.productName productName,c.productId productId, orderDefineCharacter orderDefineCharacter,c.lineno lineno,c.cBizName, c.orderDetailDefineCharacter orderDetailDefineCharacter  from voucher.order.Order left join voucher.order.OrderDetail c on c.orderId=id left join  pc.product.Product pr on pr.id=c.productId    where code='" +
        firstupcode +
        "'";
      let dt1 = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售订单
      //来源
      let { attrext63: Orderdefine12, attrext82: Orderdefine8 } = dt1[0].orderDefineCharacter || {};
      let SupplierGLN = Orderdefine12 || ""; //交付方GLN编号
      let ly = Orderdefine8 || ""; //来源系统
      console.log("供应商GLN=" + SupplierGLN);
      console.log("系统来源=" + ly);
      if (ly == "EDI") {
        let { SaleoutCode, Saleoutvouchdate } = dt2[0] || {};
        sql = "select name,code,merchantCharacter from aa.merchant.Merchant where code='" + CustomerCode + "'";
        let dt5 = ObjectStore.queryByYonQL(sql, "productcenter"); //客户档案
        let { name } = dt5[0] || {}; //客户名称
        let {
          attrext71: define2,
          attrext78: define3,
          attrext106: adefine21,
          attrext107: adefine22,
          NoCashDiscountDueDate,
          CashDiscountDueDate,
          PaymentTermsDay
        } = dt[0].saleInvoiceDefineCharacter || {}; //define2 津贴    define3 现金折扣 来源销售订单 define21 (折扣后无税金额)折扣基数  define22 整单折扣金额
        if (!define2) {
          define2 = 0;
        }
        if (!define3) {
          define3 = 0;
        }
        let codenoSt = (code || "").replace("SI", "");
        let { attrext69: Orderdefine13, attrext64: Orderdefine11, attrext63: Orderdefine12, attrext65: Orderdefine10, attrext74: Orderdefine14 } = dt1[0].orderDefineCharacter || {};
        let ediRequest = {
          CustomerName: CustomerCode,
          InvoiceType: "380",
          InvoiceNumber: code || "",
          InvoiceDate: this.formatDateTimeStr(vouchdate) || "",
          ActualDeliveryDate: this.formatDateTimeStr(Saleoutvouchdate) || "",
          DeliveryNoteNumber: srcVoucherNo || "",
          DeliveryNoteDate: this.formatDateTimeStr(Saleoutvouchdate) || "",
          OrderNumber: Orderdefine13 || "", //edi单号
          OrderDate: this.formatDateTimeStr(dt1[0].Ordervouchdate) || "",
          InvoiceListNumber: codenoSt,
          InvoiceListDate: this.formatDateTimeStr(vouchdate) || "",
          AgreementNumber: "10" || "",
          BuyerGLN: Orderdefine11 || "", //买方
          DeliveryGLN: Orderdefine12 || "", //收货方 交付方GLN编号
          SupplierGLN: Orderdefine10 || "", //供应商GLN编号
          InvoiceeGLN: "",
          SupplierTaxNumber: "12858045755" || "",
          SupplierVATNumber: "DE252118144" || "",
          SupplierInternalNumber: CustomerCode || "",
          PriceConditions: "ST3" || "",
          PayerGLN: Orderdefine11 || "",
          TaxCategory: "S" || "E",
          CurrencyCode: param.data[0].currency_code,
          AccountingInformation: "BA" || "",
          AllowanceChargeQualifier: "A" || "",
          AllowanceChargeDescCode: "EAB" || "",
          LineTotalAmount: adefine21, //发票行项目总额
          AllowanceChargeBasis: adefine21, //津贴/收费基数
          CashDiscountAmount: 0, //现金折扣金额
          CashDiscountBasis: 0, //现金折扣基数
          CashDiscountPercentage: Number(define3) || 0, //新增字段 再加3%的现金折扣
          TaxRate: 19,
          AllowanceChargePercentage: Number(define2) || 0, //津贴/收费百分比
          TotalAllowanceChargeAmount: adefine22, //总收费/津贴金额
          AllowanceChargeAmount: adefine22, //津贴/收费金额
          InvoiceTotalTaxableAmount: Number((Number(oriSum) - Number(oriTax)).toFixed(2)), //发票应税金额  //554.99
          InvoiceTotalTaxAmount: oriTax, //发票总税额
          InvoiceTotalAmount: oriSum, //发票总金额 --总金额
          //新增字段
          FreightCharge: 0, //运费
          PaymentTermsDay: PaymentTermsDay || "", //支付天数
          NoCashDiscountDueDate: NoCashDiscountDueDate || "", //无现金折扣到期日期
          CashDiscountDueDate: CashDiscountDueDate || "", //现金折扣到期日期
          InvoiceDetail: []
        };
        let totalAllowanceChargeAmount = Number((Number(adefine21) * Number(ediRequest.AllowanceChargePercentage) * 0.01).toFixed(2)); //整单折扣
        //先整单折扣在现金折扣
        //是否有现金折扣
        if (ediRequest.CashDiscountPercentage) {
          ediRequest.CashDiscountBasis = Number((Number(adefine21) - Number(totalAllowanceChargeAmount)).toFixed(2)); //现金折扣基数 发票应税金额/折扣
          ediRequest.CashDiscountAmount = Number((Number(adefine22) - Number(totalAllowanceChargeAmount)).toFixed(2)); //现金折扣
        } else {
          totalAllowanceChargeAmount = Number(adefine22);
        }
        ediRequest.AllowanceChargeAmount = totalAllowanceChargeAmount;
        let upname = name.toLowerCase(); //客户名称
        if (upname.indexOf("metro") != -1) {
          ediRequest.InvoiceeGLN = Orderdefine14 || ""; //发票收取方GLN编号
        } else if (upname.indexOf("edeka") != -1) {
          ediRequest.InvoiceeGLN = Orderdefine11 || "";
        } else if (upname.indexOf("transgourmet") != -1) {
          ediRequest.InvoiceeGLN = "4388040000003" || "";
        }
        let FreightCharge = 0.0; //运费
        for (var i = 0; i < dt.length; i++) {
          let saleInvoiceDetailDefineCharacter = dt[i].saleInvoiceDetailDefineCharacter || {};
          let define1 = saleInvoiceDetailDefineCharacter.attrext109 || 0; //物料行津贴
          let LineItemAmount = Number(Number(saleInvoiceDetailDefineCharacter.attrext111 || 0).toFixed(2)); //折后金额
          //是否运费
          let isYf = false;
          if (dt[i].productCode == "40006") {
            isYf = true;
            define1 = 0;
            FreightCharge += Number(LineItemAmount);
          }
          let price = saleInvoiceDetailDefineCharacter.attrext108 || 0; //折前 无税单价
          //物料行津贴基数
          let AllowanceChargeBasisitem = Number((Number(price) * Number(dt[i].qty)).toFixed(2)); //折前金额
          if (define1 == 0) {
            LineItemAmount = AllowanceChargeBasisitem; //折后金额
          }
          let AllowanceChargeAmount = Number(Number((AllowanceChargeBasisitem - LineItemAmount).toFixed(2)).toFixed(2)); //优惠金额
          let detail = dt1.find((item) => item.lineno == dt[i].firstlineno);
          let orderDetailDefineCharacter01 = detail.orderDetailDefineCharacter || {}; //销售订单表体自定义项
          let item = {
            ItemLineNo: detail.lineno || "", //物料行号
            GTIN: orderDetailDefineCharacter01.attrext66 || "", //GTIN物料编号
            SupplierItemNumber: detail.erpCode || "",
            ItemDescription: detail.productName || "",
            InvoicedQuantity: dt[i].qty, //开票数量
            QuantityUnit: dt[i].unitName || "", //计量单位
            TaxRate: 19, //税率
            TaxCategory: "S" || "", //税率类别
            AllowanceChargeQualifier: "A" || "", //物料行津贴代码
            AllowanceChargeDescCode: "DI" || "", //物料行津贴/收费代码描述
            LineItemAmount: LineItemAmount, //行物料金额
            UnitGrossPrice: price, //毛单价 不含税
            UnitPriceBasis: "1" || "", //价格基数
            MeasureUnit: dt[i].detunitName || "", //计量单位
            ItemTotalAllowanceChargeAmount: -AllowanceChargeAmount, //行物料津贴/收费总金额
            AllowanceChargePercentage: define1 || "0", //物料行津贴/
            AllowanceChargeAmount: AllowanceChargeAmount, //物料行津贴/收费金额
            AllowanceChargeBasis: AllowanceChargeBasisitem, //物料行津贴/收费基数
            //新增字段
            UnitNetPrice: price, //折前无税单价
            LineTotalTaxAmount: dt[i].deoriTax //折前无税单价 行总税额
          };
          if (dt[i].productCode != "40006") {
            ediRequest.InvoiceDetail.push(item);
          }
        }
        FreightCharge.toFixed(2);
        ediRequest.FreightCharge = FreightCharge;
        ediRequest.LineTotalAmount = (Number(ediRequest.LineTotalAmount) - Number(ediRequest.FreightCharge)).toFixed(2);
        console.log("供应商GLN=" + SupplierGLN);
        console.log("系统来源=" + ly);
        //拼接xml
        let xmlStr = "";
        xmlStr += "<Items>";
        xmlStr += "  <InvoiceHeader>";
        xmlStr += "    <CustomerName>" + ediRequest.CustomerName + "</CustomerName>";
        xmlStr += "    <InvoiceType>" + ediRequest.InvoiceType + "</InvoiceType>";
        xmlStr += "    <InvoiceNumber>" + ediRequest.InvoiceNumber + "</InvoiceNumber>";
        xmlStr += "    <InvoiceDate>" + ediRequest.InvoiceDate + "</InvoiceDate>";
        xmlStr += "    <ActualDeliveryDate>" + ediRequest.ActualDeliveryDate + "</ActualDeliveryDate>";
        xmlStr += "    <BuyerGLN>" + ediRequest.BuyerGLN + "</BuyerGLN>";
        xmlStr += "    <DeliveryGLN>" + ediRequest.DeliveryGLN + "</DeliveryGLN>";
        xmlStr += "    <DeliveryNoteNumber>" + ediRequest.DeliveryNoteNumber + "</DeliveryNoteNumber>";
        xmlStr += "    <DeliveryNoteDate>" + ediRequest.DeliveryNoteDate + "</DeliveryNoteDate>";
        xmlStr += "    <OrderNumber>" + ediRequest.OrderNumber + "</OrderNumber>";
        xmlStr += "    <OrderDate>" + ediRequest.OrderDate + "</OrderDate>";
        xmlStr += "    <InvoiceListNumber>" + ediRequest.InvoiceListNumber + "</InvoiceListNumber>";
        xmlStr += "    <InvoiceListDate>" + ediRequest.InvoiceListDate + "</InvoiceListDate>";
        xmlStr += "    <AgreementNumber>" + ediRequest.AgreementNumber + "</AgreementNumber>";
        xmlStr += "    <SupplierGLN>" + ediRequest.SupplierGLN + "</SupplierGLN>";
        xmlStr += "    <SupplierTaxNumber>" + ediRequest.SupplierTaxNumber + "</SupplierTaxNumber>";
        xmlStr += "    <SupplierVATNumber>" + ediRequest.SupplierVATNumber + "</SupplierVATNumber>";
        xmlStr += "    <SupplierInternalNumber>" + ediRequest.SupplierInternalNumber + "</SupplierInternalNumber>";
        xmlStr += "    <PriceConditions>" + ediRequest.PriceConditions + "</PriceConditions>";
        xmlStr += "    <SupplierInternalNumber>" + ediRequest.SupplierInternalNumber + "</SupplierInternalNumber>";
        xmlStr += "    <InvoiceeGLN>" + ediRequest.InvoiceeGLN + "</InvoiceeGLN>";
        xmlStr += "    <PayerGLN>" + ediRequest.PayerGLN + "</PayerGLN>";
        xmlStr += "    <TaxRate>" + ediRequest.TaxRate + "</TaxRate>";
        xmlStr += "    <TaxCategory>" + ediRequest.TaxCategory + "</TaxCategory>";
        xmlStr += "    <CurrencyCode>" + ediRequest.CurrencyCode + "</CurrencyCode>";
        xmlStr += "    <AccountingInformation>" + ediRequest.AccountingInformation + "</AccountingInformation>";
        xmlStr += "    <AllowanceChargeQualifier>" + ediRequest.AllowanceChargeQualifier + "</AllowanceChargeQualifier>";
        xmlStr += "    <AllowanceChargeDescCode>" + ediRequest.AllowanceChargeDescCode + "</AllowanceChargeDescCode>";
        xmlStr += "    <LineTotalAmount>" + ediRequest.LineTotalAmount + "</LineTotalAmount>";
        xmlStr += "    <AllowanceChargeBasis>" + ediRequest.AllowanceChargeBasis + "</AllowanceChargeBasis>";
        xmlStr += "    <TotalAllowanceChargeAmount>" + -ediRequest.TotalAllowanceChargeAmount + "</TotalAllowanceChargeAmount>";
        xmlStr += "    <AllowanceChargeAmount>" + ediRequest.AllowanceChargeAmount + "</AllowanceChargeAmount>";
        xmlStr += "    <AllowanceChargePercentage>" + ediRequest.AllowanceChargePercentage + "</AllowanceChargePercentage>";
        xmlStr += "    <InvoiceTotalTaxableAmount>" + ediRequest.InvoiceTotalTaxableAmount + "</InvoiceTotalTaxableAmount>";
        xmlStr += "    <InvoiceTotalTaxAmount>" + ediRequest.InvoiceTotalTaxAmount + "</InvoiceTotalTaxAmount>";
        xmlStr += "    <InvoiceTotalAmount>" + ediRequest.InvoiceTotalAmount + "</InvoiceTotalAmount>";
        xmlStr += "    <CashDiscountPercentage>" + ediRequest.CashDiscountPercentage + "</CashDiscountPercentage>";
        xmlStr += "    <CashDiscountAmount>" + ediRequest.CashDiscountAmount + "</CashDiscountAmount>";
        xmlStr += "    <CashDiscountBasis>" + ediRequest.CashDiscountBasis + "</CashDiscountBasis>";
        console.log("推送=000-1");
        //新增字段
        xmlStr += "    <FreightCharge>" + (ediRequest.FreightCharge || "") + "</FreightCharge>"; //运费
        xmlStr += "    <PaymentTermsDay>" + (ediRequest.PaymentTermsDay || "") + "</PaymentTermsDay>"; //支付天数
        xmlStr += "    <NoCashDiscountDueDate>" + (ediRequest.NoCashDiscountDueDate || "") + "</NoCashDiscountDueDate>"; //无现金折扣到期日期
        xmlStr += "    <CashDiscountDueDate>" + (ediRequest.CashDiscountDueDate || "") + "</CashDiscountDueDate>"; //现金折扣到期日期
        console.log("推送=000");
        ediRequest.InvoiceDetail.map((v) => {
          xmlStr += "    <InvoiceDetail>";
          xmlStr += "      <ItemLineNo>" + (v.ItemLineNo || "") + "</ItemLineNo>";
          xmlStr += "      <GTIN>" + (v.GTIN || "") + "</GTIN>";
          xmlStr += "      <SupplierItemNumber>" + (v.SupplierItemNumber || "") + "</SupplierItemNumber>";
          xmlStr += "      <ItemDescription>" + (v.ItemDescription || "") + "</ItemDescription>";
          xmlStr += "      <InvoicedQuantity>" + (v.InvoicedQuantity || "") + "</InvoicedQuantity>";
          xmlStr += "      <QuantityUnit>" + (v.QuantityUnit || "") + "</QuantityUnit>";
          xmlStr += "      <LineItemAmount>" + (v.LineItemAmount || "") + "</LineItemAmount>";
          xmlStr += "      <UnitGrossPrice>" + (v.UnitGrossPrice || "") + "</UnitGrossPrice>";
          xmlStr += "      <UnitPriceBasis>" + (v.UnitPriceBasis || "") + "</UnitPriceBasis>";
          xmlStr += "      <MeasureUnit>" + (v.MeasureUnit || "") + "</MeasureUnit>";
          xmlStr += "      <TaxRate>" + (v.TaxRate || "") + "</TaxRate>";
          xmlStr += "      <TaxCategory>" + (v.TaxCategory || "") + "</TaxCategory>";
          xmlStr += "      <AllowanceChargeQualifier>" + (v.AllowanceChargeQualifier || "") + "</AllowanceChargeQualifier>";
          xmlStr += "      <AllowanceChargeDescCode>" + (v.AllowanceChargeDescCode || "") + "</AllowanceChargeDescCode>";
          xmlStr += "      <ItemTotalAllowanceChargeAmount>" + (v.ItemTotalAllowanceChargeAmount || "") + "</ItemTotalAllowanceChargeAmount>";
          xmlStr += "      <AllowanceChargePercentage>" + (v.AllowanceChargePercentage || "") + "</AllowanceChargePercentage>";
          xmlStr += "      <AllowanceChargeAmount>" + (v.AllowanceChargeAmount || "") + "</AllowanceChargeAmount>";
          xmlStr += "      <AllowanceChargeBasis>" + (v.AllowanceChargeBasis || "") + "</AllowanceChargeBasis>";
          //新增字段
          xmlStr += "      <UnitNetPrice>" + (v.UnitNetPrice || "") + "</UnitNetPrice>"; //折前无税单价
          xmlStr += "      <LineTotalTaxAmount>" + (v.LineTotalTaxAmount || "") + "</LineTotalTaxAmount>"; //行总税额
          xmlStr += "      </InvoiceDetail>";
        });
        xmlStr += "  </InvoiceHeader>";
        xmlStr += "</Items>";
        console.log("推送=111");
        if (ly == "EDI") {
          console.log("json-----" + JSON.stringify(ediRequest));
          console.log("xmlStr=" + xmlStr);
          apiResponse = postman("post", "http://159.75.254.235:8001/connector/WebhookTest/webhook.rsb", JSON.stringify(header), xmlStr);
        }
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