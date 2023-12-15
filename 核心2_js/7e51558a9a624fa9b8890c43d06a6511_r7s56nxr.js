let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: 200,
      message: "",
      data: null
    };
    try {
      let func = extrequire("AT15DCCE0808080001.backOpenApiFunction.getGateway");
      let getGatewayInfo = func.execute();
      let baseurl = getGatewayInfo.data.gatewayUrl;
      let url = baseurl + "/yonbip/sd/voucherorder/singleSave";
      let body = {
        data: {}
      };
      body.data.id = "";
      body.data._status = "Insert";
      body.data.memo = "EDI测试单据";
      body.data.agentId = request.agentId;
      body.data.code = request.code;
      body.data.hopeReceiveDate = request.hopeReceiveDate;
      body.data.invoiceAgentId = request.agentId;
      body.data.orderDetails = [];
      body.data.resubmitCheckKey = request.resubmitCheckKey;
      body.data.salesOrgId = "CSGH";
      body.data.settlementOrgId = "CSGH";
      body.data.transactionTypeId = "yourIdHere";
      body.data.vouchdate = request.vouchdate;
      body.data.headItem = {};
      body.data.headItem.orderId = "";
      body.data.headItem.define10 = request.define1;
      body.data.headItem.define11 = request.define2;
      body.data.headItem.define12 = request.define3;
      body.data.headItem.define13 = request.code; //Edi单号
      body.data.payMoney = 0;
      body.data["orderPrices!currency"] = "EUR";
      body.data["orderPrices!exchRate"] = 1;
      body.data["orderPrices!exchangeRateType"] = "04";
      body.data["orderPrices!natCurrency"] = "EUR";
      body.data["orderPrices!taxInclusive"] = true;
      let orderDetails = request.orderDetails;
      for (var i = 0; i < orderDetails.length; i++) {
        let Detail = {};
        Detail.id = "";
        Detail._status = "Insert";
        Detail.consignTime = request.vouchdate;
        Detail.priceQty = orderDetails[i].priceQty;
        Detail.qty = orderDetails[i].qty;
        Detail.subQty = orderDetails[i].subQty;
        Detail.invExchRate = 1;
        Detail.invPriceExchRate = 1;
        Detail["orderDetailPrices!natMoney"] = 0;
        Detail["orderDetailPrices!natSum"] = 0;
        Detail["orderDetailPrices!natTax"] = 0;
        Detail["orderDetailPrices!natTaxUnitPrice"] = 0;
        Detail["orderDetailPrices!natUnitPrice"] = 0;
        Detail["orderDetailPrices!oriMoney"] = 0;
        Detail["orderDetailPrices!oriTax"] = 0;
        Detail["orderDetailPrices!oriUnitPrice"] = 0;
        Detail.orderProductType = "SALE";
        Detail.oriSum = 0;
        Detail.oriTaxUnitPrice = 0;
        Detail.settlementOrgId = "CSGH";
        Detail.stockOrgId = "CSGH";
        Detail.taxId = "NO VAT";
        Detail.unitExchangeType = 0;
        Detail.unitExchangeTypePrice = 0;
        Detail.productId = "";
        Detail.realProductCode = "";
        Detail.iProductAuxUnitId = "";
        Detail.iProductUnitId = "";
        Detail.masterUnitId = "";
        Detail.bodyItem = {};
        Detail.bodyItem.define10 = orderDetails[i].define10;
        //查询物料
        let sql = "select unit,code,b.barCode from pc.product.Product inner join pc.product.ProductDetail b on b.productId=id where b.barCode='" + orderDetails[i].productId + "'";
        var productdata = ObjectStore.queryByYonQL(sql, "productcenter");
        if (productdata.length > 0) {
          let unit = productdata[0].unit;
          Detail.iProductAuxUnitId = unit;
          Detail.iProductUnitId = unit;
          Detail.masterUnitId = unit;
          Detail.productId = productdata[0].code;
          Detail.realProductCode = productdata[0].code;
          body.data.orderDetails.push(Detail);
        } else {
          rsp.message += "条码【" + orderDetails[i].productId + "】未找到对应的物料/n";
        }
      }
      if (rsp.message == "") {
        let apiResponse = openLinker("POST", url, "AT15DCCE0808080001", JSON.stringify(body));
        let repdata = JSON.parse(apiResponse);
        if (repdata.code == "200") {
          rsp.message = "操作成功";
          rsp.data = repdata.data;
        } else {
          throw new Error(repdata.message);
        }
      } else {
        throw new Error(rsp.message);
      }
    } catch (e) {
      rsp.message = e.message;
      rsp.code = 999;
    } finally {
      return rsp;
    }
  }
}
exports({ entryPoint: MyAPIHandler });