let AbstractTrigger = require("AbstractTrigger");
const getNowDate = (timeStamp) => {
  let date = new Date();
  if (timeStamp != undefined && timeStamp != null) {
    date = new Date(timeStamp);
  }
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
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let batchNum = 20;
    let APPCODE = "GT3734AT5";
    let querySql =
      "select yewm,id,yeWuYuan,yeWuYuan.mainJobList.dept_id as deptId,yeWuYuan.mainJobList.dept_id.name as deptName " + //,yeWuYuan,yeWuYuan.name,yeWuYuan.mainJobList.dept_id.name as deptName "
      " from GT3734AT5.GT3734AT5.XunPanXSBill " +
      " where yewm is null  and yeWuYuan is not null " +
      " order by yeWuYuan " +
      " limit 80";
    let deptRes = ObjectStore.queryByYonQL(querySql, "developplatform");
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 9, description: "自动更新业务员部门:", reqt: querySql, resp: JSON.stringify(deptRes) }));
    for (var i = 0; i < deptRes.length; i++) {
      let deptRObj = deptRes[i];
      let deptid = deptRObj.deptId;
      let id = deptRObj.id;
      let deptName = deptRObj.deptName;
      let biRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.XunPanXSBill", { id: id, yewm: deptid, yewm_name: deptName }, "66c03e66");
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });