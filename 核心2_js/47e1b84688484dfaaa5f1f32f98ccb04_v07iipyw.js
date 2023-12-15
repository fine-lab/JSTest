let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 本批次增加了多少本书
    var length = param.data[0].batchDetail2List.length;
    for (var i = 0; i < length; i++) {
      var num = param.data[0].batchDetail2List[i].num; //遍历每一本书的num
      var bookId = param.data[0].batchDetail2List[i].bookId; //编码->前两级别
      var bookName = param.data[0].batchDetail2List[i].bookName_bookName; //获得书名
      // 查询现有该书名的数量
      var checkExist = 'select count(*) from GT39030AT17.GT39030AT17.inventoryDetail where bookName = "' + bookName + '"'; //检测该书的登记数量
      var existNum = ObjectStore.queryByYonQL(checkExist).length;
      for (var j = 0; j < num; j++) {
        //按照数量添加实体,本版本开始考虑三级编码
        var ThirdCode = existNum == undefined ? j + 1 : existNum + j + 1; //第三级编码
        var strs = [bookId, ThirdCode];
        var code = join(strs, "-"); //编码拼接
        var object = { bookNum: code, bookName: bookName, bookStatus: "2" };
        var res = ObjectStore.insert("GT39030AT17.GT39030AT17.inventoryDetail", object, "cebe69ea");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });