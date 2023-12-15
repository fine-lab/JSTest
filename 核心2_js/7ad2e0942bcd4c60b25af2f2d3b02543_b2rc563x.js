let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获得当前页面上有的参数
    let pageData = param.data[0];
    let cellNum = pageData.cellnum;
    let name = pageData.name;
    let sex = pageData.sex;
    if (pageData.id) {
      let sql = "select * from ifluxBaseDoc.ifluxBaseDoc.bd_doctor where dr=0 and cellnum = '" + cellNum + "' and sex = '" + sex + "' and name = '" + name + "'";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        throw new Error("电话号码为" + cellNum + "性别为" + sex + "的" + name + "的医生已经存在，请重新录入");
      }
    } else {
      //产寻数据库进行合法性校验
      let sql = "select * from ifluxBaseDoc.ifluxBaseDoc.bd_doctor where dr=0 and cellnum = '" + cellNum + "' and sex = '" + sex + "' and name = '" + name + "'";
      var res = ObjectStore.queryByYonQL(sql);
      if (res.length > 0) {
        throw new Error("电话号码为" + cellNum + "性别为" + sex + "的" + name + "的医生已经存在，请重新录入");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });