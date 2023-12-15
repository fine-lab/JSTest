let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询出水浒表中的所有信息
    var shPerson = ObjectStore.queryByYonQL("select * from GT31311AT438.GT31311AT438.WaterMargin where dr=0");
    //定义数组
    var insertdata = [shPerson.length];
    //循环遍历出水浒表中的数据
    for (var i = 0; i < shPerson.length; i++) {
      //将遍历出的数据存到变量中
      var persons = shPerson[i];
      //组装数据
      var KeyShPersons = {};
      KeyShPersons.name = persons.name;
      KeyShPersons.ranking = persons.ranking;
      KeyShPersons.age = persons.age;
      KeyShPersons.gender = persons.gender;
      KeyShPersons.nickname = persons.nickname;
      //把json数据存放到容器中
      insertdata[i] = KeyShPersons;
    }
    //插入水浒数据
    var res = ObjectStore.insertBatch("GT31311AT438.GT31311AT438.WaterMargin2", insertdata, "33634463");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });