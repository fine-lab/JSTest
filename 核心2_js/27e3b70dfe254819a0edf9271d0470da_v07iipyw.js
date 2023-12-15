let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var experience = param.data[0].experience;
    var str = param.data[0].bookId_bookRecordId;
    var length = experience.length;
    if (length < 20) {
      throw new Error("心得不得少于20字");
    }
    var bookId = str.split("-")[0]; //获取二级编码，如A1，A2这样。
    var sql = 'select recStart from GT39030AT17.GT39030AT17.borrowRecord where action = "2" and bookId.bookNum like "' + bookId + '"'; //查到所有有关于这本书的已经归还的借阅记录
    var star = ObjectStore.queryByYonQL(sql);
    var sql_2 = 'select id from GT39030AT17.GT39030AT17.bookDetail where bookId = "' + bookId + '"'; //获取这本书在图书详情表中的id，便于后续的更新操作。
    var id = ObjectStore.queryByYonQL(sql_2)[0].id;
    var i = 1;
    var num = 0;
    for (i = 0; i < star.length; i++) {
      num = num + star[i].recStart;
    }
    num = MoneyFormatReturnBd(num / star.length, 1); //获取用户对于图书推荐度的平均值。
    var object = {
      id: id,
      start: num,
      subTable: [
        { hasDefaultInit: true, key: "yourkeyHere", _status: "Insert" },
        { id: "youridHere", _status: "Delete" }
      ]
    };
    ObjectStore.updateById("GT39030AT17.GT39030AT17.bookDetail", object); //更新
    return {};
  }
}
exports({ entryPoint: MyTrigger });