let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 操作几天前的数据
    let day = 7;
    if (param !== undefined && param.day !== undefined) {
      day = param.day;
    }
    // 当前时间戳 new Date()少28800000
    var currentDate = new Date();
    //加上8小时
    var nowDate = new Date(new Date().getTime() + 28800000);
    var pubts = timestampToTime(nowDate.setDate(nowDate.getDate() - day));
    var accessToken;
    // 第几页
    var pageIndex = 1;
    // 列表
    var dataList = [];
    // 数量
    var recordCount = 0;
    while ((dataList.length < recordCount && recordCount !== 0) || pageIndex === 1) {
      let singledataList = getdataList({
        pageIndex: pageIndex,
        pubts: pubts
      });
      dataList = dataList.concat(singledataList);
      pageIndex++;
    }
    if (dataList.length === 0) {
      return;
    }
    // 驳回订单  获取自定义档案中配置的倒计时天数
    var cancelCountdown = getCancelCountdown();
    var laterDate = nowDate.setDate(nowDate.getDate() + day - cancelCountdown);
    var opposeDatas = [];
    var opposeorderID = [];
    var updatedataList = [];
    let defineParamList = [];
    dataList.forEach((self) => {
      let createTime = new Date(self.createTime).getTime();
      //如果单据创建日期大于最晚到期日并且支付状态等于支付完成的不进行自动取消
      let req = {
        id: self.id,
        code: self.code,
        status: 0,
        opposeMemo: "订单超时未付款，系统自动取消。"
      };
      let defineParam = {
        id: self.id,
        code: self.code,
        definesInfo: [
          {
            define9: currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate(), //完成时间
            isHead: true,
            isFree: true
          },
          {
            define32: "已取消", //完成状态
            isHead: true,
            isFree: false
          }
        ]
      };
      if (self.code == "1302230809UDH0001") {
        opposeDatas.push(req);
        opposeorderID.push(self.id);
        defineParamList.push(defineParam);
      }
    });
    // 批量驳回
    if (opposeDatas.length > 0) {
      //订单自动关闭时返利释放
      extrequire("SCMSA.saleOrderRule.opposeOpenly").execute({
        orderIds: opposeorderID
      });
    }
    // 批量更新
    // 响应
    return {};
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function writeBackOpposeMemo(params) {
      let detaildata = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      detaildata = JSON.parse(detaildata);
      if (detaildata.code != "200") {
        throw new Error("查询销售订单详情异常:" + detaildata.message);
      }
      detaildata = detaildata.data;
      let datadetails = [];
      if (detaildata.orderDetails.length > 0) {
        detaildata.orderDetails.forEach((detailself) => {
          let detailinfo = {
            "orderDetailPrices!natSum": detailself.orderDetailPrices.natSum,
            "orderDetailPrices!natMoney": detailself.orderDetailPrices.natMoney,
            productId: detailself.productId,
            masterUnitId: detailself.masterUnitId,
            invExchRate: detailself.invExchRate,
            unitExchangeTypePrice: detailself.unitExchangeTypePrice,
            "orderDetailPrices!oriTax": detailself.orderDetailPrices.oriTax,
            iProductAuxUnitId: detailself.iProductAuxUnitId,
            "orderDetailPrices!natUnitPrice": detailself.orderDetailPrices.natUnitPrice,
            invPriceExchRate: detailself.invPriceExchRate,
            oriSum: detailself.oriSum,
            "orderDetailPrices!oriMoney": detailself.orderDetailPrices.oriMoney,
            priceQty: detailself.priceQty,
            stockOrgId: detailself.stockOrgId,
            iProductUnitId: detailself.iProductUnitId,
            "orderDetailPrices!natTaxUnitPrice": detailself.orderDetailPrices.natTaxUnitPrice,
            orderProductType: detailself.orderProductType,
            subQty: detailself.subQty,
            consignTime: detailself.consignTime,
            taxId: detailself.taxId,
            qty: detailself.qty,
            settlementOrgId: detailself.settlementOrgId,
            oriTaxUnitPrice: detailself.oriTaxUnitPrice,
            "orderDetailPrices!natTax": detailself.orderDetailPrices.natTax,
            unitExchangeType: detailself.unitExchangeType,
            "orderDetailPrices!oriUnitPrice": detailself.orderDetailPrices.oriUnitPrice,
            _status: "Update"
          };
          datadetails.push(detailinfo);
        });
      }
      let Body = {
        data: {
          resubmitCheckKey: detaildata.id,
          salesOrgId: detaildata.salesOrgId,
          transactionTypeId: detaildata.transactionTypeId,
          vouchdate: detaildata.vouchdate,
          agentId: detaildata.agentId,
          settlementOrgId: detaildata.settlementOrgId,
          "orderPrices!currency": detaildata.orderPrices.currency,
          "orderPrices!exchRate": detaildata.orderPrices.exchRate,
          "orderPrices!exchangeRateType": detaildata.orderPrices.exchangeRateType,
          "orderPrices!natCurrency": detaildata.orderPrices.natCurrency,
          "orderPrices!taxInclusive": detaildata.orderPrices.taxInclusive,
          invoiceAgentId: detaildata.invoiceAgentId,
          payMoney: detaildata.payMoney,
          opposeMemo: "订单超时未付款，系统自动取消。",
          orderDetails: datadetails,
          _status: "Update"
        }
      };
      let result = postman("post", "https://www.example.com/" + getAccessToken() + "", "", JSON.stringify(Body));
      throw new Error(JSON.stringify(Body));
    }
    function getdataList(params) {
      let reqBody = {
        pageIndex: params.pageIndex,
        pageSize: 500,
        nextStatusName: "CONFIRMORDER",
        isSum: true,
        open_orderDate_begin: params.pubts
      };
      let saleOrderData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      saleOrderData = JSON.parse(saleOrderData);
      if (saleOrderData.code != "200") {
        throw new Error("查询销售订单异常:" + saleOrderData.message);
      }
      if (saleOrderData.data !== undefined && saleOrderData.data.recordList !== undefined) {
        recordCount = saleOrderData.data.recordCount;
        return saleOrderData.data.recordList;
      } else {
        return [];
      }
    }
    function opposeOrders(params) {
      let reqBody = {
        data: params
      };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      res = JSON.parse(res);
      if (res.code != "200") {
        throw new Error("驳回订单异常:" + res.message);
      }
    }
    function updateSaleOrderDefine(params) {
      // 封装请求参数
      let reqBody = {
        billnum: "voucher_order",
        datas: params
      };
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("销售自定义项更新 " + e);
      }
    }
    function getCancelCountdown() {
      let req = {
        pageIndex: 1,
        pageSize: 10,
        custdocdefcode: "cancelOrder",
        code: "day"
      };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(req));
      res = JSON.parse(res);
      if (res.code != "200") {
        throw new Error("查询自定义档案列表异常:" + res.message);
      }
      if (res.data.recordCount == 0) {
        throw new Error("自定义档案[" + req.custdocdefcode + "]无数据");
      }
      return GetBigDecimal(res.data.recordList[0].name.zh_CN);
    }
    function timestampToTime(timestamp) {
      //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(timestamp);
      var Y = date.getFullYear() + "-";
      var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
      var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }
  }
}
exports({ entryPoint: MyTrigger });