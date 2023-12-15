let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billCode = request.billCode; //来源单据号
    let billId = request.billId; //来源单据id
    let billType = request.billType; //来源单据类型
    let apiPreAndAppCode = extrequire("I0P_UDI.publicFunction.getApiPreAndApp").execute();
    let url = "";
    //获取不同来源单详情中物料子表信息
    let orderDetailSonKey = ""; //物料子表key
    let materialIdKey = ""; //物料idkey
    let udiNumKey = ""; //物料数量key
    let producedateKey = ""; //生产日期key
    let invaliddateKey = ""; //有效期至key
    let batchnoKey = ""; //表批号key
    let unitNameKey = ""; //主计量名称key
    if (billType == "/yonbip/mfg/productionorder/list" || billType.indexOf("productionorder") > -1) {
      //生产订单
      url = apiPreAndAppCode.apiPrefix + "/yonbip/mfg/productionorder/detail?id=" + billId;
      orderDetailSonKey = "yourKeyHere";
      udiNumKey = "yourKeyHere";
      unitNameKey = "yourKeyHere";
      producedateKey = "yourKeyHere";
      invaliddateKey = "yourKeyHere";
      batchnoKey = "yourKeyHere";
      materialIdKey = "yourKeyHere";
    } else if (billType == "/yonbip/scm/purinrecord/list" || billType.indexOf("purinrecord") > -1) {
      //采购入库
      url = apiPreAndAppCode.apiPrefix + "/yonbip/scm/purinrecord/detail?id=" + billId;
      orderDetailSonKey = "yourKeyHere";
      udiNumKey = "yourKeyHere";
      yourKeyHereKey = "yourKeyHere";
      yourKeyHereKey = "yourKeyHere";
      yourKeyHereKey = "yourKeyHere";
      unitNameKey = "yourKeyHere";
      materialIdKey = "yourKeyHere";
    } else if (billType == "/yonbip/scm/storeprorecord/list" || billType.indexOf("storeprorecord") > -1) {
      //产品入库
      url = apiPreAndAppCode.apiPrefix + "/yonbip/scm/storeprorecord/detail?id=" + billId;
      orderDetailSonKey = "yourKeyHere";
      udiNumKey = "yourKeyHere";
      yourKeyHereKey = "yourKeyHere";
      yourKeyHereKey = "yourKeyHere";
      yourKeyHereKey = "yourKeyHere";
      unitNameKey = "yourKeyHere";
      materialIdKey = "yourKeyHere";
    }
    let apiResponse = openLinker("GET", url, apiPreAndAppCode.appCode, null);
    let orderDetail = JSON.parse(apiResponse);
    if (orderDetail.data != null && orderDetail.data[orderDetailSonKey] != null && orderDetail.data[orderDetailSonKey].length > 0) {
      let materialList = orderDetail.data[orderDetailSonKey];
      let udiMaterials = [];
      for (let i = 0; i < materialList.length; i++) {
        let material = materialList[i];
        let udiMaterial = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_infov3", { product: material[materialIdKey] });
        if (udiMaterial != null && udiMaterial.length > 0) {
          udiMaterial[0].maxUdiNum = material[udiNumKey]; //获取物料的数量为本次UDI生成最大数量
          udiMaterial[0].batchno = material[batchnoKey]; //获取物料的批号
          udiMaterial[0].invaliddate = material[invaliddateKey]; //获取物料的有效期至
          udiMaterial[0].producedate = material[producedateKey]; //获取物料的生产日期
          udiMaterial[0].unitName = material[unitNameKey]; //获取物料的主计量名称
          //查询序列号
          if (orderDetailSonKey == "purInRecords") {
            let serialList = ObjectStore.queryByYonQL("select sn from st.purinrecord.PurInRecordsSN where detailid.id = '" + material.id + "'", "ustock");
            udiMaterial[0].serialList = serialList;
          } else if (orderDetailSonKey == "storeProRecords") {
            let serialList = ObjectStore.queryByYonQL("select sn from st.storeprorecord.StoreProRecordsSN where detailid.id = '" + material.id + "'", "ustock");
            udiMaterial[0].serialList = serialList;
          }
          udiMaterials.push(udiMaterial[0]);
        }
      }
      return { result: udiMaterials };
    }
    return { result: null };
  }
}
exports({ entryPoint: MyAPIHandler });