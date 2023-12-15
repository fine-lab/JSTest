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
      let udiTrack = [{ _status: "Insert", trackingDirection: trackingDirection, billName: billName, billNo: billCode }];
      for (let i = 0; i < udiList.length; i++) {
        //查询UDI数据中心是否有数据
        let UDIFileInfo = ObjectStore.selectByMap("ISVUDI.ISVUDI.UDIFilev2", { UDI: udiList[i].UDI });
        if (UDIFileInfo == null || UDIFileInfo.length == 0) {
          throw new Error(udiList[i].UDI + "在UDI数据中心不存在,无法绑定！");
        }
        udiTrack[0].material = udiList[i].material;
        udiTrack[0].unit = udiList[i].unit;
        udiTrack[0].qty = udiList[i].qty;
        UDIFileInfo[0].UDITrackv2List = udiTrack;
        ObjectStore.updateById("ISVUDI.ISVUDI.UDIFilev2", UDIFileInfo[0], "ce60fff3");
      }
    } else {
      //无源单
      trackingDirection = "生成";
      billName = "外部来源";
      let udiTrack = [{ _status: "Insert", trackingDirection: trackingDirection, billName: billName }];
      for (let i = 0; i < udiList.length; i++) {
        //查询UDI数据中心是否有数据
        let UDIFileInfo = ObjectStore.selectByMap("ISVUDI.ISVUDI.UDIFilev2", { UDI: udiList[i].UDI });
        if (UDIFileInfo == null || UDIFileInfo.length == 0) {
          udiList[i].code = "xxxxxxxxxxxxx4xy".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
          let UDIFile = ObjectStore.insert("ISVUDI.ISVUDI.UDIFilev2", udiList[i], "ce60fff3");
          if (UDIFile == null) {
            throw new Error("绑定UDI失败");
          }
          udiTrack[0].material = udiList[i].material;
          UDIFile.UDITrackv2List = udiTrack;
          ObjectStore.updateById("ISVUDI.ISVUDI.UDIFilev2", UDIFile, "ce60fff3");
        } else {
          udiTrack[0].material = udiList[i].material;
          UDIFileInfo[0].UDITrackv2List = udiTrack;
          ObjectStore.updateById("ISVUDI.ISVUDI.UDIFilev2", UDIFileInfo[0], "ce60fff3");
        }
      }
    }
    return { result: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });