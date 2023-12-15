let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let configId = request.configId; //最小包装id
    let maxCreateUdiNum = request.maxCreateUdiNum; //最大发布数量
    let unitName = request.unitName; //主计量名称
    let billCode = request.billCode; //来源单号
    let billType = request.billType; //来源单类型
    let udiCodeList = request.udiCodeList; //udi列表
    let sonUdiList = request.sonUdiList; //子包装udi列表
    if (udiCodeList == null || udiCodeList.length == 0) {
      throw new Error("请选择要发布的UDI！");
    }
    //查询包装信息和对应商品信息
    let udiConfigObj = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_product_configurev2", { id: configId });
    let materialObj = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_product_infov2", { id: udiConfigObj[0].sy01_udi_product_info_id });
    let material = materialObj[0].product;
    let materialName = materialObj[0].productName;
    let materialCode = materialObj[0].productCode;
    let spec = materialObj[0].productSpecifications;
    let productIdentification = "";
    let avgNum = 0;
    if (udiConfigObj[0].bzcpbs == udiConfigObj[0].bznhxyjbzcpbs) {
      //判断是否为最小包装
      productIdentification = udiConfigObj[0].bzcpbs;
    } else {
      if (sonUdiList == null || sonUdiList.length == 0) {
        throw new Error("请选择包含的子包装UDI！");
      }
      if (udiCodeList.length > sonUdiList.length) {
        throw new Error("发布的UDI数量不能大于子包装UDI数量！");
      }
      let udiCodeNum = udiCodeList.length;
      let sonUdiCodeNum = sonUdiList.length;
      avgNum = (sonUdiCodeNum / udiCodeNum).toFixed(); //四舍五入取整计算每个UDI包含子包装UDI个数
      if (avgNum > udiConfigObj[0].bznhxyjbzcpbssl) {
        throw new Error("选择的子包装UDI数量不能超过包装内含小一级包装产品标识数量！");
      }
      if (udiConfigObj[0].cpbzjb.indexOf("中包装") > -1) {
        productIdentification = udiConfigObj[0].bznhxyjbzcpbs;
      } else {
        //外包装查询中包装获取产品标识
        let minUdiConfigObj = ObjectStore.selectByMap("ISVUDI.ISVUDI.sy01_udi_product_configurev2", { bzcpbs: udiConfigObj.bznhxyjbzcpbs });
        productIdentification = minUdiConfigObj[0].bznhxyjbzcpbs;
      }
    }
    let packageIdentification = udiConfigObj[0].bzcpbs;
    let packagingPhase = udiConfigObj[0].cpbzjb;
    let identificationQty = udiConfigObj[0].bznhxyjbzcpbssl;
    let udiFileList = []; //udi主档列表
    let udiTrackList = []; //udi追溯列表
    for (let i = 0; i < udiCodeList.length; i++) {
      if (udiCodeList[i].udiState == 2) {
        throw new Error("请选择未发布状态的UDI！");
      }
      (udiCodeList[i]._status = "Insert"), (udiCodeList[i].udiConfigId = configId);
      udiCodeList[i].sourceType = billType;
      udiCodeList[i].sourceCode = billCode;
      udiCodeList[i].udiState = 2;
      let udiFile = {};
      udiFile.UDI = udiCodeList[i].udiCode;
      let checkUdi = ObjectStore.selectByMap("ISVUDI.ISVUDI.UDIFilev2", { UDI: udiFile.UDI });
      if (checkUdi != null && checkUdi.length > 0) {
        throw new Error(udiFile.UDI + "UDI已存在，无需重复发布！");
      }
      udiFile.validateDate = udiCodeList[i].periodValidity;
      udiFile.produceDate = udiCodeList[i].dateManufacture;
      udiFile.batchNo = udiCodeList[i].batchNo;
      udiFile.serialNumber = udiCodeList[i].serialNo;
      udiFile.DI = "(01)" + udiCodeList[i].productUdi;
      udiFile.material = material;
      udiFile.materialName = materialName;
      udiFile.materialCode = materialCode;
      udiFile.spec = udiCodeList[i].spec;
      udiFile.productIdentification = productIdentification;
      udiFile.packageIdentification = packageIdentification;
      udiFile.packagingPhase = packagingPhase;
      udiFile.identificationQty = identificationQty;
      udiFile.code = "xxxxxxxxxxxxx4xy".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      udiFile.PI = udiCodeList[i].udiCode.replace(udiFile.DI, ""); //PI为udi截取掉01+产品标识
      udiFileList.push(udiFile);
      let udiTrack = { _status: "Insert", trackingDirection: "生成", billNo: billCode, material: material, unit: unitName, qty: maxCreateUdiNum };
      if (billType == "/yonbip/mfg/productionorder/list" || billType.indexOf("productionorder") > -1) {
        //生产订单
        udiTrack.billName = "生产订单";
      } else if (billType == "/yonbip/scm/purinrecord/list" || billType.indexOf("purinrecord") > -1) {
        //采购入库单
        udiTrack.billName = "采购入库单";
      }
      udiTrackList.push(udiTrack);
    }
    if (udiCodeList.length == 1) {
      let udiFileInsert = ObjectStore.insert("ISVUDI.ISVUDI.UDIFilev2", udiFileList[0], "ce60fff3");
      if (udiFileInsert == null) {
        throw new Error("UDI数据中心插入失败，请重试！");
      }
      udiFileInsert.UDITrackv2List = udiTrackList;
      ObjectStore.updateById("ISVUDI.ISVUDI.UDIFilev2", udiFileInsert, "ce60fff3");
      if (sonUdiList != null && sonUdiList.length > 0) {
        for (let i = 0; i < sonUdiList.length; i++) {
          //查询子包装UDI主档 并修改父包装UDIid为新插入的id
          let sonUdiFile = ObjectStore.queryByYonQL("select * from ISVUDI.ISVUDI.UDIFilev2 where parentUdiId is null and UDI ='" + sonUdiList[i].udiCode + "'");
          if (sonUdiFile == null || sonUdiFile.length == 0) {
            throw new Error("子包装UDI已被选择，请刷新页面后重新勾选！");
          }
          let object = { id: sonUdiFile[0].id, parentUdiId: udiFileInsert.id };
          let res = ObjectStore.updateById("ISVUDI.ISVUDI.UDIFilev2", object, "ce60fff3");
        }
      }
    } else {
      let udiFileInsert = ObjectStore.insertBatch("ISVUDI.ISVUDI.UDIFilev2", udiFileList, "ce60fff3");
      if (udiFileInsert == null) {
        throw new Error("UDI数据中心插入失败，请重试！");
      }
      if (sonUdiList != null && sonUdiList.length > 0) {
        for (let i = 0, j = 0, k = 1; i < sonUdiList.length; i++, k++) {
          //查询子包装UDI主档 并修改父包装UDIid为新插入的id
          let sonUdiFile = ObjectStore.queryByYonQL("select * from ISVUDI.ISVUDI.UDIFilev2 where parentUdiId is null and UDI ='" + sonUdiList[i].udiCode + "'");
          if (sonUdiFile == null || sonUdiFile.length == 0) {
            throw new Error("子包装UDI已被选择，请刷新页面后重新勾选！");
          }
          let object = { id: sonUdiFile[0].id, parentUdiId: udiFileInsert[j].id };
          let res = ObjectStore.updateById("ISVUDI.ISVUDI.UDIFilev2", object, "ce60fff3");
          if (k % avgNum == 0 && j < udiFileInsert.length) {
            j++;
          }
        }
      }
      for (let i = 0; i < udiTrackList.length; i++) {
        let UDITrackv2List = [];
        UDITrackv2List.push(udiTrackList[i]);
        udiFileInsert[i].UDITrackv2List = UDITrackv2List;
        ObjectStore.updateById("ISVUDI.ISVUDI.UDIFilev2", udiFileInsert[i], "ce60fff3");
      }
    }
    let udi_create_platform = { test: "新增" };
    udi_create_platform.udi_release_data_infoList = udiCodeList;
    ObjectStore.insert("ISVUDI.ISVUDI.udi_create_platform", udi_create_platform, "513229b9");
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });