let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sysDate = new Date();
    let curDate = sysDate.getFullYear() + "-" + (sysDate.getMonth() + 1) + "-" + sysDate.getDate();
    let queryStringSPC =
      "select distinct spqcStock,spqcProduct,id,concat(spqcStock,spqcProduct) flag  from  GT4691AT1.GT4691AT1.StockProductQtyPeriodControl where dr=0 and DATE_FORMAT(str_to_date(spqcLatelyUptDateTxt,101,'%Y-%m-%d'),'%Y-%m-%d') <> '" +
      curDate +
      "' or spqcLatelyUptDateTxt=null  limit 1,300";
    let queryResSPC = ObjectStore.queryByYonQL(queryStringSPC);
    let warehouses = [];
    let products = [];
    for (let i = queryResSPC.length - 1; i >= 0; i--) {
      let qr = queryResSPC[i];
      warehouses.push(qr.spqcStock);
      products.push(qr.spqcProduct);
    }
    let queryStringSBB = "select distinct warehouse,product,define2,concat(warehouse,product) flag  from st.batchno.Batchno where product in (" + products + ") and warehouse in (" + warehouses + ")";
    let resSBB = ObjectStore.queryByYonQL(queryStringSBB, "ustock");
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
      define2Ori = item["define2"];
      //最终的最近效期
      define2Final = newRes[flagindex].define2;
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
        spqcLatelyPeriod = newResItem.define2 !== undefined ? newResItem["define2"] : null;
        spqcUptRes = newResItem.define2 === undefined ? "未查找到效期信息" : "成功";
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
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });