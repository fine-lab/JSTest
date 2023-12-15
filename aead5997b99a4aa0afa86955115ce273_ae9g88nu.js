let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let code = request.code;
    let type = request.type;
    let error_info = [];
    let errInfo = [];
    //下推退货检验单
    if (type == 1) {
      let headersql = "select extend_gsptype,saleReturnStatus from voucher.salereturn.SaleReturn where id =" + id;
      var headerList = ObjectStore.queryByYonQL(headersql, "udinghuo");
      for (let i = 0; i < headerList.length; i++) {
        var extend_gsptype = headerList[i].extend_gsptype;
        if (extend_gsptype == 0) {
          error_info.push("退货单:" + code + ",是非gsp类型,不需要验收!");
          break;
        }
        var saleReturnStatus = headerList[i].saleReturnStatus;
        if (saleReturnStatus == "SUBMITSALERETURN") {
          error_info.push("退货单:" + code + ",没有确认,请确认后在下推!");
          break;
        }
      }
      let finish = [];
      let bodysql = " select returnQuantity,extend_acceptqty,extend_acceptgoodqty,extend_acceptbadqty,extend_acceptrefuseqty";
      bodysql = bodysql + " from voucher.salereturn.SaleReturnDetail";
      bodysql = bodysql + " where saleReturnId =" + id;
      var restList = ObjectStore.queryByYonQL(bodysql, "udinghuo");
      for (let i = 0; i < restList.length; i++) {
        var returnQuantity = restList[i].returnQuantity; //累计验收数量
        var extend_acceptqty = restList[i].extend_acceptqty; //累计验收数量
        var extend_acceptgoodqty = restList[i].extend_acceptgoodqty; //累计验收合格数量
        var extend_acceptbadqty = restList[i].extend_acceptbadqty; //累计验收不合格数量
        var extend_acceptrefuseqty = restList[i].extend_acceptrefuseqty; //累计验收拒收数量
        if (Number.parseFloat(returnQuantity) == Number.parseFloat(extend_acceptqty)) {
          finish.push("完成");
        }
      }
      if (restList.length > 0 && finish.length == restList.length) {
        error_info.push("退货单:" + code + ",已经累计验收完毕,没有可验收药品!");
      }
    }
    if (type == 2) {
      let bodysql = " select returnQuantity,extend_acceptqty,extend_acceptgoodqty,extend_acceptbadqty,extend_acceptrefuseqty";
      bodysql = bodysql + " from voucher.salereturn.SaleReturnDetail";
      bodysql = bodysql + " where saleReturnId =" + id;
      var List = ObjectStore.queryByYonQL(bodysql, "udinghuo");
      for (let i = 0; i < List.length; i++) {
        let Quantity = Number.parseFloat(List[i].returnQuantity); //退货数量
        let acceptqty = Number.parseFloat(List[i].extend_acceptqty); //累计验收数量
        let acceptgoodqty = Number.parseFloat(List[i].extend_acceptgoodqty); //累计验收合格数量
        let acceptbadqty = Number.parseFloat(List[i].extend_acceptbadqty); //累计验收不合格数量
        let acceptrefuseqty = Number.parseFloat(List[i].extend_acceptrefuseqty); //累计验收拒收数量
        if (null == acceptgoodqty || isNaN(acceptgoodqty)) {
          acceptgoodqty = 0;
        }
        if (null == acceptbadqty || isNaN(acceptbadqty)) {
          acceptbadqty = 0;
        }
        if (null == acceptrefuseqty || isNaN(acceptrefuseqty)) {
          acceptrefuseqty = 0;
        }
        if (null == acceptqty || isNaN(acceptqty)) {
          acceptqty = 0;
        }
        let temp_acceptgoodqty = Number.parseFloat(acceptgoodqty);
        let temp_aacceptbadqty = Number.parseFloat(acceptbadqty);
        let temp_acceptrefuseqty = Number.parseFloat(acceptrefuseqty);
        let temp_acceptqty = temp_acceptgoodqty + temp_aacceptbadqty + temp_acceptrefuseqty;
        //退货数量=累计验收数量
        if (Number.parseFloat(Quantity) > Number.parseFloat(acceptqty)) {
          error_info.push("退货单:" + code + ",退货数量(" + Quantity + ")不等于累计验收数量(" + acceptqty + "),未验收完毕不允许入库!");
          break;
        }
        //累计验收数量=累计验收合格数量+累计验收不合格数量+累计验收拒收数量
        if (Number.parseFloat(acceptqty) > Number.parseFloat(temp_acceptqty)) {
          error_info.push("退货单:" + code + ",验收数量(" + acceptqty + ")不等于累计验收数量合计(" + temp_acceptqty + ")不允许入库!");
          break;
        }
      }
    }
    let count = 0;
    for (var err = 0; err < error_info.length; err++) {
      count += 1;
      errInfo += error_info[err] + " \n ";
    }
    if (errInfo.length > 0) {
      return { errInfo };
    } else {
      return {};
    }
  }
}
exports({ entryPoint: MyAPIHandler });