let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let asnHeader = JSON.parse(param.requestData);
    let asnDetail = param.preBillMapInDb[param.return.id].details;
    if (1 == 1) {
      let apiResponse = "";
      let sql = "";
      let cmsxml = "";
      try {
        let header = {
          "x-cdata-authtoken": "3q1S2b7m2J3p2l2K8w3a",
          "Content-Type": "application/xml",
          Cookie: "ASP.NET_SessionId=t2ptyinycvyuxy25wn2oekar"
        };
        sql = "select cReceiver,cReceiveMobile,cReceiveAddress,cReceiveZipCode,vouchdate,srcBillNO,srcBillType,code from st.salesout.SalesOut where srcBillType=2 and code=" + asnHeader.code;
        let SalesOut = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库单
        let cust = asnHeader.cust;
        sql = "select code from  aa.merchant.Merchant where id=" + cust;
        let custinfo = ObjectStore.queryByYonQL(sql, "productcenter"); //客户
        if (SalesOut.length > 0) {
          let func = extrequire("AT15DCCE0808080001.backOpenApiFunction.getGateway");
          let getGatewayInfo = func.execute();
          let baseurl = getGatewayInfo.data.gatewayUrl;
          let body = {
            pageIndex: 1,
            pageSize: 1000,
            code: SalesOut[0].srcBillNO,
            isSum: false
          };
          let url = baseurl + "/yonbip/sd/voucherorder/list";
          let apiResponse1 = JSON.parse(openLinker("POST", url, "ST", JSON.stringify(body)));
          if (apiResponse1.code != "200") {
            throw new Error(apiResponse1.message);
          }
          sql =
            "select vouchdate,code,b.define9 define9,b.define10 define10,b.define11 define11,b.define12 define12,b.define13 define13,c.lineno lineno,d.define10  Detaildefine10 from voucher.order.Order inner join voucher.order.OrderFreeDefine b on b.id=id     left join voucher.order.OrderDetail c on c.orderId=id inner join  voucher.order.OrderDetailFreeDefine d on d.id=c.id   where  code='" +
            SalesOut[0].srcBillNO +
            "'";
          let recordList = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售订单表头
          let { define10, define11, define12, define13, define9, vouchdate } = recordList[0] || {};
          let xmlStr = "";
          xmlStr += "<Items>";
          xmlStr += "  <ASN_Header>";
          xmlStr += "    <CustomerName>" + custinfo[0].code + "</CustomerName>";
          xmlStr += "    <DeliveryAdviceNumber>" + asnHeader.code + "</DeliveryAdviceNumber>";
          xmlStr += "    <DeliveryAdviceDate>" + asnHeader.vouchdate + "</DeliveryAdviceDate>";
          xmlStr += "    <DeliveryDate>" + asnHeader.vouchdate + "</DeliveryDate>";
          xmlStr += "    <PONumber>" + define13 + "</PONumber>";
          xmlStr += "    <PODate>" + vouchdate + "</PODate>";
          xmlStr += "    <DeliveryNoteNumber>" + asnHeader.code + "</DeliveryNoteNumber>";
          xmlStr += "    <SupplierGLN>" + (define10 || "") + "</SupplierGLN>";
          xmlStr += "    <BuyerGLN>" + (define11 || "") + "</BuyerGLN>";
          xmlStr += "    <DeliveryGLN>" + (define12 || "") + "</DeliveryGLN>";
          for (var i = 0; i < asnDetail.length; i++) {
            let detail = recordList.find((item) => item.lineno == asnDetail[i].lineno);
            let { Detaildefine10 } = detail || {};
            xmlStr += "    <ASN_Detail>";
            xmlStr += "      <ItemLineNo>" + asnDetail[i].lineno + "</ItemLineNo>";
            xmlStr += "      <GTIN>" + (Detaildefine10 || "") + "</GTIN>";
            xmlStr += "      <DeliveryQuantity>" + asnDetail[i].qty + "</DeliveryQuantity>";
            xmlStr += "    </ASN_Detail>";
          }
          xmlStr += "  </ASN_Header>";
          xmlStr += "</Items>";
          cmsxml += '<cms type="tag">';
          cmsxml += "<ediCustomerNumber>" + ("99999998" || "") + "</ediCustomerNumber>";
          cmsxml += "<ediParm1>" + ("5" || "") + "</ediParm1>";
          cmsxml += "<ediParm2>" + ("i" || "") + "</ediParm2>";
          cmsxml += "<ediParm3>" + ("d" || "") + "</ediParm3>";
          cmsxml += "<ediReference>" + ("C" + asnHeader.code || "") + "</ediReference>";
          cmsxml += "<referenceIndication>" + ("0" || "") + "</referenceIndication>";
          cmsxml += "<internalOrderNumber>" + ("0" || "") + "</internalOrderNumber>";
          cmsxml += "<ediFunction1>" + ("9" || "") + "</ediFunction1>";
          cmsxml += '<order type="tag">';
          cmsxml += "<loadingDate>" + (this.formatDateTimeStr(SalesOut[0].vouchdate) || "") + "</loadingDate>";
          cmsxml += "<loadingTime>" + ("00:00:00Z" || "") + "</loadingTime>";
          cmsxml += "<unloadingDate>" + (this.formatDateTimeStr(SalesOut[0].vouchdate) || "") + "</unloadingDate>";
          cmsxml += "<unloadingTime>" + ("00:00:00Z" || "") + "</unloadingTime>";
          cmsxml += "<primaryReference>" + ("C" + asnHeader.code || "") + "</primaryReference>";
          cmsxml += '<address type="tag">';
          cmsxml += "<addressType>" + ("3" || "") + "</addressType>";
          cmsxml += "<searchName>" + ("EDEKA ZENTRALHANDELSGESELLSCHAFT MBH" || "") + "</searchName>";
          cmsxml += "<relationNumber>" + ("99999998" || "") + "</relationNumber>";
          cmsxml += "<addressDetails>";
          cmsxml += "<nameLine1>" + (SalesOut[0].cReceiver || "") + "</nameLine1>";
          cmsxml += "<addressLine1>" + (SalesOut[0].cReceiveAddress || "") + "</addressLine1>";
          cmsxml += "<cityName>" + ("" || "") + "</cityName>";
          cmsxml += "<postalcode>" + (SalesOut[0].cReceiveZipCode || "") + "</postalcode>";
          cmsxml += "<countrycode>" + ("DE" || "") + "</countrycode>";
          cmsxml += "</addressDetails>";
          cmsxml += "</address>";
          cmsxml += '<extraReference type="tag">';
          cmsxml += "<referenceCode>" + ("" || "") + "</referenceCode>";
          cmsxml += "<referenceText>" + ("" || "") + "</referenceText>";
          cmsxml += "</extraReference>";
          cmsxml += '<freeText type="tag">';
          cmsxml += "<typeOfFreeText>" + ("CSE" || "") + "</typeOfFreeText>";
          cmsxml += "<text/>";
          cmsxml += "</freeText>";
          for (var i = 0; i < asnDetail.length; i++) {
            let product = asnDetail[i].product;
            sql = "select erpCode,b.barCode barCode from pc.product.Product left join pc.product.ProductDetail b on b.productId=id where id=" + product; //productcenter
            var productdata = ObjectStore.queryByYonQL(sql, "productcenter");
            let { erpCode, barCode } = productdata[0] || {};
            //循环体
            cmsxml += '<articleLine type="tag">';
            cmsxml += "<orderType>" + ("51" || "") + "</orderType>";
            cmsxml += "<articleCode>" + (erpCode || "") + "</articleCode>";
            cmsxml += "<quantity>" + (asnDetail[i].qty || "") + "</quantity>";
            cmsxml += "<packageCode>" + ("Pieces" || "") + "</packageCode>";
            cmsxml += "<punumber>" + ("1" || "") + "</punumber>";
            cmsxml += "<eanpc>" + (barCode || "") + "</eanpc>";
            cmsxml += "<eacinner/>";
            cmsxml += "<eanmaster>" + (barCode || "") + "</eanmaster>";
            cmsxml += "</articleLine>";
          }
          cmsxml += "</order>";
          cmsxml += "</cms>";
          let aa = "";
          let cust_name = asnHeader.cust_name.toLowerCase();
          console.log("供应商GLN=" + define10);
          console.log("来源=" + define9);
          if (define9 == "EDI") {
            try {
              if (cust_name.indexOf("metro") != -1) {
                console.log("xmlStr=" + xmlStr); //('xmlStr='+xmlStr);//ASN 发货通知
                apiResponse = postman("post", "http://159.75.254.235:8001/connector/WebhookTest/webhook.rsb", JSON.stringify(header), xmlStr); //接口会抛出错误
              }
            } catch (e) {
              aa += "xmlStr" + e;
            }
            try {
              console.log("cmsxml=" + cmsxml);
              apiResponse = postman("post", "http://159.75.254.235:8001/connector/WebhookTest/webhook.rsb", JSON.stringify(header), cmsxml); //接口会抛出错误
            } catch (e) {
              aa += "cmsxml" + e;
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