let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var typeCode = param.data[0].typeCode; //获取对应分类的typeCode
    var sql = 'select count(*) from GT39030AT17.GT39030AT17.bookDetail where bookId like "' + typeCode + '"';
    var res = ObjectStore.queryByYonQL(sql).length;
    if (res != 0) {
      throw new Error("本分类下还有书籍，请先删除本分类下的书籍!");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });