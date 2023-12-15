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
        sql = "select code,name from  aa.merchant.Merchant where id=" + cust;
        //查询客户名称
        let custinfo = ObjectStore.queryByYonQL(sql, "productcenter"); //客户
        if (SalesOut.length > 0) {
          sql =
            "select agentId,vouchdate,code,orderDefineCharacter,c.lineno lineno,c.orderDetailDefineCharacter.attrext66     Detaildefine10 from voucher.order.Order      left join voucher.order.OrderDetail c on c.orderId=id    where   code='" +
            SalesOut[0].srcBillNO +
            "'";
          let recordList = ObjectStore.queryByYonQL(sql, "udinghuo"); //销售订单表头
          let { attrext65: define10, attrext64: define11, attrext63: define12, attrext69: define13, attrext82: define8 } = recordList[0].orderDefineCharacter || {}; //define12 交付方  define11 //采购方
          let { agentId, vouchdate } = recordList[0] || {};
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
          //客户地址信息
          let sql1 =
            "select b.id,b.addressCode,b.address,b.receiver receiver,b.addressInfoCharacter addressInfoCharacter  ,b.zipCode from aa.merchant.Merchant inner join aa.merchant.AddressInfo b on b.merchantId=id  where id='" +
            agentId +
            "' and b.addressCode='" +
            define12 +
            "'";
          let define5Info = ObjectStore.queryByYonQL(sql1, "productcenter");
          let b_addressCode = ""; //GLN
          let c_define1 = ""; //国家代码
          let c_define2 = ""; //城市
          let b_zipCode = ""; //邮政编码
          let b_address = ""; //详细地址
          let receiver = ""; //联系人姓名
          if (define5Info.length > 0) {
            let addressInfoCharacter = define5Info[0].addressInfoCharacter || {};
            b_addressCode = define5Info[0].b_addressCode || "";
            c_define1 = addressInfoCharacter.attrext102 || "";
            c_define2 = addressInfoCharacter.attrext103 || "";
            b_zipCode = define5Info[0].b_zipCode || "";
            receiver = define5Info[0].receiver || "";
            b_address = define5Info[0].b_address || "";
          }
          let searchName = "";
          if (custinfo.length > 0) {
            searchName = custinfo[0].name;
          }
          cmsxml += '<address type="tag">';
          cmsxml += "<addressType>" + ("3" || "") + "</addressType>";
          cmsxml += "<searchName>" + (searchName || "") + "</searchName>"; //客户名称
          cmsxml += "<relationNumber>" + ("99999998" || "") + "</relationNumber>";
          cmsxml += "<addressDetails>";
          cmsxml += "<nameLine1>" + receiver + "</nameLine1>";
          cmsxml += "<addressLine1>" + b_address + "</addressLine1>";
          cmsxml += "<cityName>" + c_define2 + "</cityName>";
          cmsxml += "<postalcode>" + b_zipCode + "</postalcode>";
          cmsxml += "<countrycode>" + c_define1 + "</countrycode>";
          cmsxml += "</addressDetails>";
          cmsxml += "</address>";
          cmsxml += '<extraReference type="tag">';
          cmsxml += "<referenceCode>" + (2 || "") + "</referenceCode>";
          cmsxml += "<referenceText>" + (define13 || "") + "</referenceText>"; //edi单号
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
            cmsxml += "<quantity>" + (asnDetail[i].qty.toFixed(6) || "") + "</quantity>";
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
          console.log("来源=" + define8);
          if (define8 == "EDI") {
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