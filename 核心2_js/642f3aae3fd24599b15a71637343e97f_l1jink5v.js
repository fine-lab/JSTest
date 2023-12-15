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
    let queryString =
      "select distinct product,define2,DATE_FORMAT(Now(),'%Y-%m-%d') uptdate from st.batchno.Batchno where product in (" +
      product +
      ") and batchno in (" +
      curqty_batchs +
      ") and define2 is not null order by define2 limit 1,1 ";
    let res = ObjectStore.queryByYonQL(queryString, "ustock");
    let spqcLatelyPeriod = res.length === 0 ? "" : res[0].define2;
    let spqcUptRes = res.length === 0 ? "未查找到效期信息" : "成功";
    //处理特定格式日期
    let myDate = new Date();
    let dateStr = "" + myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + "";
    let spqcLatelyUptDate = res.length === 0 ? dateStr : res[0].uptdate;
    let uptObj = {
      id: objId,
      spqcLatelyPeriodTxt: spqcLatelyPeriod,
      spqcUptRes: spqcUptRes,
      spqcLatelyUptDateTxt: spqcLatelyUptDate,
      _status: "Update"
    };
    let uptRes = ObjectStore.updateById("GT4691AT1.GT4691AT1.StockProductQtyPeriodControl", uptObj, "6f8e84ff");
    return { queryString: queryString, response: { queryRes: res, uptRes: uptRes } };
  }
}
exports({ entryPoint: MyAPIHandler });