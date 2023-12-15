let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 如果不传时间,则按index,size来 如果有时间,开始时间必须填
    //返回逻辑: 列表返回的是列表,详情是列表中的id查询出的 列表,包含多个相同主id,也就是多物料, 验收单一样
    let enddateInfo = "";
    if (request.endDate === null || request.endDate === "" || typeof request.endDate === "undefined") {
      enddateInfo = "";
    } else {
      enddateInfo = " and vouchdate <='" + request.endDate + "'";
    }
    let begindate = "";
    if (request.beginDate === null || request.beginDate === "" || typeof request.beginDate === "undefined") {
      begindate = "";
    } else {
      begindate = " where vouchdate>='" + request.beginDate + "'";
    }
    let resDataList = "select *, vendor.name from pu.arrivalorder.ArrivalOrder " + begindate + enddateInfo + "and status=1  limit " + request.pageIndex + ", " + request.pageSize;
    let resArrivalRs = ObjectStore.queryByYonQL(resDataList, "upu");
    if (resArrivalRs.length === 0 || typeof resArrivalRs == "undefined") {
      resArrivalRs = [];
    }
    let resRsIds = []; //获取到货列表 中的详情
    let resPurinstockys = []; //SY01_purinstockysv2 获取验收单 开启GSP的才能拿
    for (let i = 0; i < resArrivalRs.length; i++) {
      if (resArrivalRs[i].extend_is_gsp === "1" || resArrivalRs[i].extend_is_gsp) {
        resPurinstockys.push(resArrivalRs[i].id);
      }
      resRsIds.push(resArrivalRs[i].id);
    }
    //获取到货列表 中的详情
    let resDetailsList =
      "select *,product.cCode,product.cName,product.realProductAttribute,productsku.cCode,productsku.skuName,unit.name from pu.arrivalorder.ArrivalOrders st where mainid in (" + resRsIds + ")";
    let resDetailsRs = ObjectStore.queryByYonQL(resDetailsList, "upu");
    let resPurinstockysRs = [];
    let resPurinstockysDetailsRs = [];
    if (resPurinstockys.length !== 0) {
      //获取验收单 列表
      let resPurinstockysSql = "select * from GT22176AT10.GT22176AT10.SY01_purinstockysv2 where source_id in (" + resPurinstockys + ")";
      resPurinstockysRs = ObjectStore.queryByYonQL(resPurinstockysSql, "sy01");
      let purinstockysDetailsId = [];
      for (let puri = 0; puri < resPurinstockysRs.length; puri++) {
        purinstockysDetailsId.push(resPurinstockysRs[puri].id);
      }
      //获取验收单 详情 GT22176AT10.GT22176AT10.SY01_purinstockys_l	实体
      let resPurinstockysDetailsSql = "select * from GT22176AT10.GT22176AT10.SY01_purinstockys_l where SY01_purinstockysv2_id in (" + purinstockysDetailsId + ")";
      resPurinstockysDetailsRs = ObjectStore.queryByYonQL(resPurinstockysDetailsSql, "sy01");
    }
    //返回列表总数
    let rsCount = resArrivalRs.length;
    //需要先将验收单 详情放入列表,在放入到货到列表中
    for (let ysdlisti = 0; ysdlisti < resPurinstockysRs.length; ysdlisti++) {
      let ysdRsDetails = [];
      for (let ysdDetailsi = 0; ysdDetailsi < resPurinstockysDetailsRs.length; ysdDetailsi++) {
        if (resPurinstockysRs[ysdlisti].id === resPurinstockysDetailsRs[ysdDetailsi].SY01_purinstockysv2_id) {
          ysdRsDetails.push(resPurinstockysDetailsRs[ysdDetailsi]);
        }
      }
      resPurinstockysRs[ysdlisti].resPurinstockysDetailsRs = ysdRsDetails;
    }
    //将详情放入 列表中 最外层为列表
    for (let listi = 0; listi < resArrivalRs.length; listi++) {
      //详情list
      let rsDetails = [];
      for (let detailsi = 0; detailsi < resDetailsRs.length; detailsi++) {
        //如果详情mainid==列表id 则加入 可能会有多个,加完不能结束
        if (resArrivalRs[listi].id === resDetailsRs[detailsi].mainid && resDetailsRs[detailsi].totalInQuantity < resDetailsRs[detailsi].qty) {
          rsDetails.push(resDetailsRs[detailsi]);
        }
      }
      resArrivalRs[listi].resDetailsRs = rsDetails;
      //验收单 列表
      let ysdList = [];
      for (let ysdi = 0; ysdi < resPurinstockysRs.length; ysdi++) {
        if (resArrivalRs[listi].id === resPurinstockysRs[ysdi].source_id) {
          ysdList.push(resPurinstockysRs[ysdi]);
        }
      }
      resArrivalRs[listi].resPurinstockysRs = ysdList;
    }
    return { resArrivalRs, rsCount };
  }
}
exports({ entryPoint: MyAPIHandler });