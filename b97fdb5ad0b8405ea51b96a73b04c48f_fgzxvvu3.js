let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var targetType = request.targetType;
    var orderCode = request.order.code; // 销售订单编码
    var creator_a = request.order.creator; // 销售订单创建人 - 制单人
    var corpContactUserName = request.order.corpContactUserName; // 销售业务员
    var createDate = request.order.createDate.substr(0, 10); // 销售日期
    var creator_b = null; // 售发货单制单人 - 拣货人
    var deliveryCode = null; // 发货单code
    if ("1" == targetType) {
      var targetCode = request.delivery.code;
      creator_b = request.delivery.creator;
      deliveryCode = targetCode;
    } else {
      var targetCode = request.order.code;
      targetCode = orderCode;
    }
    var querySql = "select * from st.salesout.SalesOut where srcBillType = '" + targetType + "' and srcBillNO = '" + targetCode + "'";
    var dataArr = ObjectStore.queryByYonQL(querySql, "ustock"); // 获取出库单
    var mainDataArr = []; // 存放出库数据
    for (var i = dataArr.length - 1; i >= 0; i--) {
      let id = dataArr[i].id; // 出库单主表id
      let producedate = dataArr[i].vouchdate.substr(0, 10); // 单据日期 多张出库单单据日期是否一致？
      let creator = dataArr[i].creator; // 单据创建人
      let memo = dataArr[i].memo; // 备注
      var cust = dataArr[i].cust; // 客户id
      // 客户信息获取
      var agentSql = "select * from voucher.delivery.Agent where id = '" + cust + "'";
      var agentArr = ObjectStore.queryByYonQL(agentSql, "udinghuo");
      var agentCode = agentArr[0].code;
      let agentName = agentArr[0].name;
      let cReceiveAddress = dataArr[i].cReceiveAddress; // 收货地址
      let cReceiveMobile = dataArr[i].cReceiveMobile; // 收获人手机号
      var sQuerySql = "select * from st.salesout.SalesOuts where mainid = '" + id + "'";
      var sDataArr = ObjectStore.queryByYonQL(sQuerySql, "ustock"); // 获取出库单详情
      for (var j = sDataArr.length - 1; j >= 0; j--) {
        let obj = {};
        let s = sDataArr[j];
        // 主表数据填充
        obj.mainProduceDate = producedate; // 出库主表单据日期
        obj.creator = creator; // 出库主表创建人
        obj.creator_a = creator_a; // 销售订单创建人
        obj.creator_b = creator_b; // 销售出库单创建人
        obj.corpContactUserName = corpContactUserName; // 销售业务员
        obj.createDate = createDate; // 销售日期
        obj.mainid = id; // 出库单主表id
        obj.memo = memo; // 出库单主表备注
        obj.cReceiveAddress = cReceiveAddress; // 收货地址
        obj.cReceiveMobile = cReceiveMobile; // 收货人手机号
        obj.agentCode = agentCode; // 客户编码
        obj.agentName = agentName; // 客户名称
        obj.agentId = cust; // 客户id
        obj.orderCode = orderCode; // 销售订单code
        obj.deliveryCode = deliveryCode; // 发货单code
        // 子表数据填充
        obj.product = s.product; // 物料id 获取物料信息
        var productSql = "select * from pc.product.Product where id = '" + s.product + "'";
        var productArr = ObjectStore.queryByYonQL(productSql, "productcenter"); // 获取物料详情
        let product = productArr[0];
        obj.product_name = product.name; // 物料名称
        obj.product_code = product.code; // 物料编码
        obj.unit = product.unit; // 计量单位id
        var unitSql = "select * from pc.unit.Unit where id = '" + product.unit + "'";
        var unitArr = ObjectStore.queryByYonQL(unitSql, "productcenter"); // 获取物料主计量单位中文名称
        obj.unitName = unitArr[0].name;
        obj.id = product.id; // 物料id
        // 获取sku信息
        var skuSql = "select * from pc.product.ProductSKU where id = '" + s.productsku + "'";
        var skuArr = ObjectStore.queryByYonQL(productSql, "productcenter"); // 获取sku
        let productSku = skuArr[0];
        obj.skuCode = productSku.code; // sku编码 (sku表 的 cCode 无法查出数据 使用 code)
        obj.orderId = s.orderId; // 销售订单id
        obj.extendProPlace = s.extendProPlace; // 产地
        obj.extendMfrs = s.extendMfrs; // 生产厂家
        obj.extend_package_specification = s.extend_package_specification; // 规格(包装规格)
        obj.extendTotalQualified = s.qty; // 数量（数量、件数两个参数都取该值）
        obj.extendTotalQualified_d = s.subQty; // 件数（数量、件数两个参数都取该值）
        obj.extendDosageForm = s.extendDosageForm; // 剂型
        obj.extendLicenseNumber = s.extendLicenseNumber; // 批准文号
        obj.producedate = s.producedate; // 生产日期
        obj.invaliddate = s.invaliddate; // 有效期
        obj.batchno = s.batchno; // 批次号
        obj.stockUnitId = s.stockUnitId; // 库存单位
        obj.unit = s.priceUOM; // 计价单位
        obj.oriTaxUnitPrice = s.oriTaxUnitPrice; // 含税单价
        obj.oriSum = s.oriSum; // 含税金额
        obj.A925 = s.salesOutsDefineCharacter.A925; // 公司价（折前价）
        obj.A2315 = s.salesOutsDefineCharacter.A2315; // 折后价（行折扣金额）
        let sellType = s.salesOutsDefineCharacter.sellType; // 类型 售卖类型
        obj.sellType = sellType;
        if (sellType == "1") {
          obj.sellTypeName = "买";
        } else if (sellType == "2") {
          obj.sellTypeName = "增";
        } else if (sellType == "4") {
          obj.sellTypeName = "反";
        } else {
          obj.sellTypeName = "特价";
        }
        mainDataArr.push(obj);
      }
    }
    return { mainDataArr: mainDataArr };
  }
}
exports({
  entryPoint: MyAPIHandler
});