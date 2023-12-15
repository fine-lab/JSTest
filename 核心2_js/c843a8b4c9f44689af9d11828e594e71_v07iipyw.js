let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var bookId = param.data[0].bookId_bookRecordId; //通过传入的bookRecord带入书籍的Id
    //更新该书籍状态为上架
    var inventoryEntityIdSql = 'select id from GT39030AT17.GT39030AT17.inventoryDetail where bookNum = "' + bookId + '" '; //寻求库存中对应书籍的id
    var inventoryEntityId = ObjectStore.queryByYonQL(inventoryEntityIdSql)[0].id;
    //更新书籍状态
    var inventoryObject = { id: inventoryEntityId, bookStatus: "2" };
    var inventoryRes = ObjectStore.updateById("GT39030AT17.GT39030AT17.inventoryDetail", inventoryObject);
    var recordEntitySql = 'select id from GT39030AT17.GT39030AT17.borrowRecord where bookId.bookNum = "' + bookId + '" and action = "1"';
    var recordEntity = ObjectStore.queryByYonQL(recordEntitySql)[0].id;
    if (param.data[0].preReturnTIme < param.data[0].returnTime) {
      var recordObject = { id: recordEntity, action: "3" };
      var recordRes = ObjectStore.updateById("GT39030AT17.GT39030AT17.borrowRecord", recordObject);
    } else {
      var recordObject = { id: recordEntity, action: "2" };
      var recordRes = ObjectStore.updateById("GT39030AT17.GT39030AT17.borrowRecord", recordObject);
    }
    //图书详情中库存剩余数量+1
    var firstCode = bookId.split("-")[0]; //分割出前两级编码
    var bookDetialIdSql = 'select id from GT39030AT17.GT39030AT17.bookDetail where bookId = "' + firstCode + '"';
    var bookDetailId = ObjectStore.queryByYonQL(bookDetialIdSql)[0].id; //找出书名id
    var bookResiNumSql = 'select residInventory from GT39030AT17.GT39030AT17.bookDetail where bookId = "' + firstCode + '"';
    var bookResiNum = ObjectStore.queryByYonQL(bookResiNumSql)[0].residInventory; //找出书名剩余库存
    var bookSumNumSql = 'select inventory from GT39030AT17.GT39030AT17.bookDetail where bookId = "' + firstCode + '"';
    var bookSumNum = ObjectStore.queryByYonQL(bookSumNumSql)[0].inventory; //查出总库存进行校验
    bookResiNum = bookResiNum >= bookSumNum ? bookSumNum : bookResiNum + 1;
    var object = { id: bookDetailId, residInventory: bookResiNum, status: "1" };
    var res = ObjectStore.updateById("GT39030AT17.GT39030AT17.bookDetail", object);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });