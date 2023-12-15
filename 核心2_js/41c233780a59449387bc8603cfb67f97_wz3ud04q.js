let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billData = request.billData; //来源单据
    //来源单据号 let billCode = request.billCode;
    //来源单据id let billId = request.billId;
    let billType = request.billType; //来源单据类型
    //获取不同来源单详情中物料子表信息
    let orderDetailSonKey = ""; //物料子表key
    if (billType == "/yonbip/mfg/productionorder/list" || billType.indexOf("productionorder") > -1) {
      //生产订单
      orderDetailSonKey = "yourKeyHere";
    } else if (billType == "/yonbip/scm/purinrecord/list" || billType.indexOf("purinrecord") > -1) {
      //采购入库
      orderDetailSonKey = "yourKeyHere";
    } else if (billType == "/yonbip/scm/storeprorecord/list" || billType.indexOf("storeprorecord") > -1) {
      //产品入库
      orderDetailSonKey = "yourKeyHere";
    }
    if (billData != null && billData != undefined) {
      let udiMaterial = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_infov3", { product: billData.materialId });
      if (udiMaterial != null && udiMaterial.length > 0) {
        udiMaterial[0].maxUdiNum = billData.subQty; //获取物料的数量为本次UDI生成最大数量
        udiMaterial[0].batchno == billData.batchNo; //获取物料的批号
        udiMaterial[0].invaliddate == billData.invaliddate; //获取物料的有效期至
        udiMaterial[0].producedate == billData.producedate; //获取物料的生产日期
        udiMaterial[0].unitName == billData.unitName; //获取物料的主计量名称
        //查询序列号
        if (orderDetailSonKey == "purInRecords") {
          let serialList = ObjectStore.queryByYonQL("select sn from st.purinrecord.PurInRecordsSN where detailid.id = '" + billData.id + "'", "ustock");
          udiMaterial[0].serialList = serialList;
        } else if (orderDetailSonKey == "storeProRecords") {
          let serialList = ObjectStore.queryByYonQL("select sn from st.storeprorecord.StoreProRecordsSN where detailid.id = '" + billData.id + "'", "ustock");
          udiMaterial[0].serialList = serialList;
        }
      }
      return { result: udiMaterial };
    }
    return { result: null };
  }
}
exports({ entryPoint: MyAPIHandler });