let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let mt_org_id = request.org_id;
    let mt_org_name = request.org_name;
    let sale_date = request.sale_date;
    let arr = request.sale_statistics;
    if (arr.length == 0) {
      return {
        msg: "物料个数为0"
      };
    }
    if (arr.length > 100) {
      return {
        msg: "每次物料个数不要超过100"
      };
    }
    //美团门店转成YS客户，一个门店肯定对应一个客户
    let org_sql =
      "select ys_cust_id,ys_cust_name from AT18D4028C3F280009.AT18D4028C3F280009.o2oshop_yscust_mapping left join AT18D4028C3F280009.AT18D4028C3F280009.o2o_shop b on b.o2oshop_yscust_mapping_id = id where b.o2o_org_id = " +
      mt_org_id;
    let org_res = ObjectStore.queryByYonQL(org_sql);
    if (org_res.length == 0) {
      throw new Error("美团门店id[" + mt_org_id + "],在YonSuite中没有对应的客户映射,无法转化,请管理员维护相关关系");
    }
    let customer_id = org_res[0].ys_cust_id;
    let cust_name = org_res[0].ys_cust_name;
    let skuids = " ";
    for (let i = 0; i < arr.length; i++) {
      if (i == arr.length - 1) {
        skuids += arr[i].sku_id;
      } else {
        skuids += arr[i].sku_id + ",";
      }
    }
    //美团物料转成YS物料，一个美团物料可能对应多个YS物料
    let sku_sql =
      "select o2o_sku_id ,o2o_qty,b.ys_sku as ys_sku ,b.ys_sku_name as ys_sku_name,b.qty as ys_qty from AT18D4028C3F280009.AT18D4028C3F280009.o2oys_sku_mapping left join AT18D4028C3F280009.AT18D4028C3F280009.ys_sku b on b.o2oys_sku_mapping_id = id " +
      " where o2o_plat = 1 and dr = 0 and o2o_sku_id in ( " +
      skuids +
      " ) and b.dr = 0";
    let sku_res = ObjectStore.queryByYonQL(sku_sql);
    if (sku_res.length == 0) {
      throw new Error("美团物料id[" + skuids + "],在YonSuite中没有对应的物料映射,无法转化,请管理员维护相关关系");
    }
    let sku_map = new Map();
    for (let i = 0; i < sku_res.length; i++) {
      let sku = sku_res[i];
      let o2o_sku_id = sku.o2o_sku_id;
      if (sku_map.has(o2o_sku_id)) {
        let sku_mapping_arr = sku_map.get(o2o_sku_id);
        sku_mapping_arr.push(sku);
        sku_map.set(o2o_sku_id, sku_mapping_arr);
      } else {
        let sku_mapping_arr = [];
        sku_mapping_arr.push(sku);
        sku_map.set(o2o_sku_id, sku_mapping_arr);
      }
    }
    let o2o_sales = [];
    let no_mapping_skus = [];
    for (let i = 0; i < arr.length; i++) {
      let mt_sku = arr[i];
      let ysskus = sku_map.get(mt_sku.sku_id);
      if (ysskus == undefined || ysskus.length == 0) {
        let no_mapping_sku = {};
        no_mapping_sku.org_id = mt_org_id;
        no_mapping_sku.org_name = mt_org_name;
        no_mapping_sku.o2o_sku_id = mt_sku.sku_id;
        no_mapping_sku.o2o_sku_name = mt_sku.sku_name;
        no_mapping_sku.msg = "O2O物料在YonSuite中没有匹配到对应的物料，请注意验证数据";
        no_mapping_skus.push(no_mapping_sku);
        continue;
      }
      for (let j = 0; j < ysskus.length; j++) {
        let ys_sku = ysskus[j];
        let ys_sales = {};
        ys_sales.customer_id = customer_id;
        ys_sales.customer_name = cust_name;
        ys_sales.sale_date = sale_date;
        ys_sales.sku_id = ys_sku.ys_sku;
        ys_sales.sku_name = ys_sku.ys_sku_name;
        ys_sales.qty = mt_sku.qty * ys_sku.ys_qty;
        o2o_sales.push(ys_sales);
      }
    }
    if (o2o_sales.length > 0) {
      var sales_res = ObjectStore.insertBatch("AT18D4028C3F280009.AT18D4028C3F280009.o2o_sale_statistics", o2o_sales, "o2o_sale_statisticsList");
    }
    if (no_mapping_skus.length > 0) {
      var log_res = ObjectStore.insertBatch("AT18D4028C3F280009.AT18D4028C3F280009.mapping_log", no_mapping_skus, "mapping_logList");
    }
    return {
      code: "0",
      msg: "success"
    };
  }
}
exports({ entryPoint: MyAPIHandler });