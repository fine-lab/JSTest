let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var bookName = param.data[0].bookName; //获取图书名称
    var typeCode = param.data[0].typeCode; //获取第一级编码
    var author = param.data[0].author; //获取作者名字
    var Id = param.data[0].bookId;
    //判断是新增还是编辑，如果是新增，会进入后面代码块，如果是编辑，直接结束。
    if (Id == null) {
      var numSql = 'select count(*) from GT39030AT17.GT39030AT17.bookDetail where typeCode = "' + typeCode + '" order by createTime DESC '; //统计该类别中已有多少统一一级编码的书籍
      var bookNum = ObjectStore.queryByYonQL(numSql).length;
      if (bookNum != 1) {
        var bookId = ObjectStore.queryByYonQL(numSql)[1].bookId;
        var number = substring(bookId, 1);
        var num = parseInt(number) + 1;
        var code = [typeCode, num];
        var firstCode = join(code, ""); // 拼接1级字符串
        var object = { id: param.data[0].id, bookId: firstCode, residInventory: "0", inventory: "0", status: "3" };
        var res = ObjectStore.updateById("GT39030AT17.GT39030AT17.bookDetail", object);
        return { res };
      } else {
        var code = [typeCode, "1"];
        var firstCode = join(code, ""); // 拼接1级字符串
        var object = { id: param.data[0].id, bookId: firstCode, residInventory: "0", inventory: "0", status: "3" };
        var res = ObjectStore.updateById("GT39030AT17.GT39030AT17.bookDetail", object);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });