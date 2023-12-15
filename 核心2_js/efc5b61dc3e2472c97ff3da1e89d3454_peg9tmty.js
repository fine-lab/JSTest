let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var paramList = request.list;
    let arr = new Array();
    for (var i = 0; i < paramList.length; i++) {
      var data = paramList[i];
      let dataBody = {
        // 客户编码
        customerCode: data.customerCode,
        // 注册人/备案人名称
        registrant: data.registrant,
        // 仓库代码
        warehouseCode: data.warehouseCode,
        // 入库时间
        rcvd_date: data.rcvd_date,
        // 产品编码
        sku: data.sku,
        // 规格型号
        specifications: data.specifications,
        // 产品名称
        producrName: data.producrName,
        // 单位
        unit: data.unit,
        //受托生产生产企业名称
        enterprise_name: data.enterprise_name,
        // 产品注册证备案凭证号
        product_umber: data.product_umber,
        // 生产批号
        batch_nbr: data.batch_nbr,
        // 生产日期
        mfg_date: data.mfg_date,
        // 有效期
        xpire_date: data.xpire_date,
        // 库存地点
        location: data.location,
        // 库存数量
        quantity: data.quantity,
        // 储运条件
        transportation_conditions: data.transportation_conditions,
        // 质量状态
        inventory_status: data.inventory_status,
        // 是否医疗器械
        isMedical: data.isMedical,
        CasrNBR: data.CaseNBR,
        enable: data.enable
      };
      arr.push(dataBody);
    }
    var res = ObjectStore.insertBatch("AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory", arr, "yb71490dae");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });