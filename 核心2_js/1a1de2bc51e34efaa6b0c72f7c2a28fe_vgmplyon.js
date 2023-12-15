let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查询用户
    const all = request.data;
    var object = {
      uname: all.uName,
      compositions: [
        {
          name: "wmnLYJLList",
          compositons: []
        },
        {
          name: "wmn_hold_zjList",
          compositons: []
        }
      ]
    };
    let result = ObjectStore.selectByMap("GT92839AT57.GT92839AT57.wmn_zhz_mg", object);
    if (result.length > 0) {
      let obj = result[0],
        lylist = result[0].wmnLYJLList || [];
      let ss = 1;
      if (all.wmnSXType == "1") {
        all.wmn_zz_lygh_lyzjtypeList.forEach((item) => {
          lylist.push({
            lingyongdandanhao: all.code,
            zj_zhengjianName: item.wmn_zz_lygh_lyzjtypeList,
            zj: item.lyzjtype,
            uName_name: all.uName_name,
            uName: all.uName,
            lingyongshiyou: all.wmnSYType,
            shifuyuqi: "2",
            guihuanDate: "",
            phone: all.phone,
            jiechuDate: request.date,
            JieChuStatus: "1",
            _status: "Insert"
          });
        });
      } else {
        ss = 2;
        const lylist_new = lylist.map((item) => {
          if (item.lingyongdandanhao == all.code) {
            item._status = "Update";
            item.guihuanDate = request.date;
            item.shifuyuqi = all.anqiguihuan || "2";
            item.yuqitianshu = all.yuqitianshu || 0;
            item.JieChuStatus = "2";
          }
          return item;
        });
        lylist = lylist_new;
      }
      obj.wmnLYJLList = lylist;
      result = ObjectStore.updateById("GT92839AT57.GT92839AT57.wmn_zhz_mg", obj);
      return { data: result, wjp: ss, list: lylist };
    }
    return { data: result };
  }
}
exports({ entryPoint: MyAPIHandler });