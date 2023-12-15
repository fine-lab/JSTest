let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //处理日期
    let dateFormat = function (value, format) {
      let date = new Date(value);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours() + 8, //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
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
    let udiConfigObj = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_configurev3", { id: configId });
    let materialObj = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_infov3", { id: udiConfigObj[0].sy01_udi_product_info_id });
    let material = materialObj[0].product;
    let materialName = materialObj[0].productName;
    let materialCode = materialObj[0].productCode;
    let spec = materialObj[0].productSpecifications;
    let productIdentification = "";
    let avgNum = 0;
    //查询最小包装标识
    if (udiConfigObj[0].bzcpbs == udiConfigObj[0].bznhxyjbzcpbs) {
      //判断是否为最小包装
      //最小包装直接获取包装标识
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
      //根据包含小一级产品包装标识查询
      let minUdiConfigObj = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_configurev3", { bzcpbs: udiConfigObj[0].bznhxyjbzcpbs });
      productIdentification = udiConfigObj[0].bznhxyjbzcpbs; //获取中包装包含小一级包装标识 不为外包装的情况下
      if (minUdiConfigObj[0].bzcpbs != minUdiConfigObj[0].bznhxyjbzcpbs) {
        //判断是否为最小包装
        //若包含小一级产品包装标识不为最小包装，则当前包装为外包装 获取查询出来的中包装所包含小一级包装标识为最小包装标识。
        productIdentification = minUdiConfigObj[0].bznhxyjbzcpbs;
      }
    }
    let packageIdentification = udiConfigObj[0].bzcpbs;
    let packagingPhase = udiConfigObj[0].cpbzjb;
    let identificationQty = udiConfigObj[0].bznhxyjbzcpbssl;
    let udiFileList = []; //udi主档列表
    let udiTrackList = []; //udi追溯列表
    let udiCodes = [];
    for (let i = 0; i < udiCodeList.length; i++) {
      if (udiCodeList[i].udiState == 2) {
        throw new Error("请选择未发布状态的UDI！");
      }
      (udiCodeList[i]._status = "Insert"), (udiCodeList[i].udiConfigId = configId);
      udiCodeList[i].sourceType = billType;
      udiCodeList[i].sourceCode = billCode;
      udiCodeList[i].udiState = 2;
      let udiFile = {};
      if (udiCodes.includes(udiCodeList[i].udiCode)) {
        throw new Error(udiCodeList[i].udiCode + " UDI与发布列表中存在其他相同的UDI，请删除后再发布！");
      }
      udiCodes.push(udiCodeList[i].udiCode);
      udiFile.UDI = udiCodeList[i].udiCode;
      let checkUdi = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.UDIFilev3", { UDI: udiFile.UDI });
      if (checkUdi != null && checkUdi.length > 0) {
        throw new Error(udiFile.UDI + " UDI已存在，无需重复发布！");
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
      } else if (billType == "/yonbip/scm/storeprorecord/list" || billType.indexOf("storeprorecord") > -1) {
        //产品入库单
        udiTrack.billName = "产品入库单";
      }
      udiTrack.createTime = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
      udiTrack.optDate = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
      udiTrackList.push(udiTrack);
    }
    if (udiCodeList.length == 1) {
      let udiFileInsert = ObjectStore.insert("I0P_UDI.I0P_UDI.UDIFilev3", udiFileList[0], "821f4590");
      if (udiFileInsert == null) {
        throw new Error("UDI数据中心插入失败，请重试！");
      }
      udiFileInsert.UDITrackv3List = udiTrackList;
      ObjectStore.updateById("I0P_UDI.I0P_UDI.UDIFilev3", udiFileInsert, "821f4590");
      if (sonUdiList != null && sonUdiList.length > 0) {
        for (let i = 0; i < sonUdiList.length; i++) {
          //查询子包装UDI主档 并修改父包装UDIid为新插入的id
          let sonUdiFile = ObjectStore.queryByYonQL("select * from I0P_UDI.I0P_UDI.UDIFilev3 where parentUdiId is null and UDI ='" + sonUdiList[i].udiCode + "'");
          if (sonUdiFile == null || sonUdiFile.length == 0) {
            throw new Error("子包装UDI已被选择，请刷新页面后重新勾选！");
          }
          let object = { id: sonUdiFile[0].id, parentUdiId: udiFileInsert.id };
          let res = ObjectStore.updateById("I0P_UDI.I0P_UDI.UDIFilev3", object, "821f4590");
        }
      }
    } else {
      let udiFileInsert = ObjectStore.insertBatch("I0P_UDI.I0P_UDI.UDIFilev3", udiFileList, "821f4590");
      if (udiFileInsert == null) {
        throw new Error("UDI数据中心插入失败，请重试！");
      }
      if (sonUdiList != null && sonUdiList.length > 0) {
        for (let i = 0, j = 0, k = 1; i < sonUdiList.length; i++, k++) {
          //查询子包装UDI主档 并修改父包装UDIid为新插入的id
          let sonUdiFile = ObjectStore.queryByYonQL("select * from I0P_UDI.I0P_UDI.UDIFilev3 where parentUdiId is null and UDI ='" + sonUdiList[i].udiCode + "'");
          if (sonUdiFile == null || sonUdiFile.length == 0) {
            throw new Error("子包装UDI已被选择，请刷新页面后重新勾选！");
          }
          let object = { id: sonUdiFile[0].id, parentUdiId: udiFileInsert[j].id };
          let res = ObjectStore.updateById("I0P_UDI.I0P_UDI.UDIFilev3", object, "821f4590");
          if (k % avgNum == 0 && j < udiFileInsert.length) {
            j++;
          }
        }
      }
      for (let i = 0; i < udiTrackList.length; i++) {
        let UDITrackv3List = [];
        UDITrackv3List.push(udiTrackList[i]);
        udiFileInsert[i].UDITrackv3List = UDITrackv3List;
        ObjectStore.updateById("I0P_UDI.I0P_UDI.UDIFilev3", udiFileInsert[i], "821f4590");
      }
    }
    let udi_create_platform = { test: "新增" };
    udi_create_platform.udi_release_data_infov3List = udiCodeList;
    ObjectStore.insert("I0P_UDI.I0P_UDI.udi_create_platformv3", udi_create_platform, "99f8f957");
    return { result: udiCodeList };
  }
}
exports({ entryPoint: MyAPIHandler });