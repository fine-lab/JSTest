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
    if (childRes.length > 0) {
      for (let i = 0; i < childRes.length; i++) {
        productIds.push(childRes[i].product_code);
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
    let sccessInfo = {};
    if (masRes.length > 0) {
      let data = [];
      for (let i = 0; i < masRes.length; i++) {
        let bustypeCode;
        let bustypeName;
        if (masRes[i].bustype == "2738839742042368") {
          bustypeCode = "2742542603309312";
          bustypeName = "在库养护不合格报损";
        }
        if (masRes[i].bustype == "2660682284421376") {
          bustypeCode = "2727001546707200";
          bustypeName = "销售退回验收不合格报损";
        }
        if (masRes[i].bustype == "2738834659676416") {
          bustypeCode = "2742545058124032";
          bustypeName = "无来源不合格报损";
        }
        if (masRes[i].bustype == "2738871607808256") {
          bustypeCode = "2742543403700480";
          bustypeName = "购进退出复核不合格报损";
        }
        if (masRes[i].bustype == "2738872433365248") {
          bustypeCode = "2742544648491264";
          bustypeName = "销售出库复核不合格报损";
        }
        //子表信息
        let SY01_pro_sreport_v3CardTableGroup = [];
        if (childArr.length > 0) {
          for (let j = 0; j < childArr.length; j++) {
            let childList = {
              commodity_code: productObj[childArr[j][masRes[i].id].product_code].id, //物料ID
              commodity_code_code: productObj[childArr[j][masRes[i].id].product_code].code, //物料编码
              commodity_name: productObj[childArr[j][masRes[i].id].product_code].name, //物料名称
              features: childArr[j][masRes[i].id].features, //自由项特征组
              manufacture_date: childArr[j][masRes[i].id].production_date, //生产日期
              validity_date: childArr[j][masRes[i].id].valid_until, //有效期至
              stripe_code: childArr[j][masRes[i].id].shengchanchangshang, //生产厂商
              applications_number: childArr[j][masRes[i].id].unqualified_num, //申请数量
              lot_no: childArr[j][masRes[i].id].gspshangpinfenlei, //GSP商品分类ID
              lot_no_catagoryname: childArr[j][masRes[i].id].gspshangpinfenlei_catagoryname, //GSP商品分类名称
              warehouse: childArr[j][masRes[i].id].warehouse, //仓库ID
              warehouse_name: childArr[j][masRes[i].id].warehouse_name, //仓库名称
              pctext: childArr[j][masRes[i].id].batch_no, //批次号
              pcnum: childArr[j][masRes[i].id].item203lc, //批次号选择ID
              pcnum_batchno: childArr[j][masRes[i].id].item203lc_batchno, //批次号选择
              skuid: productSKUObj[productObj[childArr[j][masRes[i].id].product_code].id].id, //物料SKUID
              skuid_name: productSKUObj[productObj[childArr[j][masRes[i].id].product_code].id].name, //物料SKU名称
              skucode: productSKUObj[productObj[childArr[j][masRes[i].id].product_code].id].code, //物料SKU编码
              model: childArr[j][masRes[i].id].xinghao, //规格型号
              bc: childArr[j][masRes[i].id].packingMaterial, //包材ID
              bc_packing_name: childArr[j][masRes[i].id].packingMaterial_packing_name, //包材名称
              position: childArr[j][masRes[i].id].huowei, //货位ID
              position_name: childArr[j][masRes[i].id].huowei_name, //货位名称
              standard_code: childArr[j][masRes[i].id].standard_code, //本位码
              currency_name: childArr[j][masRes[i].id].tongyongming, //通用名
              dosage: childArr[j][masRes[i].id].jixing, //剂型ID
              dosage_dosagaFormName: childArr[j][masRes[i].id].jixing_dosagaFormName, //剂型名称
              origin: childArr[j][masRes[i].id].producing_area, //产地
              holder: childArr[j][masRes[i].id].shangshixukeren, //上市许可持有人ID
              holder_ip_name: childArr[j][masRes[i].id].shangshixukeren_ip_name, //上市许可持有人名称
              pzwh: childArr[j][masRes[i].id].approval_number, //批准文号
              main_unit: childArr[j][masRes[i].id].zhujiliang, //主计量ID
              main_unit_name: childArr[j][masRes[i].id].zhujiliang_name, //主计量名称
              remarks: childArr[j][masRes[i].id].deal_type, //行备注
              list_type: childArr[j][masRes[i].id].source_list_type, //源单类型
              list_code: childArr[j][masRes[i].id].source_list_code //源单编号
            };
            SY01_pro_sreport_v3CardTableGroup.push(childList);
          }
        }
        //主表信息
        let mastObject = {
          org_id: masRes[i].org_id,
          org_id_name: masRes[i].org_id_name,
          verifystate: "0",
          date: masRes[i].date,
          staff: masRes[i].staff,
          staff_name: masRes[i].staff_name,
          remark: masRes[i].remark,
          stock: masRes[i].stock,
          stock_name: masRes[i].stock_name,
          bIsStockState: "0",
          bustype: bustypeCode,
          bustype_name: bustypeName,
          bizFlowName: "商品报损单手动拉不合格登记单",
          SY01_pro_sreport_v3List: SY01_pro_sreport_v3CardTableGroup //子表信息
        };
        data.push(mastObject);
      }
      let mastRes = ObjectStore.insertBatch("GT22176AT10.GT22176AT10.SY01_pro_uselessv3", data, "c2d5f5eaList");
      sccessInfo = { sccess: 200 };
    }
    return { sccessInfo };
  }
}
exports({ entryPoint: MyAPIHandler });