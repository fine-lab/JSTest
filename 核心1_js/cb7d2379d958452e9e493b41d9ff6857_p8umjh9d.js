let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询销售订单子表POcode 为空的 参考编号
    var myDate = new Date();
    var now = myDate.valueOf();
    let sql = "select * from voucher.order.OrderDetail where batchNo is null  limit 80";
    let saleordersChildList = ObjectStore.queryByYonQL(sql, "udinghuo");
    saleordersChildList.forEach((item) => {
      let orderId = item.orderId; //主表id
      let id = item.id; //子表id
      let saleOrderDefineSql = "select id, orderDetailDefineCharacter.attrext20 as define8, orderDetailDefineCharacter.attrext29 as define17 from voucher.order.OrderDetail where id=" + id;
      let saleordersList = ObjectStore.queryByYonQL(saleOrderDefineSql, "udinghuo");
      let define17 = saleordersList[0].define17; //参考编号-行号 //TODO 线上需要修改
      let define8 = saleordersList[0].define8; //仓库代码 //TODO 线上需要修改
      if (define17) {
        //根据参考行号  查询采购入库子表id
        let PurInRecordsDefineSql = "select  id  from  st.purinrecord.PurInRecords where  purInRecordsDefineCharacter.attrext37 ='" + define17 + "'";
        let PurInRecordsDefine = ObjectStore.queryByYonQL(PurInRecordsDefineSql, "ustock");
        if (PurInRecordsDefine.length == 0) {
          getHighestPriority(orderId, id, define8);
          return;
        }
        //采购订单子表id
        let PurInRecordsId = PurInRecordsDefine[0].id;
        //查询批次号
        let batchnoSql = "select  batchno  from  st.purinrecord.PurInRecords   where  id ='" + PurInRecordsId + "'";
        var batchnoRes = ObjectStore.queryByYonQL(batchnoSql, "ustock");
        if (PurInRecordsDefine.length == 0) {
          getHighestPriority(orderId, id, define8);
          return;
        }
        let batchno = batchnoRes[0].batchno;
        updateSalesOrder(orderId, id, batchno);
      } else {
        if (define8) {
          getHighestPriority(orderId, id, define8);
        }
      }
    });
    //货位编码
    function getHighestPriority(orderId, id, define8) {
      //根据子表id去获取 子表的物料
      let getGood = "select  productId  from  voucher.order.OrderDetail  where  id ='" + id + "'";
      var goodRes = ObjectStore.queryByYonQL(getGood, "udinghuo");
      let good = goodRes[0].productId;
      //通过物料id去查货位对照表 获取货位id
      let getAllocationCode = "select positionId from aa.goodsposition.GoodsProductsComparison where productId = '" + good + "'";
      var positionRes = ObjectStore.queryByYonQL(getAllocationCode, "productcenter");
      if (positionRes.length == 0) {
        return;
      }
      for (var i in positionRes) {
        let positionId = positionRes[i].positionId;
        //根据货位id查询货位号和货位名称
        let getPositionCode = "select name,code from aa.goodsposition.GoodsPosition where id = '" + positionId + "'";
        let PositionCodeRes = ObjectStore.queryByYonQL(getPositionCode, "productcenter");
        let PositionName = PositionCodeRes[0].name;
        if (define8 == PositionName) {
          let PositionCode = PositionCodeRes[0].code;
          updateSalesOrder(orderId, id, PositionCode);
        }
      }
    }
    //更改销售订单自定义项
    function updateSalesOrder(mainid, id, batchNo) {
      //主表信息
      let sql = "select * from voucher.order.Order where id =" + mainid;
      let saleorder = ObjectStore.queryByYonQL(sql, "udinghuo");
      let vouchdate = saleorder[0].vouchdate;
      let salesOrgId = saleorder[0].salesOrgId;
      let code = saleorder[0].code;
      let payMoney = saleorder[0].payMoney;
      let agentId = saleorder[0].agentId;
      let transactionTypeId = saleorder[0].transactionTypeId;
      let resubmitCheckKey = uuid();
      resubmitCheckKey = substring(resubmitCheckKey, 0, 25);
      //子表信息
      let childSql = "select * from voucher.order.OrderDetail where id=" + id;
      let saleorderChild = ObjectStore.queryByYonQL(childSql, "udinghuo");
      let masterUnitId = saleorderChild[0].masterUnitId;
      let unitExchangeTypePrice = saleorderChild[0].unitExchangeTypePrice;
      let invPriceExchRate = saleorderChild[0].invPriceExchRate;
      let subQty = saleorderChild[0].subQty;
      let qty = saleorderChild[0].qty;
      let iProductUnitId = saleorderChild[0].iProductUnitId;
      let taxId = saleorderChild[0].taxId;
      let consignTime = saleorderChild[0].consignTime;
      let productId = saleorderChild[0].productId;
      let oriTaxUnitPrice = saleorderChild[0].oriTaxUnitPrice;
      let unitExchangeType = saleorderChild[0].unitExchangeType;
      let invExchRate = saleorderChild[0].invExchRate;
      let priceQty = saleorderChild[0].priceQty;
      let oriSum = saleorderChild[0].oriSum;
      //子表商品金额
      let PriceSql = "select * from voucher.order.OrderDetailPrice where id=" + id;
      let ChildPrice = ObjectStore.queryByYonQL(PriceSql, "udinghuo");
      let priceNatSum = ChildPrice[0].natSum;
      let priceNatMoney = ChildPrice[0].natMoney;
      let priceOriTax = ChildPrice[0].oriTax;
      let priceNatUnitPrice = ChildPrice[0].natUnitPrice;
      let priceOriMoney = ChildPrice[0].oriMoney;
      let priceNatTaxUnitPrice = ChildPrice[0].natTaxUnitPrice;
      let priceOriUnitPrice = ChildPrice[0].oriUnitPrice;
      let priceNatTax = ChildPrice[0].natTax;
      let object = {
        data: {
          resubmitCheckKey: resubmitCheckKey,
          id: mainid,
          salesOrgId: salesOrgId,
          vouchdate: vouchdate,
          code: code,
          payMoney: payMoney,
          agentId: agentId,
          "orderPrices!currency": "1503986342142935064", //TODO线上需要修改为
          transactionTypeId: transactionTypeId,
          settlementOrgId: salesOrgId,
          "orderPrices!orderId": mainid,
          "orderPrices!exchRate": 1,
          "orderPrices!exchangeRateType": "p8umjh9d", //TODO线上需要修改为
          "orderPrices!natCurrency": "1503986342142935064", //TODO线上需要修改为
          "orderPrices!taxInclusive": true,
          invoiceAgentId: agentId,
          orderDetails: [
            {
              orderId: mainid,
              id: id,
              "orderDetailPrices!orderDetailId": id,
              masterUnitId: masterUnitId,
              iProductAuxUnitId: masterUnitId,
              "orderDetailPrices!natSum": priceNatSum,
              "orderDetailPrices!natMoney": priceNatMoney,
              invExchRate: invExchRate,
              "orderDetailPrices!oriTax": priceOriTax,
              unitExchangeTypePrice: unitExchangeTypePrice,
              "orderDetailPrices!natUnitPrice": priceNatUnitPrice,
              invPriceExchRate: invPriceExchRate,
              oriSum: oriSum,
              stockOrgId: salesOrgId,
              priceQty: priceQty,
              iProductUnitId: iProductUnitId,
              "orderDetailPrices!oriMoney": priceOriMoney,
              batchNo: batchNo,
              productId: productId,
              "orderDetailPrices!natTaxUnitPrice": priceNatTaxUnitPrice,
              orderProductType: "SALE",
              subQty: subQty,
              consignTime: consignTime,
              taxId: taxId,
              qty: qty,
              "orderDetailPrices!oriUnitPrice": priceOriUnitPrice,
              "orderDetailPrices!natTax": priceNatTax,
              oriTaxUnitPrice: oriTaxUnitPrice,
              unitExchangeType: unitExchangeType,
              settlementOrgId: salesOrgId,
              _status: "Update"
            }
          ],
          _status: "Update"
        }
      };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "AT1775ABBE17500005", JSON.stringify(object));
    }
    let res = "成功";
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });