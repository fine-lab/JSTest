let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var idnum = request.idnum;
    var queryHsql = "select * from voucher.salereturn.SaleReturn where id='" + idnum + "'";
    var hRes = ObjectStore.queryByYonQL(queryHsql, "udinghuo");
    var queyBsql = "select * from voucher.salereturn.SaleReturnDetail where saleReturnId='" + idnum + "'";
    var bRes = ObjectStore.queryByYonQL(queyBsql, "udinghuo");
    if (bRes == null) {
      throw new Error("数据非最新状态");
    }
    //组装子表数据
    var orderLines = new Array();
    var warehouseId = null;
    var reqOwnerCode = null;
    for (let i = 0; i < bRes.length; i++) {
      warehouseId = bRes[i].stockId;
      if (warehouseId == null) {
        throw new Error("仓库信息为空！");
      }
      var queryProductSql = " select * from pc.product.ProductDetail where productId='" + bRes[i].productId + "'";
      var productRes = ObjectStore.queryByYonQL(queryProductSql, "productcenter");
      if (productRes == null) {
        throw new Error("未找到对应的商品信息！");
      }
      var queryWarehouseSql = "select * from aa.warehouse.Warehouse  where id='" + warehouseId + "'";
      var ownerCode = ObjectStore.queryByYonQL(queryWarehouseSql, "productcenter");
      if (ownerCode.length == 0) {
        throw new Error("未找到对应的仓库档案信息！");
      }
      reqOwnerCode = ownerCode[0].defineCharacter.attrext6;
      let rebateMoney = bRes[i].rebateMoney;
      if (rebateMoney == null) {
        rebateMoney = 0;
      }
      let discountAmount = bRes[i].oriSum + rebateMoney; //含税金额+返利分摊金额
      var orderLine = {
        itemCode: productRes[0].mnemonicCode, //商品编码
        ownerCode: reqOwnerCode, //货主仓库编码,
        planQty: bRes[i].qty, //计划数量
        discountAmount: discountAmount, //含税金额+返利分摊金额
        discountPrice: discountAmount == 0 ? 0 : (discountAmount / bRes[i].qty).toFixed(3),
        extendProps: {
          bodyid: bRes[i].id,
          tax_amount: bRes[i].oriSum, //含税金额
          tax_price: bRes[i].oriSum == 0 ? 0 : (bRes[i].oriSum / bRes[i].qty).toFixed(3), //含税单价
          bonus_amount: rebateMoney, //返利分摊金额
          bonus_price: rebateMoney == 0 ? 0 : (rebateMoney / bRes[i].qty).toFixed(3) //返利分摊单价
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
    var deliveryAddress = headData.deliveryAddress;
    var addressList = deliveryAddress.split(" ");
    if (addressList[1] == null || addressList[0] == null) {
      throw new Error("收货地址格式存在问题！");
    }
    var receiverInfo = {
      //收件人信息
      city: addressList[1], //城市
      detailAddress: deliveryAddress, //详细地址
      mobile: headData.receiveMobile, //移动电话
      name: headData.receiver, //姓名
      province: addressList[0] //省份
    };
    var entryOrderCode = headData.code;
    if (headData.salereturnDefineCharacter.headDefine7 != null) {
      entryOrderCode = headData.salereturnDefineCharacter.headDefine7 + "-" + entryOrderCode;
    }
    //拼接巨益json
    let requestValue = {
      entryOrder: {
        orderType: "PFTHD",
        entryOrderCode: entryOrderCode,
        ownerCode: reqOwnerCode, //货主仓库编码,
        supplierCode: agentRes[0].code, //供应商编码
        warehouseCode: ownerCode[0].code, //仓库编码
        remark: request.remark, //备注
        receiverInfo: receiverInfo
      },
      extendProps: {
        ysid: idnum,
        wholeSalesType: headData.saleReturnReason
      },
      orderLines: orderLines
    };
    var date = Date.now();
    let data = {
      params: {
        appKey: "yourKeyHere",
        method: "entryorder.create",
        customerId: "yourIdHere",
        timestamp: "" + date
      },
      body: requestValue,
      secrect: "bb31941ed1dc205371281af38e04082e"
    };
    //调用请求地址
    let url = "https://www.example.com/";
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
    let updateFunc = extrequire("SCMSA.jyApi.returnOrderToYS");
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