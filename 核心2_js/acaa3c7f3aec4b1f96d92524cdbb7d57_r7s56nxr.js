let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let apiResponse = "";
    let sql = "";
    try {
      let header = {
        "x-cdata-authtoken": "3q1S2b7m2J3p2l2K8w3a",
        "Content-Type": "application/xml",
        Cookie: "ASP.NET_SessionId=t2ptyinycvyuxy25wn2oekar"
      };
      let asnHeader = JSON.parse(param.requestData);
      let asnDetail = param.preBillMapInDb[param.return.id].details;
      sql = "select srcBillNO,srcBillType,code from st.salesout.SalesOut where srcBillType=2 and code=" + asnHeader.code;
      let SalesOut = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库单
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
        let headItem = apiResponse1.data.recordList[0].headItem;
        let { define10, define11, define12, define13 } = headItem || {};
        let xmlStr = "";
        xmlStr += "<Items>";
        xmlStr += "  <ASN_Header>";
        xmlStr += "    <CustomerName>" + asnHeader.cust_name + "</CustomerName>";
        xmlStr += "    <DeliveryAdviceNumber>" + asnHeader.code + "</DeliveryAdviceNumber>";
        xmlStr += "    <DeliveryAdviceDate>" + asnHeader.vouchdate + "</DeliveryAdviceDate>";
        xmlStr += "    <DeliveryDate>" + asnHeader.vouchdate + "</DeliveryDate>";
        xmlStr += "    <PONumber></PONumber>";
        xmlStr += "    <PODate>" + asnHeader.vouchdate + "</PODate>";
        xmlStr += "    <DeliveryNoteNumber>" + asnHeader.code + "</DeliveryNoteNumber>";
        xmlStr += "    <SupplierGLN>" + (define10 || "") + "</SupplierGLN>";
        xmlStr += "    <BuyerGLN>" + (define11 || "") + "</BuyerGLN>";
        xmlStr += "    <DeliveryGLN>" + (define12 || "") + "</DeliveryGLN>";
        for (var i = 0; i < asnDetail.length; i++) {
          let detail = apiResponse1.data.recordList.find((item) => item.lineno == asnDetail[i].lineno);
          let { define10 } = detail.bodyItem || {};
          xmlStr += "    <ASN_Detail>";
          xmlStr += "      <ItemLineNo>" + asnDetail[i].lineno + "</ItemLineNo>";
          xmlStr += "      <GTIN>" + (define10 || "") + "</GTIN>";
          xmlStr += "      <DeliveryQuantity>" + asnDetail[i].qty + "</DeliveryQuantity>";
          xmlStr += "    </ASN_Detail>";
        }
        xmlStr += "  </ASN_Header>";
        xmlStr += "</Items>";
        apiResponse = postman("post", "http://159.75.254.235:8001/connector/WebhookTest/webhook.rsb", JSON.stringify(header), xmlStr);
        return {
          rsp: JSON.parse(apiResponse)
        };
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
exports({
  entryPoint: MyTrigger
});