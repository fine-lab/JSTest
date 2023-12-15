let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let inventoryData = request.tableResult;
    let requestBody = {
      // 客户编码
      customerCode: inventoryData.CUSTOMER_ID,
      // 注册人/备案人名称
      registrant: inventoryData.registrant,
      // 仓库代码
      warehouseCode: inventoryData.warehouseCode,
      // 入库时间
      rcvd_date: inventoryData.EXTRACTDATE,
      // 产品编码
      sku: inventoryData.sku,
      // 规格型号
      specifications: inventoryData.specifications,
      // 产品名称
      producrName: inventoryData.producrName,
      // 单位
      unit: inventoryData.unit,
      //受托生产生产企业名称
      enterprise_name: inventoryData.enterprise_name,
      // 产品注册证备案凭证号
      product_umber: inventoryData.product_umber,
      // 生产批号
      batch_nbr: inventoryData.batch_nbr,
      // 生产日期
      mfg_date: inventoryData.mfg_date,
      // 有效期
      xpire_date: inventoryData.xpire_date,
      // 库存地点
      location: inventoryData.location,
      // 库存数量
      quantity: inventoryData.quantity,
      // 储运条件
      transportation_conditions: inventoryData.transportation_conditions,
      // 质量状态
      inventory_status: inventoryData.inventory_status,
      // 是否医疗器械
      isMedical: inventoryData.isMedical,
      CasrNBR: inventoryData.CaseNBR
    };
    var res = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory", requestBody, "yb71490dae");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });