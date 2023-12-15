let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let warehouse = request.warehouse;
    let product = request.product;
    let objId = request.id;
    let queryStringCurqty =
      "select distinct batchno,product,warehouse from stock.currentstock.CurrentStock where product in (" +
      product +
      ") and warehouse in (" +
      warehouse +
      ") and currentqty<>0 and batchno is not null";
    let resCurqty = ObjectStore.queryByYonQL(queryStringCurqty, "ustock");
    let curqty_batchs = [];
    for (let i = resCurqty.length - 1; i >= 0; i--) {
      let cq = resCurqty[i];
      curqty_batchs.push(JSON.stringify(cq.batchno));
    }
    let res = [];
    let queryString =
      "select distinct product,define2,DATE_FORMAT(Now(),'%Y-%m-%d') uptdate from st.batchno.Batchno where product in (" +
      product +
      ") and batchno in (" +
      curqty_batchs +
      ") and define2 is not null order by define2 limit 1,1 ";
    if (curqty_batchs.length !== 0) {
      res = ObjectStore.queryByYonQL(queryString, "yonbip-scm-scmbd");
    }
    let spqcLatelyPeriod = res.length === 0 ? "" : res[0].define2;
    let spqcUptRes = res.length === 0 ? "未查找到效期信息" : "成功";
    //处理特定格式日期
    let myDate = new Date();
    let sysDate = new Date();
    let year = sysDate.getFullYear();
    let month = sysDate.getMonth() + 1;
    let date = sysDate.getDate();
    let dateStr = year + "-" + (month < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
    let spqcLatelyUptDate = res.length === 0 ? dateStr : res[0].uptdate;
    let uptObj = {
      id: objId,
      spqcLatelyPeriodTxt: spqcLatelyPeriod.substring(0, 10),
      spqcUptRes: spqcUptRes,
      spqcLatelyUptDateTxt: spqcLatelyUptDate,
      _status: "Update"
    };
    let uptRes = ObjectStore.updateById("GT4691AT1.GT4691AT1.StockProductQtyPeriodControl", uptObj, "029fbbad");
    return { queryStringCurqty: queryStringCurqty, queryString: queryString, response: { queryRes: res, uptRes: uptRes } };
  }
}
exports({ entryPoint: MyAPIHandler });