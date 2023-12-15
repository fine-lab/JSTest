let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询单据
    let djId = request.djId;
    let resDataRs;
    if (djId === null || djId === "" || typeof djId == "undefined") {
      let resDataList = "select *,material.name materialName from I0P_UDI.I0P_UDI.UDITrackv3 where trackingDirection = '生成'  GROUP BY billNo order by pubts desc";
      resDataRs = ObjectStore.queryByYonQL(resDataList, "isv-ud1");
      if (resDataRs.length === 0 || typeof resDataRs == "undefined") {
        resDataRs = [];
      }
      return { resDataRs };
    }
    //查询某单据 关联全部udi
    let ckNoSql = "select UDIFile_id from I0P_UDI.I0P_UDI.UDITrackv3 where billNo = '" + djId + "' and trackingDirection = '生成'";
    let ckNoRs = ObjectStore.queryByYonQL(ckNoSql, "isv-ud1");
    let fileId = [];
    for (let i = 0; i < ckNoRs.length; i++) {
      fileId.push(ckNoRs[i].UDIFile_id);
    }
    let checkBillByNoSql = "select * from I0P_UDI.I0P_UDI.UDIFilev3 where id in (" + fileId + ")";
    let checkBillByNoRs = ObjectStore.queryByYonQL(checkBillByNoSql, "isv-ud1");
    let bsTemp = checkBillByNoRs[0].UDI;
    let aRs = bsTemp.split("(");
    let udi_di = "";
    if (aRs.length === 1) {
      udi_di = bsTemp.substr(2, 14);
    } else {
      for (let i = 0; i < aRs.length; i++) {
        let rssub = aRs[i].substring(3);
        if (aRs[i].indexOf("01)") !== -1) {
          udi_di = "" + rssub;
        }
      }
    }
    //通过产品标识获取包装关系
    let bzgxSql = "select sy01_udi_product_list_id from   I0P_UDI.I0P_UDI.sy01_udi_product_list_bzbsxxv3 where bzcpbs = '" + udi_di + "'";
    let bzgxRs = ObjectStore.queryByYonQL(bzgxSql, "isv-ud1");
    if (bzgxRs.length === 0 || typeof bzgxRs == "undefined") {
      throw new Error("产品标识缺失！请检查产品标识是否删除， 产品标识：" + udi_di);
    }
    //获取全部包装结果 对比获取 包装关系
    let bzjgSql = "select * from I0P_UDI.I0P_UDI.sy01_udi_product_list_bzbsxxv3 where sy01_udi_product_list_id = " + bzgxRs[0].sy01_udi_product_list_id;
    let bzjgRs = ObjectStore.queryByYonQL(bzjgSql, "isv-ud1");
    //处理多包装 包装产品标识 == 下一级标识 =最小 下一级标识==最小 = 中包 下一级标识==中 =外
    //先找出最小 在找出中，外
    let zxbzBs = "";
    let zbzBs = "";
    let wbzBs = "";
    for (let i = 0; i < bzjgRs.length; i++) {
      if (bzjgRs[i].bzcpbs === bzjgRs[i].bznhxyjbzcpbs) {
        zxbzBs = bzjgRs[i].bzcpbs;
      }
    }
    if (bzjgRs.length > 1) {
      for (let i = 0; i < bzjgRs.length; i++) {
        if (zxbzBs === bzjgRs[i].bznhxyjbzcpbs && bzjgRs[i].bznhxyjbzcpbs != bzjgRs[i].bzcpbs) {
          zbzBs = bzjgRs[i].bzcpbs;
        }
      }
    }
    if (bzjgRs.length > 2) {
      for (let i = 0; i < bzjgRs.length; i++) {
        if (zbzBs === bzjgRs[i].bznhxyjbzcpbs && bzjgRs[i].bznhxyjbzcpbs != bzjgRs[i].bzcpbs) {
          wbzBs = bzjgRs[i].bzcpbs;
        }
      }
    }
    let zxbzData = []; //最小包装list
    let zbzData = []; //中包装
    let wbzData = []; //外包装list
    //循环全部udi 放入对应包装数据中
    for (let i = 0; i < checkBillByNoRs.length; i++) {
      if (checkBillByNoRs[i].UDI.indexOf(zxbzBs) !== -1 && zxbzBs !== "") {
        zxbzData.push(checkBillByNoRs[i]);
      }
      if (checkBillByNoRs[i].UDI.indexOf(zbzBs) !== -1 && zbzBs !== "") {
        zbzData.push(checkBillByNoRs[i]);
      }
      if (checkBillByNoRs[i].UDI.indexOf(wbzBs) !== -1 && wbzBs !== "") {
        wbzData.push(checkBillByNoRs[i]);
      }
    }
    return { zbzData, zxbzData, wbzData };
  }
}
exports({ entryPoint: MyAPIHandler });