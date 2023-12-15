let AbstractTrigger = require("AbstractTrigger");
const getU8Domain = (keyParams) => {
  let U8DOMAIN = "https://www.example.com/";
  return U8DOMAIN + keyParams;
};
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
const chkDs = (queryRst, dsObj) => {
  for (var i in queryRst) {
    let obj = queryRst[i];
    if (obj.u8ds == dsObj.id) {
      return true;
    }
  }
  return false;
};
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    {
      let baseDataTypeDes = "基础资料--新加账套";
      let pageSize = 200;
      //同步数据
      let queryRst24 = ObjectStore.queryByYonQL(
        "select * from AT1703B12408A00002.AT1703B12408A00002.baseDataCopy where dr=0 and (updFlag=0 or updFlag is null) order by id limit " + pageSize,
        "developplatform"
      );
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataTypeDes + "-1", reqt: JSON.stringify(queryRst24), resp: "" }));
      let dsRst = [];
      if (queryRst24.length > 0) {
        dsRst = ObjectStore.queryByYonQL("select * from AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence where isEnabled=1 and dr=0", "developplatform");
      }
      for (var k in queryRst24) {
        let bsObj = queryRst24[k];
        let bsID = bsObj.id;
        let sqlStr = "select id,u8ds from  AT1703B12408A00002.AT1703B12408A00002.baseDataCopyEntry where baseDataCopy_id='" + bsID + "' and dr=0";
        let queryRst = ObjectStore.queryByYonQL(sqlStr, "developplatform");
        let fg = false;
        for (var j in dsRst) {
          let u8dsObj = dsRst[j];
          if (!chkDs(queryRst, u8dsObj)) {
            fg = true;
            ObjectStore.updateById(
              "AT1703B12408A00002.AT1703B12408A00002.baseDataCopy",
              {
                id: bsID,
                updFlag: true,
                baseDataCopyEntryList: { hasDefaultInit: true, _status: "Insert", syncTime: getNowDate(), baseDataCopy_id: bsID, ds_sequence: u8dsObj.ds_sequence, u8ds: u8dsObj.id, syncRst: false }
              },
              "yb60af18ba"
            );
          }
        }
        if (!fg) {
          ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.baseDataCopy", { id: bsID, updFlag: true }, "yb60af18ba");
        }
      }
      return;
    }
  }
}
exports({ entryPoint: MyTrigger });