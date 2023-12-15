let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //客户id
    var agentId = request.agentId;
    //下单日期
    var orderdate = request.orderdate;
    //依据客户id查询客户信息
    var queryAgentSql = "select * from aa.merchant.Merchant where id='" + agentId + "'";
    var agentRes = ObjectStore.queryByYonQL(queryAgentSql, "productcenter");
    if (agentRes.length == 0) {
      throw new Error("未查询到对应客户档案信息");
    }
    //客户级别
    var channCustomerLevel = agentRes[0].channCustomerLevel;
    //销售区域
    var queryAreaSql = "select * from aa.merchant.CustomerArea where merchantId='" + agentId + "' and isDefault='true'";
    var areatRes = ObjectStore.queryByYonQL(queryAreaSql, "productcenter");
    if (channCustomerLevel == undefined || areatRes.length == 0) {
      throw new Error("对应客户级别/默认销售区域未填写");
    }
    var customerArea = areatRes[0].saleAreaId;
    //查询销售区域所有上级
    let querySql = "select path from aa.salearea.SaleArea where id='" + customerArea + "'";
    var areaRes = ObjectStore.queryByYonQL(querySql, "productcenter");
    let pathValue = areaRes[0].path;
    var pathArry = pathValue.split("|"); //拆分
    var newPathArry = pathArry.slice(0, pathArry.length - 1); //去除最后一个空字符
    //拼接字符串
    var allCustomerArea = "";
    for (var i = 0; i < newPathArry.length; i++) {
      allCustomerArea = allCustomerArea + "'" + newPathArry[i];
      if (i == newPathArry.length - 1) {
        allCustomerArea = allCustomerArea + "'";
      } else {
        allCustomerArea = allCustomerArea + "',";
      }
    }
    var recordList = new Array();
    //依据客户级别、销售区域、下单日期查询【促销活动S+A】菜单
    var queryPriceDisSql =
      "select * from AT168A435A08100007.AT168A435A08100007.price_discounts where dr=0 and verifystate='2' and  clientrank='" +
      channCustomerLevel +
      "' and marketarea in (" +
      allCustomerArea +
      ") and enable='1' and startdate<='" +
      orderdate +
      "' and enddate>='" +
      orderdate +
      "'";
    var priceDisRes = ObjectStore.queryByYonQL(queryPriceDisSql, "developplatform");
    if (priceDisRes.length > 0) {
      for (var i = 0; i < priceDisRes.length; i++) {
        var activity = {
          id: priceDisRes[i].id,
          name: priceDisRes[i].activity_name,
          type: 1
        };
        recordList.push(activity);
      }
    }
    //查询客户级别、销售区域为空数据
    var queryPriceDisSql1 =
      "select * from AT168A435A08100007.AT168A435A08100007.price_discounts where dr=0 and verifystate='2' and enable='1' and startdate<='" +
      orderdate +
      "' and enddate>='" +
      orderdate +
      "' and clientrank is null and marketarea is null  ";
    var priceDisRes1 = ObjectStore.queryByYonQL(queryPriceDisSql1, "developplatform");
    if (priceDisRes1.length > 0) {
      for (var i1 = 0; i1 < priceDisRes1.length; i1++) {
        var activity = {
          id: priceDisRes1[i1].id,
          name: priceDisRes1[i1].activity_name,
          type: 1
        };
        recordList.push(activity);
      }
    }
    //查询客户级别为空数据
    var queryPriceDisSql2 =
      "select * from AT168A435A08100007.AT168A435A08100007.price_discounts where dr=0 and verifystate='2' and clientrank is null and marketarea in (" +
      allCustomerArea +
      ") and enable='1' and startdate<='" +
      orderdate +
      "' and enddate>='" +
      orderdate +
      "'";
    var priceDisRes2 = ObjectStore.queryByYonQL(queryPriceDisSql2, "developplatform");
    if (priceDisRes2.length > 0) {
      for (var i2 = 0; i2 < priceDisRes2.length; i2++) {
        var activity = {
          id: priceDisRes2[i2].id,
          name: priceDisRes2[i2].activity_name,
          type: 1
        };
        recordList.push(activity);
      }
    }
    //销售区域为空数据
    var queryPriceDisSql3 =
      "select * from AT168A435A08100007.AT168A435A08100007.price_discounts where dr=0 and verifystate='2' and clientrank='" +
      channCustomerLevel +
      "' and marketarea is null and enable='1' and startdate<='" +
      orderdate +
      "' and enddate>='" +
      orderdate +
      "'";
    var priceDisRes3 = ObjectStore.queryByYonQL(queryPriceDisSql3, "developplatform");
    if (priceDisRes3.length > 0) {
      for (var i3 = 0; i3 < priceDisRes3.length; i3++) {
        var activity = {
          id: priceDisRes3[i3].id,
          name: priceDisRes3[i3].activity_name,
          type: 1
        };
        recordList.push(activity);
      }
    }
    //依据客户级别、销售区域、下单日期查询【促销活动S/A】菜单
    var queryPriceActSql =
      "select * from AT168A435A08100007.AT168A435A08100007.promotion_activity where dr=0 and verifystate='2' and client_grade='" +
      channCustomerLevel +
      "' and market_area in (" +
      allCustomerArea +
      ") and enable='1' and startdate<='" +
      orderdate +
      "' and enddate>='" +
      orderdate +
      "'";
    var priceActRes = ObjectStore.queryByYonQL(queryPriceActSql, "developplatform");
    if (priceActRes.length > 0) {
      for (var j = 0; j < priceActRes.length; j++) {
        var activity = {
          id: priceActRes[j].id,
          name: priceActRes[j].promotion_name,
          type: 2
        };
        recordList.push(activity);
      }
    }
    //查询客户级别、销售区域为空数据
    var queryPriceActSql1 =
      "select * from AT168A435A08100007.AT168A435A08100007.promotion_activity where dr=0 and verifystate='2' and enable='1' and startdate<='" +
      orderdate +
      "' and enddate>='" +
      orderdate +
      "' and client_grade is null  and market_area is null";
    var priceActRes1 = ObjectStore.queryByYonQL(queryPriceActSql1, "developplatform");
    if (priceActRes1.length > 0) {
      for (var j1 = 0; j1 < priceActRes1.length; j1++) {
        var activity = {
          id: priceActRes1[j1].id,
          name: priceActRes1[j1].promotion_name,
          type: 2
        };
        recordList.push(activity);
      }
    }
    //查询客户级别为空数据
    var queryPriceActSql2 =
      "select * from AT168A435A08100007.AT168A435A08100007.promotion_activity where dr=0 and verifystate='2' and client_grade is null and market_area in (" +
      allCustomerArea +
      ") and enable='1' and startdate<='" +
      orderdate +
      "' and enddate>='" +
      orderdate +
      "'";
    var priceActRes2 = ObjectStore.queryByYonQL(queryPriceActSql2, "developplatform");
    if (priceActRes2.length > 0) {
      for (var j2 = 0; j2 < priceActRes2.length; j2++) {
        var activity = {
          id: priceActRes2[j2].id,
          name: priceActRes2[j2].promotion_name,
          type: 2
        };
        recordList.push(activity);
      }
    }
    //查询销售区域为空数据
    var queryPriceActSql3 =
      "select * from AT168A435A08100007.AT168A435A08100007.promotion_activity where dr=0 and verifystate='2' and client_grade='" +
      channCustomerLevel +
      "' and market_area is  null and enable='1' and startdate<='" +
      orderdate +
      "' and enddate>='" +
      orderdate +
      "'";
    var priceActRes3 = ObjectStore.queryByYonQL(queryPriceActSql3, "developplatform");
    if (priceActRes3.length > 0) {
      for (var j3 = 0; j3 < priceActRes3.length; j3++) {
        var activity = {
          id: priceActRes3[j3].id,
          name: priceActRes3[j3].promotion_name,
          type: 2
        };
        recordList.push(activity);
      }
    }
    return { recordList };
  }
}
exports({ entryPoint: MyAPIHandler });