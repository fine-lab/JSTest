let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sql = "select * from GT37846AT3.GT37846AT3.RZH_11 where YeWu_state in (1, 2)";
    var res = ObjectStore.queryByYonQL(sql);
    //超过15天为签收的列表id
    const idList = [];
    // 获取当前时间戳
    const currentTimeStamp = Date.now();
    res.forEach((item) => {
      if (item.YeWu_state == 1 || item.YeWu_state == 2) {
        // 获取待比较的时间戳
        const timestamp = new Date(item.createTime + "+08:00").getTime();
        //测试用 出货日期
        idList.push(timestamp);
        // 计算两者之间的时间戳差（以毫秒为单位）
        const timeStampDiff = Math.abs(currentTimeStamp - timestamp);
        // 将时间戳差转换为天数
        const daysDiff = Math.floor(timeStampDiff / (24 * 60 * 60 * 1000));
        idList.push(daysDiff);
        // 判断两者之间的时间戳差是否大于等于 15
        if (daysDiff >= 15) {
          var updateWrapper = new Wrapper();
          updateWrapper.eq("id", item.id);
          //待更新字段内容
          var toUpdate = {
            QianShouRen: "系统自动签收",
            YeWu_state: "3"
          };
          var res = ObjectStore.update("GT37846AT3.GT37846AT3.RZH_11", toUpdate, updateWrapper, "af6531a9");
        }
      }
    });
    return { res: res, idList: idList, sql: sql, currentTimeStamp: currentTimeStamp };
  }
}
exports({ entryPoint: MyTrigger });