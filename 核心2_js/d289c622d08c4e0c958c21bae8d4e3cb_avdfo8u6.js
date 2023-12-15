let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //子表信息
    var orderDetails = param.data[0].orderDetails;
    //单据日期
    var date = param.data[0].orderDate;
    //客户id
    var customerId = param.data[0].agentId;
    //根据客户查询计划量表
    var sql =
      "select * from AT164D981209380003.AT164D981209380003.salesPlan where customer ='" +
      customerId +
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
    var custRes = ObjectStore.queryByYonQL(sql, "developplatform");
    if (custRes.length == 0) {
      //根据客户查询客户分类
      var selectTypesql = "select * from aa.merchant.Merchant where id='" + customerId + "'";
      var typeRes = ObjectStore.queryByYonQL(selectTypesql, "productcenter");
      if (typeRes.length != 0) {
        if (typeRes[0].merchantCharacter.attrext1 != undefined) {
          //根据客户分类查询计划量表
          var typesql =
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
          custRes = ObjectStore.queryByYonQL(typesql, "developplatform");
        }
      }
    }
    var requ = param.requestData;
    var urlFunc = extrequire("SCMSA.jyApi.gatWayUrl");
    var urlRes = urlFunc.execute(null);
    var gatewayUrl = urlRes.gatewayUrl;
    if (0 != param.data[0].status) {
      for (var j = 0; j < orderDetails.length; j++) {
        let queryOldSql = "select qty from voucher.order.OrderDetail where id='" + orderDetails[j].id + "'";
        var oldRes = ObjectStore.queryByYonQL(queryOldSql, "udinghuo");
        if (oldRes[0] == undefined) {
          throw new Error("8订单明细行数据有误" + i);
        }
        if (oldRes[0].qty == undefined) {
          throw new Error("9订单明细行数量有误" + i);
        }
        if (orderDetails[j] == undefined) {
          throw new Error("11订单明细行数据有误" + i);
        }
        if (orderDetails[j].qty == undefined) {
          throw new Error("11订单明细行数量有误" + i);
        }
        //变更前数量
        var oldqty = oldRes[0].qty;
        //更改后数量
        var nowQty = orderDetails[j].qty;
        var define2Value = 0; //计划内
        var define3Value = 0; //计划外
        var define5Value = 0; //剩余可供量
        if (custRes.length > 0) {
          //存在计划表
          var productId = orderDetails[j].productId;
          //根据id查询计划量子表
          var selecnowtSql = "select * from AT164D981209380003.AT164D981209380003.planSalesForm where salesPlan_id ='" + custRes[0].id + "' and productId='" + productId + "'";
          var nowResult = ObjectStore.queryByYonQL(selecnowtSql, "developplatform");
          if (nowResult.length > 0) {
            //存在物料
            //订单执行量
            var executionQuantity = nowResult[0].executionQuantity == null ? 0 : nowResult[0].executionQuantity;
            //剩余可供量
            var availableQuantity = nowResult[0].availableQuantity == null ? 0 : nowResult[0].availableQuantity;
            //超计划量
            var overPlannedQuantity = nowResult[0].overPlannedQuantity == null ? 0 : nowResult[0].overPlannedQuantity;
            //计划可供量
            var plannedAvailability = nowResult[0].plannedAvailability == null ? 0 : nowResult[0].plannedAvailability;
            if (executionQuantity >= plannedAvailability) {
              if (overPlannedQuantity >= oldqty) {
                availableQuantity = 0;
                overPlannedQuantity = overPlannedQuantity - oldqty;
              } else {
                availableQuantity = availableQuantity + (oldqty - overPlannedQuantity);
                overPlannedQuantity = 0;
              }
            } else {
              overPlannedQuantity = 0;
              availableQuantity = availableQuantity + oldqty;
            }
            executionQuantity = executionQuantity - oldqty;
            executionQuantity = executionQuantity + nowQty;
            if (nowQty >= availableQuantity) {
              define2Value = availableQuantity;
              overPlannedQuantity = nowQty - availableQuantity;
              availableQuantity = 0;
            } else {
              define2Value = nowQty;
              overPlannedQuantity = 0;
              availableQuantity = availableQuantity - nowQty;
            }
            define3Value = overPlannedQuantity;
            define5Value = availableQuantity;
            var resId = nowResult[0].id;
            //更改计划表
            let body = {
              id: resId,
              executionQuantity: executionQuantity,
              overPlannedQuantity: overPlannedQuantity,
              availableQuantity: availableQuantity
            };
            let header = { "Content-Type": "application/json;charset=UTF-8" };
            let func1 = extrequire("SCMSA.jyApi.getToken");
            let tokenRes = func1.execute(null);
            let token = tokenRes.access_token;
            let url = gatewayUrl + "/avdfo8u6/custom/custom_api/update/count?access_token=" + token;
            let resSql = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
          } else {
            define2Value = 0;
            define3Value = nowQty;
            define5Value = 0;
          }
        } else {
          define2Value = 0;
          define3Value = nowQty;
          define5Value = 0;
        }
        let bodyItemValue = orderDetails[j].bodyItem;
        bodyItemValue.set("define2", define2Value + "");
        bodyItemValue.set("define3", define3Value + "");
        bodyItemValue.set("define5", define5Value + "");
      }
      return {};
    }
    for (var i = 0; i < orderDetails.length; i++) {
      //子表物料
      var productId = orderDetails[i].productId;
      //计划内数量
      var plannedQuantity = 0;
      //计划外数量
      var unPlannedQuantity = 0;
      var availableQuantity = 0;
      if (custRes.length != 0) {
        //存在计划表
        //根据id查询计划量子表
        var selectSql = "select * from AT164D981209380003.AT164D981209380003.planSalesForm where salesPlan_id ='" + custRes[0].id + "' and productId='" + productId + "'";
        var result = ObjectStore.queryByYonQL(selectSql, "developplatform");
        if (result.length != 0) {
          //计划表中存在物料
          plannedQuantity = result[0].plannedAvailability;
          unPlannedQuantity = result[0].overPlannedQuantity;
          //剩余可供量
          availableQuantity = result[0].availableQuantity;
          if (availableQuantity == undefined) {
            availableQuantity = 0;
          }
          if (plannedQuantity == undefined) {
            plannedQuantity = 0;
          }
          if (unPlannedQuantity == undefined) {
            unPlannedQuantity = 0;
          }
          if (orderDetails[i] == undefined) {
            throw new Error("1订单明细行数据有误" + i);
          }
          if (orderDetails[i].qty == undefined) {
            throw new Error("1订单明细行数量有误" + i);
          }
          var qty = orderDetails[i].qty;
          if (qty <= availableQuantity) {
            unPlannedQuantity = 0;
            plannedQuantity = qty;
            availableQuantity = availableQuantity - qty;
          } else {
            plannedQuantity = availableQuantity;
            unPlannedQuantity = qty - availableQuantity;
          }
        } else {
          //计划表中不存在物料
          plannedQuantity = 0;
          if (orderDetails[i] == undefined) {
            throw new Error("2订单明细行数据有误" + i);
          }
          if (orderDetails[i].qty == undefined) {
            throw new Error("2订单明细行数量有误" + i);
          }
          unPlannedQuantity = orderDetails[i].qty;
          availableQuantity = 0;
        }
      } else {
        //不存在计划表
        plannedQuantity = 0;
        if (orderDetails[i] == undefined) {
          throw new Error("3订单明细行数据有误" + i);
        }
        if (orderDetails[i].qty == undefined) {
          throw new Error("4订单明细行数量有误" + i);
        }
        unPlannedQuantity = orderDetails[i].qty;
        availableQuantity = 0;
      }
      if (orderDetails[i].bodyItem == null) {
        orderDetails[i].set("bodyItem", {});
        let bodyItemValue = orderDetails[i].bodyItem;
        bodyItemValue.set("_realtype", true);
        bodyItemValue.set("_entityName", "voucher.order.OrderDetailDefine");
        bodyItemValue.set("_keyName", "orderDetailId");
        bodyItemValue.set("_status", "Insert");
        bodyItemValue.set("orderDetailId", orderDetails[i].id + "");
        bodyItemValue.set("code", param.data[0].code + "");
        bodyItemValue.set("orderDetailKey", orderDetails[i].idKey + "");
        bodyItemValue.set("orderId", param.data[0].id + "");
        bodyItemValue.set("id", orderDetails[i].id + "");
        bodyItemValue.set("define2", plannedQuantity + "");
        bodyItemValue.set("define3", unPlannedQuantity + "");
        bodyItemValue.set("define5", availableQuantity + "");
      } else {
        let bodyItemValue = orderDetails[i].bodyItem;
        bodyItemValue.set("define2", plannedQuantity + "");
        bodyItemValue.set("define3", unPlannedQuantity + "");
        bodyItemValue.set("define5", availableQuantity + "");
      }
      orderDetails[i].set("receivedBilling", "true" + "");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });