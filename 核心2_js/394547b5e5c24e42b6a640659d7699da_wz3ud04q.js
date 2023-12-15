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
    //销售订单单据状态
    let statusCodeInfo = " ";
    let resDataList =
      "select *, agentId.name from voucher.order.Order " +
      begindate +
      enddateInfo +
      statusCodeInfo +
      " and status=1 and transactionTypeId.name = '普通销售（无发货）'  limit " +
      request.pageIndex +
      ", " +
      request.pageSize;
    let resArrivalRs = ObjectStore.queryByYonQL(resDataList, "udinghuo");
    if (resArrivalRs.length === 0 || typeof resArrivalRs == "undefined") {
      resArrivalRs = [];
      return { resArrivalRs };
    }
    let resRsIds = []; //获取发货列表 中的详情
    for (let i = 0; i < resArrivalRs.length; i++) {
      resRsIds.push(resArrivalRs[i].id);
    }
    //获取采购订单列表 中的详情
    let resDetailsList = "select * from voucher.order.OrderDetail where orderId in (" + resRsIds + ")";
    let resDetailsRs = ObjectStore.queryByYonQL(resDetailsList, "udinghuo");
    //返回列表总数
    let rsCount = resArrivalRs.length;
    //将详情放入 列表中 最外层为列表
    for (let listi = 0; listi < resArrivalRs.length; listi++) {
      //详情list
      let rsDetails = [];
      for (let detailsi = 0; detailsi < resDetailsRs.length; detailsi++) {
        //如果详情mainid==列表id 则加入 可能会有多个,加完不能结束
        if (resArrivalRs[listi].id === resDetailsRs[detailsi].orderId && resDetailsRs[detailsi].totalOutStockQuantity < resDetailsRs[detailsi].subQty) {
          rsDetails.push(resDetailsRs[detailsi]);
        }
      }
      resArrivalRs[listi].resDetailsRs = rsDetails;
    }
    return { resArrivalRs, rsCount };
  }
}
exports({ entryPoint: MyAPIHandler });