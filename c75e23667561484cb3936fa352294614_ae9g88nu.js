let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let udiList = request.udiList; //udi码
    let isSourceOrder = request.isSourceOrder; //是否有源单
    let trackingDirection = "来源";
    let billName = "";
    if (udiList == null || udiList.length == 0) {
      throw new Error("没有可绑定的UDI");
    }
    if (isSourceOrder == 1) {
      //有源单
      let orderInfo = request.orderInfo; //订单信息
      let billId = orderInfo.id; //来源单据id
      let billCode = orderInfo.billCode; //来源单据号
      let billType = request.billType; //来源单据类型
      if (billType == "/yonbip/scm/storeprorecord/list" || billType.indexOf("storeprorecord") > -1) {
        //产品入库单
        billName = "产品入库单";
      } else if (billType == "/yonbip/scm/purinrecord/list" || billType.indexOf("purinrecord") > -1) {
        //采购入库
        billName = "采购入库单";
      } else if (billType == "/yonbip/scm/salesout/list" || billType.indexOf("salesout") > -1) {
        //销售出库单
        billName = "销售出库单";
        trackingDirection = "去向";
      }
      let udiTrack = { trackingDirection: trackingDirection, billName: billName, billNo: billCode };
      for (let i = 0; i < udiList.length; i++) {
        //查询UDI数据中心是否有数据
        let UDIFileInfo = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.UDIFile", { UDI: udiList[i].UDI });
        if (UDIFileInfo == null || UDIFileInfo.length == 0) {
          throw new Error(udiList[i].UDI + "在UDI数据中心不存在,无法绑定！");
        }
        udiTrack.material = udiList[i].material;
        udiTrack.unit = udiList[i].unit;
        udiTrack.qty = udiList[i].qty;
        udiTrack.UDIFile_id = udiList[i].id;
        let res = ObjectStore.insert("GT22176AT10.GT22176AT10.UDITrack", udiTrack, "UDITrack");
      }
    } else {
      //无源单
      trackingDirection = "生成";
      billName = "外部来源";
      let udiTrack = { trackingDirection: trackingDirection, billName: billName };
      for (let i = 0; i < udiList.length; i++) {
        //查询UDI数据中心是否有数据
        let UDIFileInfo = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.UDIFile", { UDI: udiList[i].UDI });
        if (UDIFileInfo == null || UDIFileInfo.length == 0) {
          udiList[i].code = "xxxxxxxxxxxxx4xy".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
          let UDIFile = ObjectStore.insert("GT22176AT10.GT22176AT10.UDIFile", udiList[i], "UDIFile");
          udiTrack.material = udiList[i].material;
          udiTrack.UDIFile_id = UDIFile.id;
          ObjectStore.insert("GT22176AT10.GT22176AT10.UDITrack", udiTrack, "UDITrack");
        }
      }
    }
    return { result: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });