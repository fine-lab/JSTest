let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = "select count(*) from GT39030AT17.GT39030AT17.bookDetail";
    var length = ObjectStore.queryByYonQL(sql).length;
    var sql2 = "select * from GT39030AT17.GT39030AT17.bookDetail";
    var data = ObjectStore.queryByYonQL(sql2);
    for (var i = 0; i < length; i++) {
      var bookId = data[i].bookId;
      //获取要更新的实体id
      var entity_id = data[i].id;
      var bookName = data[i].bookName;
      var Inventorysum = 'select count(*) from GT39030AT17.GT39030AT17.inventoryDetail where bookNum like "' + bookId + '" and bookName = "' + bookName + '"'; //通过前两级的编码来获得总库存数目
      var sum_inventory = ObjectStore.queryByYonQL(Inventorysum).length;
      //库存量进行更新
      var resinventorynum = 'select count(*) from GT39030AT17.GT39030AT17.inventoryDetail where bookStatus = "2" and bookNum like "' + bookId + '" and bookName = "' + bookName + '"';
      var sum_resinventory = ObjectStore.queryByYonQL(resinventorynum).length;
      if (sum_inventory > 0 && sum_resinventory > 0) {
        var bookDetail_inventory = { id: entity_id, inventory: sum_inventory, residInventory: sum_resinventory, status: "1" };
      } else if (sum_inventory > 0 && sum_resinventory == 0) {
        bookDetail_inventory = { id: entity_id, inventory: sum_inventory, residInventory: sum_resinventory, status: "2" };
      } else {
        bookDetail_inventory = { id: entity_id, inventory: sum_inventory, residInventory: sum_resinventory, status: "3" };
      }
      var res_inventory = ObjectStore.updateById("GT39030AT17.GT39030AT17.bookDetail", bookDetail_inventory);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });