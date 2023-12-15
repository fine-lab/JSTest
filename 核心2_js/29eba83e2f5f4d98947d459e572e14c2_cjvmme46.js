let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var idnum = request.idnum;
    var queryHsql = "select * from voucher.delivery.DeliveryVoucher where id='" + idnum + "'";
    var hRes = ObjectStore.queryByYonQL(queryHsql, "udinghuo");
    var queyBsql = "select * from voucher.delivery.DeliveryDetail where deliveryId='" + idnum + "'";
    var bRes = ObjectStore.queryByYonQL(queyBsql, "udinghuo");
    if (bRes == null) {
      throw new Error("数据非最新状态");
    }
    //组装子表数据
    var orderLines = new Array();
    var warehouseId = null;
    for (let i = 0; i < bRes.length; i++) {
      warehouseId = bRes[i].stockId;
      var queryProductSql = " select mnemonicCode from pc.product.ProductDetail where productId='" + bRes[i].productId + "'";
      var productRes = ObjectStore.queryByYonQL(queryProductSql, "productcenter");
      if (productRes.length == 0) {
        throw new Error("物料档案【助记码】为空，请补录！");
      }
      let rebateMoney = bRes[i].rebateMoney;
      if (rebateMoney == null) {
        rebateMoney = 0;
      }
      let settlement_amount = bRes[i].oriSum + rebateMoney; //含税金额+返利分摊金额
      var orderLine = {
        itemCode: productRes[0].mnemonicCode, //商品编码
        planQty: bRes[i].qty, //计划数量
        amount: bRes[i].oriSum, //含税金额
        actualPrice: (settlement_amount / bRes[i].qty).toFixed(3),
        extendProps: {
          bodyid: bRes[i].id,
          distributionAmount: settlement_amount, //结算金额
          discountAmount: rebateMoney //返利分摊金额
        }
      };
      orderLines.push(orderLine);
    }
    var headData = hRes[0];
    //查询客户档案
    var queryAgentSql = "select code from aa.merchant.Merchant  where id='" + headData.agentId + "'";
    var agentRes = ObjectStore.queryByYonQL(queryAgentSql, "productcenter");
    if (agentRes.length == 0) {
      throw new Error("未找到对应的客户档案信息！");
    }
    //查询仓库档案
    var queryWarehouseSql = "select code from aa.warehouse.Warehouse  where id='" + warehouseId + "'";
    var warehouseRes = ObjectStore.queryByYonQL(queryWarehouseSql, "productcenter");
    if (warehouseRes.length == 0) {
      throw new Error("未找到对应的仓库档案信息！");
    }
    var receiveAddressValue = headData.receiveAddress;
    var addressList = receiveAddressValue.split(" ");
    if (addressList[1] == null || addressList[0] == null) {
      throw new Error("收货地址格式存在问题！");
    }
    var deliveryOrder = {
      createTime: request.createTime, //出库单创建时间
      deliveryOrderCode: headData.code, //出库单号
      orderType: "PFDD", //出库单类型,默认
      receiverInfo: {
        //收件人信息
        city: addressList[1], //城市
        detailAddress: receiveAddressValue, //详细地址
        mobile: headData.receiveMobile, //移动电话
        name: headData.receiver, //姓名
        province: addressList[0] //省份
      },
      remark: headData.shippingMemo, //备注
      supplierCode: agentRes[0].code, //供应商编码
      warehouseCode: warehouseRes[0].code //仓库编码
    };
    //拼接巨益json
    let requestValue = {
      deliveryOrder: deliveryOrder,
      extendProps: {
        ysid: idnum,
        wholeSalesOrderType: idnum,
        wholeSalesType: "销售订单"
      },
      orderLines: orderLines
    };
    var date = Date.now();
    let data = {
      params: {
        appKey: "yourKeyHere",
        method: "stockout.create",
        customerId: "yourIdHere",
        timestamp: "" + date
      },
      body: requestValue,
      secrect: "bb31941ed1dc205371281af38e04082e"
    };
    //调用请求地址
    let url = "http://123.57.144.10:9995/allt/getJuYiData";
    //头部信息
    let header = {
      //提交格式
      "Content-Type": "application/json;charset=UTF-8"
    };
    //调用巨益接口发送
    let sendRes = postman("POST", url, JSON.stringify(header), JSON.stringify(data));
    let sendJSON = JSON.parse(sendRes);
    if ("200" == sendJSON.code) {
      let jyJson = JSON.parse(sendJSON.msg);
      if (jyJson.code != "0") {
        throw new Error("调用巨益接口异常：" + jyJson.message);
      }
    } else {
      throw new Error(sendJSON.msg);
    }
    //更新字段
    let updateFunc = extrequire("SCMSA.jyApi.tyMysql");
    var updateOb = { id: idnum, flag: "true" };
    let updateRes = updateFunc.execute(updateOb);
    var resSqlObj = JSON.parse(updateRes.resSql);
    if (resSqlObj.code != "200") {
      throw new Error("同步巨益成功，更新【是否推送巨益】失败，请手动修改！错误信息：" + resSqlObj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });