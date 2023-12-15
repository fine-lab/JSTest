// 写入检验记录
let AbstractAPIHandler = require("AbstractAPIHandler");
let queryUtils = extrequire("GT6219AT7.CommonUtils.QueryUtils");
let getProductInfo = extrequire("GT6219AT7.CommonUtils.getProductInfo");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取对象
    var insertObj = request;
    //补充数据
    let org_id = request.org_id;
    if (queryUtils.isEmpty(org_id)) {
      let org_id_name = request.org_id_name;
      if (queryUtils.isEmpty(org_id_name)) {
        throw new Error("组织不能为空");
      }
      org_id = queryUtils.getIdByName("bd.adminOrg.InventoryOrgVO", org_id_name, "ucf-org-center");
      insertObj.org_id = org_id;
    }
    if (!insertObj.bustype && insertObj.bustype_name && insertObj.bustype_name.length > 0) {
      let bustype_name = request.bustype_name;
      let bustype = queryUtils.getIdByName("aa.businesstype.Businesstype", bustype_name, "transtype");
      insertObj.bustype = bustype;
    }
    if (queryUtils.isEmpty(insertObj.bustype)) {
      throw new Error("交易类型不能为空");
    }
    if (!insertObj.otheroutbusinesstype && insertObj.otheroutbusinesstypeName && insertObj.otheroutbusinesstypeName.length > 0) {
      let otheroutbusinesstypeName = request.otheroutbusinesstypeName;
      let otheroutbusinesstype = queryUtils.getIdByName("aa.businesstype.Businesstype", otheroutbusinesstypeName, "transtype");
      insertObj.otheroutbusinesstype = otheroutbusinesstype;
    }
    if (!insertObj.vendor && insertObj.vendor_name && insertObj.vendor_name.length > 0) {
      let vendor_name = request.vendor_name;
      let vendor = queryUtils.getIdByName("aa.vendor.Vendor", vendor_name, "yssupplier");
      insertObj.vendor = vendor;
    }
    let product = request.product;
    if (queryUtils.isEmpty(product)) {
      let product_name = request.product_name;
      if (queryUtils.isEmpty(product_name)) {
        throw new Error("物料不能为空");
      }
      product = getProductInfo.getProductId(product_name);
      insertObj.product = product;
    }
    let productSku = request.productSku;
    if (queryUtils.isEmpty(productSku)) {
      let productSku_name = request.productSku_name;
      if (queryUtils.isEmpty(productSku_name)) {
        throw new Error("物料SKU不能为空");
      }
      productSku = getProductInfo.getProductSkuId(productSku_name);
      insertObj.productSku = productSku;
    }
    //单位由物料携带
    let productUnitInfo = getProductInfo.getProductUnit(product);
    let unit = request.unit;
    if (queryUtils.isEmpty(unit)) {
      insertObj.unit = productUnitInfo[0].unit;
    }
    let stockUnit = request.stockUnit;
    if (queryUtils.isEmpty(stockUnit)) {
      insertObj.stockUnit = productUnitInfo[0].stockUnit.assistUnit;
      insertObj.invexchrate = productUnitInfo[0].stockUnit.mainUnitCount;
      insertObj.unitexchangetype = productUnitInfo[0].stockUnit.unitExchangeType;
    }
    //检验数量校验
    let subQty = request.subQty;
    let qty = request.qty;
    if (queryUtils.isEmpty(qty) && queryUtils.isEmpty(subQty)) {
      throw new Error("请确定检验数量");
    }
    if (queryUtils.isEmpty(qty)) {
      insertObj.qty = subQty / productUnitInfo[0].stockUnit.mainUnitCount;
    }
    if (queryUtils.isEmpty(subQty)) {
      insertObj.subQty = qty * productUnitInfo[0].stockUnit.mainUnitCount;
    }
    // 检验库存状态
    if (!insertObj.stockstatus && insertObj.stockstatusName && insertObj.stockstatusName.length > 0) {
      let stockstatusName = insertObj.stockstatusName;
      let url = "st.stockStatusRecord.stockStatusRecord";
      let domain = "ustock";
      let sql = "select id from " + url + " where ";
      sql += "(code='" + stockstatusName + "' or statusName='" + stockstatusName + "')";
      let stockstatusRes = ObjectStore.queryByYonQL(sql, domain);
      if (stockstatusRes && stockstatusRes.length > 0) {
        insertObj.stockstatus = stockstatusRes[0].id;
      }
    }
    // 检验结论校验
    let checkconclusion = request.checkconclusion;
    if (queryUtils.isEmpty(checkconclusion)) {
      let checkconclusionName = request.checkconclusionName;
      if (queryUtils.isEmpty(checkconclusionName)) {
        throw new Error("检验结论不能为空");
      }
      let url = "st.stockStatusRecord.stockStatusRecord";
      let domain = "ustock";
      let sql = "select id from " + url + " where ";
      sql += "(code='" + checkconclusionName + "' or statusName='" + checkconclusionName + "')";
      let checkconclusionRes = ObjectStore.queryByYonQL(sql, domain);
      if (!checkconclusionRes || checkconclusionRes.length === 0) {
        throw new Error("检验结论不能为空");
      }
      insertObj.checkconclusion = checkconclusionRes[0].id;
    }
    if (!insertObj.warehouse && insertObj.warehouse_name && insertObj.warehouse_name.length > 0) {
      let warehouse_name = request.warehouse_name;
      let warehouse = queryUtils.getIdByName("aa.warehouse.Warehouse", warehouse_name, "productcenter");
      insertObj.warehouse = warehouse;
    }
    if (!insertObj.checkdepartment && insertObj.checkdepartment_name && insertObj.checkdepartment_name.length > 0) {
      let checkdepartment_name = request.checkdepartment_name;
      let checkdepartment = queryUtils.getIdByName("aa.dept.Department", checkdepartment_name, "productcenter");
      insertObj.checkdepartment = checkdepartment;
    }
    if (!insertObj.reservation && insertObj.reservation_name && insertObj.reservation_name.length > 0) {
      let reservation_name = insertObj.reservation_name;
      let reservation = queryUtils.getIdByName("st.reservation.Reservation", reservation_name, "ustock");
      insertObj.reservation = reservation;
    }
    //货位
    if (!insertObj.goodsposition && insertObj.goodspositionName && insertObj.goodspositionName.length > 0) {
      let goodspositionName = insertObj.goodspositionName;
      let goodsposition = queryUtils.getIdByName("aa.goodsposition.GoodsPosition", goodspositionName, "productcenter");
      insertObj.goodsposition = goodsposition;
    }
    //退货客户
    if (!insertObj.returncustom && insertObj.returncustomName && insertObj.returncustomName.length > 0) {
      let returncustomName = insertObj.returncustomName;
      let returncustom = queryUtils.getIdByName("aa.merchant.Merchant", returncustomName, "productcenter");
      insertObj.returncustom = returncustom;
    }
    //写入数据
    var res = ObjectStore.insert("GT6219AT7.GT6219AT7.inspection", insertObj, "inspection");
    return res;
  }
}
// 对外暴露api
exports({ entryPoint: MyAPIHandler });