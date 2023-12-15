let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billData = request.billData; //来源单据
    //来源单据号 let billCode = request.billCode;
    //来源单据id let billId = request.billId;
    let billType = request.billType; //来源单据类型
    //获取不同来源单详情中物料子表信息
    let orderDetailSonKey = ""; //物料子表key
    let serialSql = "";
    let detailIdKey = "yourKeyHere";
    let domain = "ustock";
    if (billType == "yonbip_scm_storeprorecord_list" || billType.indexOf("storeprorecord") > -1) {
      //产品入库单
      serialSql = "st.storeprorecord.StoreProRecordsSN";
    } else if (billType == "yonbip_scm_purinrecord_list" || billType.indexOf("purinrecord") > -1) {
      //采购入库
      serialSql = "st.purinrecord.PurInRecordsSN";
    } else if (billType == "yonbip_scm_salesout_list" || billType.indexOf("salesout") > -1) {
      //销售出库单
      serialSql = "st.salesout.SalesOutsSN";
    } else if (billType == "finishedReport" || billType.indexOf("finishedReport") > -1) {
      //完工报告
      serialSql = "po.finishedreport.FinishedReportSn";
      yourKeyHereKey = "yourKeyHere";
      domain = "productionorder";
    }
    if (billData != null && billData != undefined) {
      let udiMaterial = ObjectStore.queryByYonQL(
        "select product.code productCode ,  product.name productName,productSpecifications,id,productSku.code productSkuCode,productSku.skuFreeCharacter skuFreeCharacter from I0P_UDI.I0P_UDI.sy01_udi_product_infov3 where product = '" +
          billData.materialId +
          "'",
        "isv-ud1"
      );
      if (udiMaterial != null && udiMaterial.length > 0) {
        udiMaterial[0].maxUdiNum = billData.materialNum; //获取物料的数量为本次UDI生成最大数量
        udiMaterial[0].batchno = billData.batchno; //获取物料的批号
        udiMaterial[0].invaliddate = billData.invaliddate; //获取物料的有效期至
        udiMaterial[0].producedate = billData.producedate; //获取物料的生产日期
        udiMaterial[0].unitName = billData.unitName; //获取物料的主计量名称
        let productSku = udiMaterial[0].productSku;
        if (typeof productSku != "undefined") {
          //完工报告匹配特征 其他单据匹配sku
          if (billType == "finishedReport" || billType.indexOf("finishedReport") > -1) {
            //查询物料模板
            let queryTemplateInfo = "select productTemplate.id id,productTemplate.name name from pc.product.Product where id = '" + billData.materialId + "'";
            let templates = ObjectStore.queryByYonQL(queryTemplateInfo, "productcenter");
            //查询特征编码
            let yonql = "select characterCode from pc.tpl.ProductTplCharacter where template = '" + templates[0].id + "'";
            let controlRes = ObjectStore.queryByYonQL(yonql, "productcenter");
            for (let i = 0; i < controlRes.length; i++) {
              let characterCode = controlRes[i].characterCode;
              //如果完工报告和配置方案的sku都有特征则匹配两个特征的编码值是否相等
              if (udiMaterial[0].skuFreeCharacter != undefined && billData.features != undefined && udiMaterial[0].skuFreeCharacter[characterCode] != billData.features[characterCode]) {
                return { result: null };
              }
              // 如果完工报告有特征 选择的sku没有特征则不匹配 或者 如果完工报告没有特征 选择的sku有特征则还是不匹配
              else if ((billData.features != undefined && udiMaterial[0].skuFreeCharacter == undefined) || billData.features == undefined) {
                return { result: null };
              }
            }
          } else {
            if (productSku != billData.materialSku) {
              return { result: null };
            }
          }
        }
        //查询序列号
        if (serialSql != "") {
          let serialList = ObjectStore.queryByYonQL("select * from " + serialSql + " where " + detailIdKey + " = '" + billData.id + "'", domain);
          udiMaterial[0].serialList = serialList;
        }
      }
      return { result: udiMaterial };
    }
    return { result: null };
  }
}
exports({ entryPoint: MyAPIHandler });