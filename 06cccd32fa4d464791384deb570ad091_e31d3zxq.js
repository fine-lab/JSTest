let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let masterId = request.masterId;
    let str_masterIds = masterId.join(",");
    let masterRes = [];
    //查询不合格主表
    let masterSql = "select * from GT22176AT10.GT22176AT10.SY01_bad_drugv7 where id in (" + str_masterIds + ")";
    let masRes = ObjectStore.queryByYonQL(masterSql, "sy01");
    //查询不合格子表
    let childSql = "select * from GT22176AT10.GT22176AT10.SY01_unqualison7 where SY01_bad_drugv2_id in (" + str_masterIds + ")";
    let childRes = ObjectStore.queryByYonQL(childSql, "sy01");
    let productIds = [];
    let childObj = {};
    let childArr = [];
    let warehouseIds = [];
    if (childRes.length > 0) {
      for (let i = 0; i < childRes.length; i++) {
        productIds.push(childRes[i].product_code);
        warehouseIds.push(childRes[i].warehouse);
        childObj[childRes[i].SY01_bad_drugv2_id] = childRes[i];
        childArr.push(childObj);
      }
    }
    let str_productIds = productIds.join(",");
    //查询物料
    let productSql = "select * from pc.product.Product where id in (" + str_productIds + ")";
    let productRes = ObjectStore.queryByYonQL(productSql, "productcenter");
    let productObj = {};
    if (productRes.length > 0) {
      for (let i = 0; i < productRes.length; i++) {
        productObj[productRes[i].id] = productRes[i];
      }
    }
    //查询物料SKU
    let productSKUSql = "select * from pc.product.ProductSKU where productId in (" + str_productIds + ")";
    let productSKURes = ObjectStore.queryByYonQL(productSKUSql, "productcenter");
    let productSKUObj = {};
    if (productSKURes.length > 0) {
      for (let i = 0; i < productSKURes.length; i++) {
        productSKUObj[productSKURes[i].productId] = productSKURes[i];
      }
    }
    let str_warehouseIds = warehouseIds.join(",");
    //查询仓库
    let warehouseSql = "select * from aa.warehouse.Warehouse where id in (" + str_warehouseIds + ")";
    let warehouseRes = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
    let warehouseObj = {};
    if (warehouseRes.length > 0) {
      for (let i = 0; i < warehouseRes.length; i++) {
        warehouseObj[warehouseRes[i].id] = warehouseRes[i];
      }
    }
    let sccessInfo = {};
    let data = [];
    if (masRes.length > 0) {
      let SY01_pro_sreport_v3CardTableGroup = [];
      for (let i = 0; i < masRes.length; i++) {
        //子表信息
        let childList = {
          commodity_code: productObj[childObj[masRes[i].id].product_code].id, //物料ID
          commodity_code_code: productObj[childObj[masRes[i].id].product_code].code, //物料编码
          commodity_name: productObj[childObj[masRes[i].id].product_code].name, //物料名称
          manufacture_date: childObj[masRes[i].id].production_date, //生产日期
          validity_date: childObj[masRes[i].id].valid_until, //有效期至
          stripe_code: childObj[masRes[i].id].shengchanchangshang, //生产厂商
          applications_number: childObj[masRes[i].id].unqualified_num, //申请数量
          lot_no: childObj[masRes[i].id].gspshangpinfenlei, //GSP商品分类ID
          lot_no_catagoryname: childObj[masRes[i].id].gspshangpinfenlei_catagoryname, //GSP商品分类名称
          warehouse: childObj[masRes[i].id].warehouse, //仓库ID
          warehouse_name: warehouseObj[childObj[masRes[i].id].warehouse].name, //仓库名称
          pctext: childObj[masRes[i].id].batch_no, //批次号
          pcnum: childObj[masRes[i].id].item203lc, //批次号选择ID
          pcnum_batchno: childObj[masRes[i].id].item203lc_batchno, //批次号选择
          skuid: productSKUObj[productObj[childObj[masRes[i].id].product_code].id].id, //物料SKUID
          skuid_name: productSKUObj[productObj[childObj[masRes[i].id].product_code].id].name, //物料SKU名称
          skucode: productSKUObj[productObj[childObj[masRes[i].id].product_code].id].code, //物料SKU编码
          model: childObj[masRes[i].id].xinghao, //规格型号
          bc: childObj[masRes[i].id].packingMaterial, //包材ID
          bc_packing_name: childObj[masRes[i].id].packingMaterial_packing_name, //包材名称
          position: childObj[masRes[i].id].huowei, //货位ID
          position_name: childObj[masRes[i].id].huowei_name, //货位名称
          standard_code: childObj[masRes[i].id].standard_code, //本位码
          currency_name: childObj[masRes[i].id].tongyongming, //通用名
          dosage: childObj[masRes[i].id].jixing, //剂型ID
          dosage_dosagaFormName: childObj[masRes[i].id].jixing_dosagaFormName, //剂型名称
          origin: childObj[masRes[i].id].producing_area, //产地
          holder: childObj[masRes[i].id].shangshixukeren, //上市许可持有人ID
          holder_ip_name: childObj[masRes[i].id].shangshixukeren_ip_name, //上市许可持有人名称
          pzwh: childObj[masRes[i].id].approval_number, //批准文号
          main_unit: childObj[masRes[i].id].zhujiliang, //主计量ID
          main_unit_name: childObj[masRes[i].id].zhujiliang_name, //主计量名称
          remarks: childObj[masRes[i].id].deal_type, //行备注
          list_type: childObj[masRes[i].id].source_list_type, //源单类型
          list_code: childObj[masRes[i].id].source_list_code, //源单编号
          source_id: masRes[i].id, //不合格药品登记单主表ID
          sourcechild_id: childObj[masRes[i].id].id //不合格药品登记单子表ID
        };
        let features = {
          features: childObj[masRes[i].id].features //自由项特征组
        };
        let details = { childList: childList, features: features };
        SY01_pro_sreport_v3CardTableGroup.push(details);
      }
      //主表信息
      let mastObject = {
        org_id: request.orgIds[0],
        org_id_name: request.orgNames[0],
        verifystate: "0",
        bizFlowName: "商品报损单手动拉不合格登记单",
        SY01_pro_sreport_v3List: SY01_pro_sreport_v3CardTableGroup //子表信息
      };
      data.push(mastObject);
    }
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });