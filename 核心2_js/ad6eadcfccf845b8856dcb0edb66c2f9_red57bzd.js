let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql =
      "select  *   from  marketing.credit.CreditTargetDomain  " +
      " inner join marketing.credit.CreditTargetDomainItem b  on b.targetDomainId = id " +
      " where  targetType = '0,2'  and  isEnabled = 'true'  and b.departmentId = 'yourIdHere'  "; //
    var yingshouRes = ObjectStore.queryByYonQL(sql, "marketingbill");
    var sss = yingshouRes.length;
    return { yingshouRes };
    for (var j = 0; j < yingshouRes.length; j++) {
      if (yingshouRes[j].operator != null && yingshouRes[j].operator != "") {
        var empStrID = yingshouRes[j].operator;
        var code = yingshouRes[j].code;
        var arr = empStrID.split(",");
        var newArr = arr.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
        return { newArr };
      }
    }
    return { yingshouRes };
    var aaaql =
      " select  customer, sum(localbalance) localbalance  from      arap.oar.OarMain  where    localbalance != 0  and   accentity in ('1624180950145433604','1624184918710943750') " +
      " and  basebilltype ='HSFWYSGLYY1' and  tradetype = '1602907650714501185'     and  period = '1629351300511563787'  group by  customer ";
    var yingshouRes1 = ObjectStore.queryByYonQL(aaaql, "fiarap");
    var couss = yingshouRes1.length;
    return { couss };
    var Mainsql =
      "select id productId,unit productUnitId,name productName,code productCode,u.name batchPriceUnit,u.id batchPriceUnitid,u2.name batchUnit ," +
      "u2.id batchUnitid,mc.name productclassName,u3.name productUnitName,pe.assistUnit assistUnitm,u4.name assistUnitName,orgId org, manageClass  productclassId " +
      "from pc.product.Product " +
      "left join pc.product.ProductDetail d on id = d.productId " +
      "left join aa.product.ProductUnit u on d.batchPriceUnit = u.id " +
      "left join aa.product.ProductUnit u2 on d.batchUnit = u2.id " +
      "left join pc.cls.ManagementClass mc on mc.id = manageClass " +
      "left join aa.product.ProductUnit u3 on u3.id = unit " +
      "left join pc.product.ProductAssistUnitExchange pe on pe.productId = id " +
      "left join aa.product.ProductUnit u4 on u4.id = pe.assistUnit " +
      "where  1=1 and orgId = 'yourIdHere'  ";
    var res = ObjectStore.queryByYonQL(Mainsql, "productcenter");
    var ddd = res.length;
    return { ddd };
    var yingshouSql =
      "select   code , b.batchno batchno ,b.orderno orderno , b.balance  balance ,  b.oriSum oriSum ,b.qty qty , b.unit unit, b.oriTaxUnitPrice  oriTaxUnitPrice ,b.material material  from  arap.oar.OarMain" +
      " inner join arap.oar.OarDetail b  on  id= b.mainid " +
      " where  localbalance != 0 and tradetype = '1602907650714501262'  " +
      " and accentity = '1624180950145433604' and  code in ('TI3604231014000024','TI3604231013000032') ";
    var yingshouRes = ObjectStore.queryByYonQL(yingshouSql, "fiarap");
    return { yingshouRes };
    let returndataMapTK = {};
    //查询退货单据列表  统计销售订单的退款金额
    var returnOrdersqlTK =
      "select  a.orderNo orderNo,  code  retcode from voucher.salereturn.SaleReturn " +
      "inner join voucher.salereturn.SaleReturnDetail a on  a.saleReturnId = id " +
      " where   returnStatus='ENDSALERETURN' and   saleReturnStatus='ENDSALERETURN' and  a.orderNo != null";
    returnOrdersqlTK = returnOrdersqlTK + "  group by a.orderNo,code ";
    var returnOrderslistTK = ObjectStore.queryByYonQL(returnOrdersqlTK, "udinghuo");
    for (var v = 0; v < returnOrderslistTK.length; v++) {
      var orderNo = returnOrderslistTK[v].orderNo;
      var code = returnOrderslistTK[v].retcode;
      returndataMapTK[code] = orderNo;
    }
    var sqlTuiKuan = "select orderno,oriSum   from arap.paybill.PayBill  where  billtype = 9   "; //PA00231005000009    CREFar230928000001
    var resTuiKuan = ObjectStore.queryByYonQL(sqlTuiKuan, "fiarap");
    let tuiKuandataMap = {};
    for (var o = 0; o < resTuiKuan.length; o++) {
      var orderNoTuiKuan = resTuiKuan[o].orderno;
      if (returndataMapTK[orderNoTuiKuan] != null && returndataMapTK[orderNoTuiKuan] != "") {
        var xiaoshoucode = returndataMapTK[orderNoTuiKuan];
        //退款金额
        var oriSumTuiKuan = resTuiKuan[o].oriSum;
        if (tuiKuandataMap[xiaoshoucode] != null && tuiKuandataMap[xiaoshoucode] != "") {
          var oldtuikuanjine = tuiKuandataMap[xiaoshoucode];
          tuiKuandataMap[xiaoshoucode] = oriSumTuiKuan + oldtuikuanjine;
        } else {
          tuiKuandataMap[xiaoshoucode] = oriSumTuiKuan;
        }
      }
    }
    return { tuiKuandataMap };
    var sql = "select orderno,oriSum   from arap.paybill.PayBill  where  billtype = 9 and  code ='CREFar230803000003' "; //PA00231005000009    CREFar230928000001
    sql = "select *  from   arap.paybill.PayBillb  where mainid = 'youridHere' ";
    var returnOrdersql =
      "select  a.orderNo orderNo,   code from voucher.salereturn.SaleReturn " + "inner join voucher.salereturn.SaleReturnDetail a on  a.saleReturnId = id " + " where   a.orderNo != null";
    returnOrdersql = returnOrdersql + "  group by a.orderNo ,code  ";
    var returnOrderslist = ObjectStore.queryByYonQL(returnOrdersql, "udinghuo");
    return { returnOrderslist };
    var zhekouSql = "select  auditstatus, status,writeoffstatus, b.mainid from arap.oar.OarMain " + " inner  join  arap.oar.OarDetail b on b.mainid = id where  code = 'TI3604230831000088'   ";
    zhekouSql = "select   * from  arap.oar.OarMain  where  code = 'TI3604230831000088'  ";
    zhekouSql =
      "select  topsrcbillno , oriSum ,customer,batchno,qty,material , bill.auditstatus, bill.status,bill.writeoffstatus from  arap.oar.OarDetail " +
      " inner join arap.oar.OarMain bill  on  bill.id = mainid" +
      " where  topsrcbillno = '202308290290' and  qty <0 and material='1800956727416848394' ";
    var zhekouRes = ObjectStore.queryByYonQL(zhekouSql, "fiarap");
    return { zhekouRes };
    var warehouseIds = [
      {
        warehouse: "1630288754425987094",
        orgid: "youridHere",
        batchno: "第22车家兴蓝宝石",
        product: "1781621446064734216",
        productname: "家兴蓝宝石纸箱",
        weight: 222,
        number: 12,
        batchUnitid: "youridHere",
        batchPriceUnitid: "youridHere"
      }
    ];
    var type = "";
    var resultlist = [];
    if (warehouseIds) {
      var map1 = warehouseIds[0];
      var orgid1 = map1.orgid;
      let body = {
        billnum: "voucher_order"
      };
      if (request.type != null && request.type == "1") {
        type = "1";
      } else {
        body.org = orgid1;
      }
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
      let resdataMap = {};
      let resdata = JSON.parse(apiResponse);
      if (resdata != null && resdata.code != null && resdata.code == "200") {
        let data = resdata.data;
        if (data != null) {
          for (var w = 0; w < data.length; w++) {
            var warehouseData = data[w].warehouse;
            var productData = data[w].product;
            var batchnodata = data[w].batchno;
            if (data[w].batchno == null) {
              batchnodata = "";
            }
            var key = warehouseData + "-" + productData + "-" + batchnodata;
            if (resdataMap[key] != null && resdataMap[key] != "") {
              var xiancunliang = resdataMap[key]; //现存量
              var zhanyongliang = data[w].availableqty; //被占用数量
              var newXiancunLiang = xiancunliang + zhanyongliang;
              resdataMap[key] = newXiancunLiang;
            } else {
              resdataMap[key] = data[w].availableqty;
            }
          }
        }
      } // return {resdataMap};
      var CurrentStocklsql1 =
        "select    a.productId productId ,a.stockId stockId ,a.batchNo batchNo, sum(a.subQty) subQty " +
        " from voucher.order.Order  inner join voucher.order.OrderDetail   a on  a.orderId = id  " +
        " where  (nextStatus  =  'CONFIRMORDER'  or nextStatus = 'DELIVERGOODS')   and  a.stockId != null   ";
      if (type == "") {
        CurrentStocklsql1 = CurrentStocklsql1 + " and salesOrgId = '" + orgid1 + "' ";
      }
      CurrentStocklsql1 = CurrentStocklsql1 + "  group by   a.productId ,a.stockId ,a.batchNo ";
      var materiallist = ObjectStore.queryByYonQL(CurrentStocklsql1, "udinghuo");
      let materialMap = {};
      for (var w = 0; w < materiallist.length; w++) {
        var warehouseData = materiallist[w].stockId;
        var productData = materiallist[w].productId;
        var batchnodata = materiallist[w].batchNo;
        if (materiallist[w].batchNo == null) {
          batchnodata = "";
        }
        var key = warehouseData + "-" + productData + "-" + batchnodata;
        materialMap[key] = materiallist[w].subQty;
      }
      for (var i = 0; i < warehouseIds.length; i++) {
        var map = warehouseIds[i];
        var warehouse = map.warehouse;
        var batchno = map.batchno;
        var product = map.product;
        var productname = map.productname;
        var orgid = map.orgid;
        var number = map.number;
        var weight = map.weight;
        var batchUnitid = map.batchUnitid;
        var batchPriceUnitid = map.batchPriceUnitid;
        var CurrentStocksql =
          "select warehouse,product,currentqty,currentSubQty,batchno from " +
          "stock.currentstock.CurrentStock where  currentqty >0   " +
          " and warehouse='" +
          warehouse +
          "'  and product='" +
          product +
          "'  ";
        if (batchno != null && batchno != "") {
          CurrentStocksql = CurrentStocksql + "  and batchno='" + batchno + "' ";
        }
        if (type == "") {
          CurrentStocksql = CurrentStocksql + " and org = '" + orgid + "' ";
        }
        var CurrentStocklist = ObjectStore.queryByYonQL(CurrentStocksql, "ustock");
        if (CurrentStocklist == null || CurrentStocklist.length == 0) {
          let CurrentStock = {};
          CurrentStock["warehouse"] = warehouse;
          CurrentStock["batchno"] = batchno;
          CurrentStock["product"] = product;
          CurrentStock["currentSubQty"] = 0;
          CurrentStock["currentqty"] = 0;
          CurrentStock["productname"] = productname;
          CurrentStock["code"] = 0;
          CurrentStock["msg"] = productname + "库存数量不足";
          resultlist.push(CurrentStock);
        } else {
          var dataRet = CurrentStocklist[0];
          var warehouseData = CurrentStocklist[0].warehouse;
          var batchnodata = CurrentStocklist[0].batchno;
          var productData = CurrentStocklist[0].product;
          if (CurrentStocklist[0].batchno == null) {
            batchnodata = "";
            dataRet["batchno"] = batchnodata;
          }
          var key = warehouseData + "-" + productData + "-" + batchnodata;
          if (resdataMap[key] != null) {
            var xincunl = resdataMap[key];
            if (xincunl.toString().split(".").length > 1 && xincunl.toString().split(".")[1].length > 2) {
              xincunl = xincunl.toFixed(2);
            }
            dataRet["currentqty"] = xincunl; //.toFixed(2)
          }
          if (materialMap[key] != null) {
            var currentSubQty = CurrentStocklist[0].currentSubQty;
            var xincunl = materialMap[key];
            var xiancunjian = currentSubQty - xincunl;
            if (xiancunjian.toString().split(".").length > 1 && xiancunjian.toString().split(".")[1].length > 2) {
              xiancunjian = xiancunjian.toFixed(2);
            }
            dataRet["currentSubQty"] = xiancunjian; //.toFixed(2)
          }
          dataRet["productname"] = productname; //.toFixed(2)
          if (batchUnitid == batchPriceUnitid) {
            if (weight > parseFloat(dataRet.currentqty)) {
              dataRet["code"] = 0;
              dataRet["msg"] = productname + "库存数量不足";
            } else {
              dataRet["code"] = 200;
              dataRet["msg"] = productname + "库存数量充足，可以下单";
            }
          } else {
            if (weight > dataRet.currentqty || number > dataRet.currentSubQty) {
              dataRet["code"] = 0;
              dataRet["msg"] = productname + "库存数量不足";
            } else {
              dataRet["code"] = 200;
              dataRet["msg"] = productname + "库存数量充足，可以下单";
            }
          }
          resultlist.push(dataRet);
        }
      }
    }
    var count = resultlist.length;
    return { resultlist, count };
  }
}
exports({ entryPoint: MyAPIHandler });