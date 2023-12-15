let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let asnHeader = JSON.parse(param.requestData);
    let code = asnHeader.code;
    let cust_name = asnHeader.cust_name.toLowerCase();
    console.log(cust_name);
    if (1 == 1 && cust_name.indexOf("metro markets") != -1) {
      let apiResponse = "";
      let sql = "";
      let xml = "";
      try {
        let header = {
          "x-cdata-authtoken": "3q1S2b7m2J3p2l2K8w3a",
          "Content-Type": "application/xml",
          Cookie: "ASP.NET_SessionId=t2ptyinycvyuxy25wn2oekar"
        };
        sql = "select currency,cReceiver,cReceiveMobile,cReceiveAddress,cReceiveZipCode,vouchdate,srcBillNO,srcBillType,code from st.salesout.SalesOut where srcBillType=2 and code=" + code;
        let SalesOut = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库单
        let cust = asnHeader.cust;
        sql = "select code,name from  aa.merchant.Merchant where id=" + cust;
        //查询客户名称
        let custinfo = ObjectStore.queryByYonQL(sql, "productcenter"); //客户
        if (SalesOut.length > 0) {
          sql =
            "select agentId,vouchdate,code,orderDefineCharacter,c.lineno lineno,c.orderDetailDefineCharacter.attrext66     Detaildefine10,c.orderDetailDefineCharacter.attrext108 attrext108,c.orderDetailDefineCharacter.ItemDescription ItemDescription from voucher.order.Order      left join voucher.order.OrderDetail c on c.orderId=id    where   code='" +
            SalesOut[0].srcBillNO +
            "'";
          let recordList = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售订单表头
          let { attrext82, attrext69, attrext65, attrext64, attrext63, attrext74 } = recordList[0].orderDefineCharacter || {}; //attrext82 来源系统  供应商GLN
          let { agentId, vouchdate } = recordList[0] || {};
          if (attrext82 == "EDI") {
            let currency = SalesOut[0].currency || "";
            sql = "select code from bd.currencytenant.CurrencyTenantVO where id=" + currency;
            let currencyInfo = ObjectStore.queryByYonQL(sql, "ucfbasedoc"); //币种
            let currencyCode = "";
            if (currencyInfo.length > 0) {
              currencyCode = currencyInfo[0].code || "";
            }
            //客户地址信息
            let sql1 =
              "select b.id,name,b.addressCode,b.address,b.receiver receiver,b.addressInfoCharacter addressInfoCharacter  ,b.zipCode from aa.merchant.Merchant inner join aa.merchant.AddressInfo b on b.merchantId=id  where id='" +
              agentId +
              "' and b.addressCode='" +
              attrext63 +
              "'";
            let define5Info = ObjectStore.queryByYonQL(sql1, "productcenter");
            let DeliveryName = ""; //收货方公司名称
            let DeliveryStreet = ""; //收货方地址
            let DeliveryCity = ""; //收货方城市名称
            let DeliveryPostalCode = ""; //收货方邮编
            let DeliveryCountry = ""; //收货方国家
            if (define5Info.length > 0) {
              let addressInfoCharacter = define5Info[0].addressInfoCharacter || {};
              DeliveryName = define5Info[0].name || "";
              DeliveryStreet = define5Info[0].b_address || "";
              DeliveryCity = addressInfoCharacter.attrext103 || "";
              DeliveryPostalCode = define5Info[0].b_zipCode || "";
              DeliveryCountry = addressInfoCharacter.attrext102 || "";
            }
            let ORDRSP = {
              CustomerName: custinfo[0].code,
              PONumber: attrext69, //订单编号
              POResponseType: "",
              POResponseDate: "", //订单回复日期
              CurrencyCode: currencyCode, //货币代码
              SupplierGLN: attrext65, //供应商GLN编号
              BuyerGLN: attrext64, //采购方GLN编号
              DeliveryGLN: attrext63, //交付方GLN编号
              InvoiceeGLN: attrext74, //发票接收方GLN编号
              DeliveryName: DeliveryName, //收货方公司名称
              DeliveryStreet: DeliveryStreet, //收货方地址
              DeliveryCity: DeliveryCity, //收货方城市名称
              DeliveryPostalCode: DeliveryPostalCode, //收货方邮编
              DeliveryCountry: DeliveryCountry, //收货方国家
              Ordrsp_Detail: []
            };
            //销售出库明细
            sql =
              "select productn,b.code,lineno,sourceOrderlineno,uplineno,saleReturnQty,qty  from  st.salesout.SalesOuts inner join st.salesout.SalesOut b on b.id=mainid where b.code='" + code + "'";
            let asnDetail = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库明细
            for (var i = 0; i < asnDetail.length; i++) {
              let productn = asnDetail[i].productn;
              sql = "select code from pc.product.Product  productcenter where id=" + productn;
              let productnCode = "";
              let dt02 = ObjectStore.queryByYonQL(sql, "productcenter"); //物料
              if (dt02.length > 0) {
                productnCode = dt02[0].code;
              }
              let detail = recordList.find((v) => v.lineno == asnDetail[i].sourceOrderlineno);
              let saleReturnQty = asnDetail[i].saleReturnQty || 0; //退货数量
              let { Detaildefine10, attrext108, ItemDescription } = detail || {};
              ORDRSP.Ordrsp_Detail.push({
                ItemLineNo: asnDetail[i].lineno, //物料行号
                GTIN: Detaildefine10, //GTIN物料编号
                OrderedQuantity: asnDetail[i].qty, //订购数量
                NetPrice: attrext108, //单价
                ItemDescription: ItemDescription, //物料描述
                SupplierItemNumber: productnCode, //供应商物料编号
                VarianceQuantity: "", //差异数量
                VarianceReason: "" //拒绝原因
              });
            }
            //拼接xml
            xml += "<Items>";
            xml += "<Ordrsp_Header>";
            xmlStr += "    <CustomerName>" + ORDRSP.CustomerName + "</CustomerName>";
            xmlStr += "    <PONumber>" + ORDRSP.PONumber + "</PONumber>";
            xmlStr += "    <POResponseType>" + ORDRSP.POResponseType + "</POResponseType>";
            xmlStr += "    <POResponseDate>" + ORDRSP.POResponseDate + "</POResponseDate>";
            xmlStr += "    <CurrencyCode>" + ORDRSP.CurrencyCode + "</CurrencyCode>";
            xmlStr += "    <SupplierGLN>" + ORDRSP.SupplierGLN + "</SupplierGLN>";
            xmlStr += "    <BuyerGLN>" + ORDRSP.BuyerGLN + "</BuyerGLN>";
            xmlStr += "    <DeliveryGLN>" + ORDRSP.DeliveryGLN + "</DeliveryGLN>";
            xmlStr += "    <DeliveryName>" + ORDRSP.DeliveryName + "</DeliveryName>";
            xmlStr += "    <DeliveryStreet>" + ORDRSP.DeliveryStreet + "</DeliveryStreet>";
            xmlStr += "    <DeliveryCity>" + ORDRSP.DeliveryCity + "</DeliveryCity>";
            xmlStr += "    <DeliveryPostalCode>" + ORDRSP.DeliveryPostalCode + "</DeliveryPostalCode>";
            xmlStr += "    <DeliveryCountry>" + ORDRSP.DeliveryCountry + "</DeliveryCountry>";
            xmlStr += "    <InvoiceeGLN>" + ORDRSP.InvoiceeGLN + "</InvoiceeGLN>";
            ORDRSP.Ordrsp_Detail.map((v) => {
              xmlStr += "<Ordrsp_Detail>";
              xmlStr += "<ItemLineNo>" + v.ItemLineNo + "</ItemLineNo>";
              xmlStr += "<GTIN>" + v.GTIN + "</GTIN>";
              xmlStr += "<SupplierItemNumber>" + v.SupplierItemNumber + "</SupplierItemNumber>";
              xmlStr += "<ItemDescription>" + v.ItemDescription + "</ItemDescription>";
              xmlStr += "<OrderedQuantity>" + v.OrderedQuantity + "</OrderedQuantity>";
              xmlStr += "<NetPrice>" + v.NetPrice + "</NetPrice>";
              xmlStr += "<VarianceQuantity>" + v.VarianceQuantity + "</VarianceQuantity>";
              xmlStr += "<VarianceReason>" + v.VarianceReason + "</VarianceReason>";
              xmlStr += "</Ordrsp_Detail>";
            });
            xml += "</Ordrsp_Header>";
            xml += "</Items>";
            console.log("来源=" + attrext82);
            if (attrext82 == "EDI") {
              try {
                console.log("xml=" + xml);
                apiResponse = postman("post", "http://159.75.254.235:8001/connector/WebhookTest/webhook.rsb", JSON.stringify(header), xml); //接口会抛出错误
              } catch (e) {
                console.log("返回结果" + e.toString());
              }
            }
          }
        }
      } catch (e) {
        return {
          rsp: {
            code: 500,
            msg: e.message,
            data: null,
            apiResponse
          }
        };
      }
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
      return y + "-" + m + "-" + d;
    } else if (type === 2) {
      // 返回年月日 时分秒
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    }
  }
}
exports({
  entryPoint: MyTrigger
});