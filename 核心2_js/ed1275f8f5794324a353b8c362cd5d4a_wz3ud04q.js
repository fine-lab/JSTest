let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let djId = request.djId;
    let resDataRs;
    if (djId === null || djId === "" || typeof djId == "undefined") {
      let resDataList = "select *,material.name materialName from ISVUDI.ISVUDI.UDITrackv2 GROUP BY billNo";
      resDataRs = ObjectStore.queryByYonQL(resDataList, "sy01");
      if (resDataRs.length === 0 || typeof resDataRs == "undefined") {
        resDataRs = [];
        return { resDataRs };
      }
      djId = resDataRs[0].UDIFile_id;
    }
    //查 数据中 di 这里是唯一一条,用于查出di 找到多条关联数据
    let resDataFileSql = "select * from ISVUDI.ISVUDI.UDIFilev2 where id = '" + djId + "'";
    let resDataFileRs = ObjectStore.queryByYonQL(resDataFileSql, "sy01");
    //找出全部di数据 如果是外 显示在外,中则显示在中 (这里查出的 不能明确是外或中或小)
    let resDataFileDiSql = "select * from ISVUDI.ISVUDI.UDIFilev2 where DI = '" + resDataFileRs[0].DI + "'";
    let resDataFileDIRs = ObjectStore.queryByYonQL(resDataFileDiSql, "sy01");
    if (resDataFileDIRs.length === 0 || typeof resDataFileDIRs == "undefined") {
      resDataFileDIRs = [];
      return { resDataRs };
    }
    let biaoshiTemp = resDataFileRs[0].DI.substring(4);
    let resUDIbiaoshiSql = "select * from ISVUDI.ISVUDI.sy01_udi_product_listv2 where zxxsdycpbs = '" + biaoshiTemp + "'";
    let resUDIbiaoshiRs = ObjectStore.queryByYonQL(resUDIbiaoshiSql, "sy01");
    let zxbzData; //最小包装list
    if (resUDIbiaoshiRs.length === 0 || typeof resUDIbiaoshiRs == "undefined") {
      resUDIbiaoshiRs = [];
      zxbzData = resDataFileDIRs;
      return { resDataRs, zxbzData };
    }
    let resUDIbiaoshibzbsxxSql = "select * from ISVUDI.ISVUDI.sy01_udi_product_list_bzbsxxv2 where sy01_udi_product_list_id = '" + resUDIbiaoshiRs[0].id + "'";
    let resUDIbiaoshibsxxRs = ObjectStore.queryByYonQL(resUDIbiaoshibzbsxxSql, "sy01");
    if (resUDIbiaoshibsxxRs.length === 1) {
      zxbzData = resDataFileDIRs;
      return { resDataRs, zxbzData, resUDIbiaoshibsxxRs };
    }
    let zbzData; //中包装
    let wbzData; //外包装list
    //处理多包装 包装产品标识 == 下一级标识 =最小 下一级标识==最小 = 中包 下一级标识==中 =外
    if (resUDIbiaoshibsxxRs.length === 2) {
      //包装产品标识 == 下一级标识 =最小
      for (let bzj = 0; bzj < resUDIbiaoshibsxxRs.length; bzj++) {
        if (resUDIbiaoshibsxxRs[bzj].bzcpbs === resUDIbiaoshibsxxRs[bzj].bznhxyjbzcpbs) {
          //判断是否已经查过
          if (biaoshiTemp === resUDIbiaoshibsxxRs[bzj].bzcpbs) {
            zxbzData = resDataFileDIRs;
          } else {
            let resDataFileDiSql3 = "select * from ISVUDI.ISVUDI.UDIFilev2 where DI = '" + "(01)" + resUDIbiaoshibsxxRs[bzj].bzcpbs + "'";
            zxbzData = ObjectStore.queryByYonQL(resDataFileDiSql3, "sy01");
          }
        } else if (resUDIbiaoshibsxxRs[bzj].bzcpbs !== resUDIbiaoshibsxxRs[bzj].bznhxyjbzcpbs) {
          //找出全部di数据 如果是外 显示在外,中则显示在中 (这里查出的 不能明确是外或中或小)
          if (biaoshiTemp === resUDIbiaoshibsxxRs[bzj].bzcpbs) {
            zbzData = resDataFileDIRs;
          } else {
            let resDataFileDiSql2 = "select * from ISVUDI.ISVUDI.UDIFilev2 where DI = '" + "(01)" + resUDIbiaoshibsxxRs[bzj].bzcpbs + "'";
            zbzData = ObjectStore.queryByYonQL(resDataFileDiSql2, "sy01");
          }
        }
      }
      return { resDataRs, zbzData, zxbzData, resUDIbiaoshibsxxRs };
    }
    //有三种包装情况
    if (resUDIbiaoshibsxxRs.length === 3) {
      //需要先找到最小标识
      let zxbsTempNum = "";
      for (let bsi = 0; bsi < resUDIbiaoshibsxxRs.length; bsi++) {
        if (resUDIbiaoshibsxxRs[bsi].bzcpbs === resUDIbiaoshibsxxRs[bsi].bznhxyjbzcpbs) {
          zxbsTempNum = resUDIbiaoshibsxxRs[bsi].bzcpbs;
        }
      }
      for (let bsj = 0; bsj < resUDIbiaoshibsxxRs.length; bsj++) {
        //如果下一级==最小=中 不等于=外
        if (resUDIbiaoshibsxxRs[bsj].bzcpbs === resUDIbiaoshibsxxRs[bsj].bznhxyjbzcpbs) {
          if (biaoshiTemp === resUDIbiaoshibsxxRs[bsj].bzcpbs) {
            zxbzData = resDataFileDIRs;
          } else {
            let resDataFileDiSql2 = "select * from ISVUDI.ISVUDI.UDIFilev2 where DI = '" + "(01)" + resUDIbiaoshibsxxRs[bsj].bzcpbs + "'";
            zxbzData = ObjectStore.queryByYonQL(resDataFileDiSql2, "sy01");
          }
        } else if (resUDIbiaoshibsxxRs[bsj].bznhxyjbzcpbs === zxbsTempNum) {
          //中包装
          if (biaoshiTemp === resUDIbiaoshibsxxRs[bsj].bzcpbs) {
            zbzData = resDataFileDIRs;
          } else {
            let resDataFileDiSql2 = "select * from ISVUDI.ISVUDI.UDIFilev2 where DI = '" + "(01)" + resUDIbiaoshibsxxRs[bsj].bzcpbs + "'";
            zbzData = ObjectStore.queryByYonQL(resDataFileDiSql2, "sy01");
          }
        } else if (resUDIbiaoshibsxxRs[bsj].bznhxyjbzcpbs !== zxbsTempNum) {
          //外包装
          if (biaoshiTemp === resUDIbiaoshibsxxRs[bsj].bzcpbs) {
            wbzData = resDataFileDIRs;
          } else {
            let resDataFileDiSql2 = "select * from ISVUDI.ISVUDI.UDIFilev2 where DI = '" + "(01)" + resUDIbiaoshibsxxRs[bsj].bzcpbs + "'";
            wbzData = ObjectStore.queryByYonQL(resDataFileDiSql2, "sy01");
          }
        }
      }
      return { resDataRs, zbzData, zxbzData, wbzData, resUDIbiaoshibsxxRs };
    }
  }
}
exports({ entryPoint: MyAPIHandler });