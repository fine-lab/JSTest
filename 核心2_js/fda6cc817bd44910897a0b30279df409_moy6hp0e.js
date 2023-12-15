let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    let codes = request.code || []; //销售出库编码集合
    try {
      let header = {
        "x-cdata-authtoken": "3q1S2b7m2J3p2l2K8w3a",
        "Content-Type": "application/xml",
        Cookie: "ASP.NET_SessionId=t2ptyinycvyuxy25wn2oekar"
      };
      let apiResponse = "";
      let sql = "";
      codes.map((item) => {
        if (1 == 1) {
          try {
            sql =
              "select cReceiver,cust,cReceiveMobile,cReceiveAddress,cReceiveZipCode,vouchdate,srcBillNO,srcBillType,code,salesOutDefineCharacter from st.salesout.SalesOut where srcBillType=2 and code=" +
              item;
            let SalesOut = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库单
            let cust = SalesOut[0].cust; //客户id
            sql = "select code,name from  aa.merchant.Merchant where id=" + cust;
            let custinfo = ObjectStore.queryByYonQL(sql, "productcenter"); //客户
            let cust_name = custinfo[0].name.toLowerCase(); //客户名称
            if (SalesOut.length > 0) {
              sql =
                "select agentId,vouchdate,code,orderDefineCharacter,c.lineno lineno,c.orderDetailDefineCharacter.attrext66     Detaildefine10,c.orderDetailDefineCharacter orderDetailDefineCharacter from voucher.order.Order      left join voucher.order.OrderDetail c on c.orderId=id    where   code='" +
                SalesOut[0].srcBillNO +
                "'";
              let recordList = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售订单表头明细
              let { attrext65: define10, attrext64: define11, attrext63: define12, attrext69: define13, attrext82: define8, attrext74 } = recordList[0].orderDefineCharacter || {}; //define12 交付方  define11 //采购方
              let { agentId, vouchdate } = recordList[0] || {};
              let xmlStr = "";
              xmlStr += "<Items>";
              xmlStr += "  <ASN_Header>";
              xmlStr += "    <CustomerName>" + custinfo[0].code + "</CustomerName>";
              xmlStr += "    <DeliveryAdviceNumber>" + SalesOut[0].code + "</DeliveryAdviceNumber>";
              xmlStr += "    <DeliveryAdviceDate>" + SalesOut[0].vouchdate + "</DeliveryAdviceDate>";
              xmlStr += "    <DeliveryDate>" + SalesOut[0].vouchdate + "</DeliveryDate>";
              xmlStr += "    <PONumber>" + define13 + "</PONumber>";
              xmlStr += "    <PODate>" + vouchdate + "</PODate>";
              xmlStr += "    <DeliveryNoteNumber>" + SalesOut[0].code + "</DeliveryNoteNumber>";
              xmlStr += "    <SupplierGLN>" + (define10 || "") + "</SupplierGLN>";
              xmlStr += "    <BuyerGLN>" + (define11 || "") + "</BuyerGLN>";
              xmlStr += "    <DeliveryGLN>" + (define12 || "") + "</DeliveryGLN>";
              let EstimatedDate = "";
              let TrackingCode = "";
              let InvoiceeGLN = "";
              let Carrier = "";
              TrackingCode = custinfo[0].code;
              if (cust_name.indexOf("memetro marketstro") != -1) {
                let salesOutDefineCharacter = SalesOut[0].salesOutDefineCharacter; //销售出库自定义项
                InvoiceeGLN = attrext74 || ""; //发票收取方GLN编号
                EstimatedDate = salesOutDefineCharacter.attrext30 || ""; //预计送达时间
              }
              //增加字段
              xmlStr += "    <EstimatedDate>" + EstimatedDate + "</EstimatedDate>"; //预计送达时间
              xmlStr += "    <TrackingCode>" + TrackingCode + "</TrackingCode>"; //追踪号
              xmlStr += "    <InvoiceeGLN>" + InvoiceeGLN + "</InvoiceeGLN>"; //发票收取方GLN编号
              xmlStr += "    <Carrier>" + Carrier + "</Carrier>"; //
              sql = "";
              //销售出库明细
              sql =
                "select b.code,lineno,sourceOrderlineno,uplineno,saleReturnQty,qty,salesOutsDefineCharacter.attrext33 attrext33  from  st.salesout.SalesOuts inner join st.salesout.SalesOut b on b.id=mainid where b.code='" +
                item +
                "'";
              let asnDetail = ObjectStore.queryByYonQL(sql, "ustock"); //销售出库明细
              for (var i = 0; i < asnDetail.length; i++) {
                let detail = recordList.find((v) => v.lineno == asnDetail[i].sourceOrderlineno);
                let saleReturnQty = asnDetail[i].saleReturnQty || 0; //退货数量
                let { Detaildefine10 } = detail || {};
                xmlStr += "    <ASN_Detail>";
                xmlStr += "      <ItemLineNo>" + asnDetail[i].lineno + "</ItemLineNo>";
                xmlStr += "      <GTIN>" + (Detaildefine10 || "") + "</GTIN>";
                xmlStr += "      <DeliveryQuantity>" + (asnDetail[i].qty - saleReturnQty) + "</DeliveryQuantity>";
                let PackageQuantity = asnDetail[i].attrext33;
                let PackageType = "";
                let MarkingInstructionsCode = "";
                let TrackingCode = "";
                let ContainerCode = "";
                let ItemDescription = "";
                if (cust_name.indexOf("memetro marketstro") != -1) {
                  let orderDetailDefineCharacter = detail.orderDetailDefineCharacter || {};
                  ItemDescription = orderDetailDefineCharacter.orderDetailDefineCharacter || ""; //物料描述
                }
                //增加字段
                xmlStr += "      <PackageQuantity>" + PackageQuantity + "</PackageQuantity>"; //包装箱数
                xmlStr += "      <PackageType>" + PackageType + "</PackageType>"; //包装类型
                xmlStr += "      <MarkingInstructionsCode>" + MarkingInstructionsCode + "</MarkingInstructionsCode>"; //标记说明代码
                xmlStr += "      <TrackingCode>" + TrackingCode + "</TrackingCode>"; //追踪号
                xmlStr += "      <ContainerCode>" + ContainerCode + "</ContainerCode>"; //集装箱代码
                xmlStr += "      <ItemDescription>" + ItemDescription + "</ItemDescription>"; //物料描述
                xmlStr += "    </ASN_Detail>";
              }
              xmlStr += "  </ASN_Header>";
              xmlStr += "</Items>";
              let aa = "";
              console.log("供应商GLN=" + define10);
              console.log("来源=" + define8);
              if (define8 == "EDI") {
                try {
                  if (cust_name.indexOf("metro") != -1) {
                    console.log("xmlStr=" + xmlStr); //('xmlStr='+xmlStr);//ASN 发货通知
                    apiResponse = postman("post", "http://159.75.254.235:8001/connector/WebhookTest/webhook.rsb", JSON.stringify(header), xmlStr); //接口会抛出错误
                  }
                } catch (e) {
                  aa += "xmlStr" + e;
                }
              }
            }
          } catch (e) {
            console.log("错误信息" + e.toString());
          }
        }
      });
    } catch (ex) {
      console.log("错误信息" + ex.toString());
      rsp.code = 500;
      rsp.msg = ex.toString();
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });