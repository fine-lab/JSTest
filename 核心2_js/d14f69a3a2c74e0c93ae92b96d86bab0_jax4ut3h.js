let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let errorCode = "999999";
    let sql = "select * from bd.staff.StaffNew where name = '" + context.name + "' and dr = 0";
    let res = ObjectStore.queryByYonQL(sql, "u8c-auth");
    if (res.length == 0) {
      return { errorCode };
    }
    let body = {
      pageIndex: 1,
      pageSize: 10,
      code: res[0].code,
      name: res[0].name,
      mobile: res[0].mobile
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1672920C08100005", JSON.stringify(body));
    let recordList = JSON.parse(apiResponse).data.recordList;
    let data;
    if (recordList.length == 0) {
      throw new Error("姓名:" + res[0].name + ",编码:" + res[0].code + ",电话:" + res[0].mobile + ",没有查到员工信息!");
    } else {
      data = recordList[0];
    }
    return data;
  }
}
exports({ entryPoint: MyTrigger });