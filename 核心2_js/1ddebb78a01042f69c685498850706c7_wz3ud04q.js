let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 如果不传时间,则按index,size来 如果有时间,开始时间必须填
    //返回逻辑: 列表返回的是列表,详情是列表中的id查询出的 列表,包含多个相同主id,也就是多物料
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
    //采购订单单据状态
    let statusCodeInfo = " ";
    let resDataList =
      "select *, vendor.name from pu.purchaseorder.PurchaseOrder " +
      begindate +
      enddateInfo +
      statusCodeInfo +
      " and status=1 and bustype.name = '普通采购'   limit " +
      request.pageIndex +
      ", " +
      request.pageSize;
    let resArrivalRs = ObjectStore.queryByYonQL(resDataList, "upu");
    if (resArrivalRs.length === 0 || typeof resArrivalRs == "undefined") {
      resArrivalRs = [];
      return { resArrivalRs };
    }
    let resRsIds = []; //获取发货列表 中的详情
    for (let i = 0; i < resArrivalRs.length; i++) {
      resRsIds.push(resArrivalRs[i].id);
    }
    //获取采购订单列表 中的详情
    let resDetailsList =
      "select *,product.cCode,product.cName,product.realProductAttribute,productsku.cCode,productsku.skuName,unit.name from pu.purchaseorder.PurchaseOrders where mainid in (" + resRsIds + ")";
    let resDetailsRs = ObjectStore.queryByYonQL(resDetailsList, "upu");
    //返回列表总数
    let rsCount = resArrivalRs.length;
    //将详情放入 列表中 最外层为列表
    for (let listi = 0; listi < resArrivalRs.length; listi++) {
      //详情list
      let rsDetails = [];
      for (let detailsi = 0; detailsi < resDetailsRs.length; detailsi++) {
        //如果详情mainid==列表id 则加入 可能会有多个,加完不能结束
        if (resArrivalRs[listi].id === resDetailsRs[detailsi].mainid && resDetailsRs[detailsi].totalInQty < resDetailsRs[detailsi].qty && resDetailsRs[detailsi].qty > 0) {
          rsDetails.push(resDetailsRs[detailsi]);
        }
      }
      resArrivalRs[listi].resDetailsRs = rsDetails;
    }
    return { resArrivalRs, rsCount };
  }
}
exports({ entryPoint: MyAPIHandler });