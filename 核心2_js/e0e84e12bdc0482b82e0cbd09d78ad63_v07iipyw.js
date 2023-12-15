let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bookId = request.pageData.bookId_bookNum;
    var bookName = request.pageData.borrowBook_bookName;
    //查询要借阅的图书在库存明细表中的id
    var querysqlId = 'select id from GT39030AT17.GT39030AT17.inventoryDetail where bookStatus = "2" and bookNum = "' + bookId + '"';
    var usId = ObjectStore.queryByYonQL(querysqlId)[0].id;
    //对这本书的图书状态进行更新
    var object = {
      id: usId,
      bookStatus: "1",
      subTable: [
        { hasDefaultInit: true, key: "yourkeyHere", _status: "Insert" },
        { id: "youridHere", _status: "Delete" }
      ]
    };
    ObjectStore.updateById("GT39030AT17.GT39030AT17.inventoryDetail", object);
    var id = bookId.split("-")[0];
    //借出状态
    let status = "1";
    var sql = 'select count(*) from GT39030AT17.GT39030AT17.inventoryDetail where bookStatus = "2" and bookNum like "' + id + '" and bookName = "' + bookName + '"';
    var num = ObjectStore.queryByYonQL(sql).length;
    if (num == "0") {
      status = "2";
    }
    // 更新表的状态
    var object = {
      id: request.pageData.borrowBook,
      status: status,
      residInventory: num,
      subTable: [
        { hasDefaultInit: true, key: "yourkeyHere", _status: "Insert" },
        { id: "youridHere", _status: "Delete" }
      ]
    };
    var retobj = ObjectStore.updateById("GT39030AT17.GT39030AT17.bookDetail", object);
    if (retobj != null) {
      return { data: retobj[0] };
    } else {
      return { data: data };
    }
    return { bookId };
  }
}
exports({ entryPoint: MyAPIHandler });