let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sysDate = new Date();
    let year = sysDate.getFullYear();
    let month = sysDate.getMonth() + 1;
    let date = sysDate.getDate();
    let curDate = year + "-" + (month < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
    let queryStringSPC = "select distinct spqcStock,spqcProduct,id,concat(spqcStock,spqcProduct) flag  from  GT4691AT1.GT4691AT1.StockProductQtyPeriodControl where dr=0";
    let queryResSPC = ObjectStore.queryByYonQL(queryStringSPC);
    if (queryResSPC.length === 0) {
      return {};
    }
    let warehouses = [];
    let products = [];
    for (let i = queryResSPC.length - 1; i >= 0; i--) {
      let qr = queryResSPC[i];
      warehouses.push(qr.spqcStock);
      products.push(qr.spqcProduct);
    }
    //查询有结存的物料
    let queryStringCurqty =
      "select distinct batchno,product,warehouse,concat(batchno,product) cqflag from stock.currentstock.CurrentStock where product in (" +
      products +
      ") and warehouse in (" +
      warehouses +
      ") and currentqty<>0 and batchno is not null";
    let resCurqty = ObjectStore.queryByYonQL(queryStringCurqty, "ustock");
    let curqty_prods = [];
    let curqty_batchs = [];
    for (let i = resCurqty.length - 1; i >= 0; i--) {
      let cq = resCurqty[i];
      curqty_prods.push(cq.product);
      curqty_batchs.push(JSON.stringify(cq.batchno));
    }
    let queryStringSBB =
      "select distinct batchno,product,define2,concat(batchno,product) sbbflag  from st.batchno.Batchno where product in (" +
      curqty_prods +
      ") and batchno in (" +
      curqty_batchs +
      ") and  define2 is not null";
    let resSBB = ObjectStore.queryByYonQL(queryStringSBB, "ustock");
    for (var i = 0; i < resSBB.length; i++) {
      let item = resSBB[i];
      let sbbflag = item["sbbflag"];
      let cqflagIndex = resCurqty.findIndex((item) => item["cqflag"] === sbbflag);
      if (cqflagIndex < 0) {
        resSBB[i]["flag"] = "";
        continue;
      }
      resSBB[i]["flag"] = "" + resCurqty[cqflagIndex].warehouse + resCurqty[cqflagIndex].product + "";
    }
    let newRes = [];
    for (let i = resSBB.length - 1; i >= 0; i--) {
      let item = resSBB[i];
      let flag = item["flag"];
      let flagindex = newRes.findIndex((item) => item["flag"] === flag);
      if (flagindex < 0) {
        let obj = {};
        obj["flag"] = flag;
        obj["define2"] = item["define2"];
        newRes.push(obj);
        continue;
      }
      //批次表查询结果集
      let define2Ori = item["define2"];
      //最终的最近效期
      let define2Final = newRes[flagindex].define2;
      //比较define2Ori与最终的最近效期，若define2Ori更小，则替换define2Final的值
      let arrOri = define2Ori.split("-");
      let start = new Date(arrOri[0], arrOri[1] - 1, arrOri[2]);
      let starts = start.getTime(); //输出时间戳
      let arrFinal = define2Final.split("-");
      let end = new Date(arrFinal[0], arrFinal[1] - 1, arrFinal[2]);
      let ends = end.getTime();
      if (starts < ends) {
        newRes[flagindex].define2 = item["define2"];
      }
    }
    let uptObjList = [];
    for (let i = queryResSPC.length - 1; i >= 0; i--) {
      let qrs = queryResSPC[i];
      let spqcLatelyPeriod;
      let spqcUptRes;
      if (newRes.length !== 0) {
        let defFinaIndex = newRes.findIndex((item) => item["flag"] === qrs.flag);
        let newResItem = newRes[defFinaIndex];
        spqcLatelyPeriod = defFinaIndex !== -1 && newResItem.define2 !== undefined ? newResItem["define2"] : null;
        spqcUptRes = defFinaIndex !== -1 && newResItem.define2 !== undefined ? "成功" : "未查找到效期信息";
      } else {
        spqcLatelyPeriod = null;
        spqcUptRes = "未查找到效期信息";
      }
      let spqcLatelyUptDate = curDate;
      let uptObj = {
        id: qrs.id,
        spqcLatelyPeriodTxt: spqcLatelyPeriod,
        spqcUptRes: spqcUptRes,
        spqcLatelyUptDateTxt: spqcLatelyUptDate,
        _status: "Update"
      };
      uptObjList.push(uptObj);
    }
    let uptRes = ObjectStore.updateBatch("GT4691AT1.GT4691AT1.StockProductQtyPeriodControl", uptObjList, "6f8e84ff");
    return { message: { queryStringSPC: queryStringSPC, queryStringCurqty: queryStringCurqty, queryStringSBB: queryStringSBB } };
  }
}
exports({ entryPoint: MyAPIHandler });