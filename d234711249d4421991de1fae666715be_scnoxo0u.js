let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取单据的id
    var id = param.billDO.id;
    console.log(JSON.stringify(param));
    console.log(id);
    var value =
      '{"linkAddress":"https://www.example.com/' +
      id +
      '","linkText":"面试管面试单详情"}';
    var object = { id: id, TextArea3se: value };
    var res = ObjectStore.updateById("AT18E699F017000002.AT18E699F017000002.mianshidan", object, "mianshidan");
    return {
      value: value
    };
  }
}
exports({ entryPoint: MyTrigger });