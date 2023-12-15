let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var req = JSON.parse(param.requestData);
    var id = param.data[0].id;
    var customerId = req.agentId;
    var date = req.vouchdate;
    if (date == undefined) {
      date = req.confirmDate;
    }
    //查询订单详情
    var sql = "select * from voucher.order.OrderDetail where orderId='" + id + "'";
    var res = ObjectStore.queryByYonQL(sql, "udinghuo");
    if (res.length == 0) {
      throw new Error("未找到销售订单对应表体数据！");
    }
    //根据客户查询计划量表
    var sql =
      "select * from AT164D981209380003.AT164D981209380003.salesPlan where customer =" +
      customerId +
      " and isTakeEffect='" +
      true +
      "'" +
      " and takeEffectTime<=" +
      "'" +
      date +
      "'" +
      " and planEffectiveEndDate>=" +
      "'" +
      date +
      "'" +
      " and planEffectiveDate<=" +
      "'" +
      date +
      "'";
    var custRes = ObjectStore.queryByYonQL(sql, "developplatform");
    if (custRes.length == 0) {
      //根据客户查询客户分类
      var selectTypesql = "select * from aa.merchant.Merchant where id='" + customerId + "'";
      var typeRes = ObjectStore.queryByYonQL(selectTypesql, "productcenter");
      //根据客户分类查询计划量表
      if (typeRes.length != 0) {
        if (typeRes[0].merchantCharacter.attrext1 != undefined) {
          var sql =
            "select * from AT164D981209380003.AT164D981209380003.salesPlan where customerType ='" +
            typeRes[0].merchantCharacter.attrext1 +
            "' and isTakeEffect='" +
            true +
            "'" +
            " and takeEffectTime<=" +
            "'" +
            date +
            "'" +
            " and planEffectiveEndDate>=" +
            "'" +
            date +
            "'" +
            " and planEffectiveDate<=" +
            "'" +
            date +
            "'";
          custRes = ObjectStore.queryByYonQL(sql, "developplatform");
        }
      }
    }
    if (custRes.length == 0) {
      //未找到计划表
      return {};
    }
    //更改自定义项
    var array = new Array();
    for (var i = 0; i < res.length; i++) {
      var productId = res[i].productId;
      //根据id查询计划量子表
      var selectSql = "select * from AT164D981209380003.AT164D981209380003.planSalesForm where salesPlan_id =" + custRes[0].id + " and productId='" + productId + "'";
      var result = ObjectStore.queryByYonQL(selectSql, "developplatform");
      if (result.length != 0) {
        var resId = result[0].id;
        var availableQuantity = result[0].availableQuantity;
        var count = res[i].qty;
        //订单执行量
        var executionQuantity = result[0].executionQuantity;
        if (executionQuantity == null) {
          executionQuantity = 0;
        }
        executionQuantity = executionQuantity - count;
        //剩余可供量
        var availableQuantity = result[0].availableQuantity;
        //计划可供量
        var plannedAvailability = result[0].plannedAvailability;
        //超计划量
        var overPlannedQuantity = 0;
        if (plannedAvailability >= executionQuantity) {
          availableQuantity = plannedAvailability - executionQuantity;
          overPlannedQuantity = 0;
        } else {
          availableQuantity = 0;
          overPlannedQuantity = executionQuantity - plannedAvailability;
        }
        let body = {
          id: resId,
          executionQuantity: executionQuantity,
          overPlannedQuantity: overPlannedQuantity,
          availableQuantity: availableQuantity
        };
        //计划内数量
        var plannedQuantity = 0;
        //计划外数量
        var unPlannedQuantity = 0;
        //剩余可供量
        var newavailableQuantity = availableQuantity;
        if (newavailableQuantity >= count) {
          //剩余可供量>=订单数量
          plannedQuantity = count;
          unPlannedQuantity = 0;
        } else {
          plannedQuantity = newavailableQuantity;
          unPlannedQuantity = count - plannedQuantity;
        }
        let updatebody = {
          id: res[i].id,
          orderDetailDefineCharacter: {
            bodyDefine2: plannedQuantity,
            bodyDefine3: unPlannedQuantity,
            bodyDefine5: availableQuantity,
            id: res[i].orderDetailDefineCharacter.id
          }
        };
        array.push(updatebody);
        let header = { "Content-Type": "application/json;charset=UTF-8" };
        let httpUrl = "https://www.example.com/";
        let httpRes = postman("GET", httpUrl, JSON.stringify(header), JSON.stringify(null));
        let httpResData = JSON.parse(httpRes);
        if (httpResData.code != "00000") {
          throw new Error("获取数据中心信息出错" + httpResData.message);
        }
        let func1 = extrequire("SCMSA.jyApi.getToken");
        let tokenRes = func1.execute(null);
        let token = tokenRes.access_token;
        let url = "https://www.example.com/" + token;
        let resSql = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
      }
    }
    if (array.length > 0) {
      let func2 = extrequire("SCMSA.jyApi.updateUndefine");
      var updateData = {
        id: id,
        orderDetails: array
      };
      let tokenRes = func2.execute({ id: updateData });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });