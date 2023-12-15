let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let id = param.data[0].id; // 主表id
    let updateArr = [];
    let searchSQL =
      "select *,vendorId.name,(select *,unit.name,(select * from suppliershippingschedulesnList) as suppliershippingschedulesnList from suppliershippingschedulebList) suppliershippingschedulebList from GT39325AT4.GT39325AT4.suppliershippingschedule where id = " +
      id;
    var searchRes = ObjectStore.queryByYonQL(searchSQL);
    let res;
    if (searchRes && searchRes.length > 0) {
      for (var i = 0; i < searchRes.length; i++) {
        let suppliershippingschedulebList = searchRes[i].suppliershippingschedulebList;
        for (var j = 0; j < suppliershippingschedulebList.length; j++) {
          let suppliershippingscheduleb = suppliershippingschedulebList[j];
          let remaining_quantity_old = suppliershippingscheduleb.remaining_quantity;
          if (remaining_quantity_old && remaining_quantity_old != "") {
            remaining_quantity_old = parseInt(remaining_quantity_old);
          } else {
            remaining_quantity_old = 0;
          }
          let bill_quantitiy = suppliershippingscheduleb.bill_quantitiy;
          if (bill_quantitiy && bill_quantitiy != "") {
            bill_quantitiy = parseInt(bill_quantitiy);
          } else {
            bill_quantitiy = 0;
          }
          let sended_quantitiy = suppliershippingscheduleb.sended_quantitiy;
          if (sended_quantitiy && sended_quantitiy != "") {
            sended_quantitiy = parseInt(sended_quantitiy);
          } else {
            sended_quantitiy = 0;
          }
          let remaining_quantity_new = parseInt(suppliershippingscheduleb.quantitiy) - bill_quantitiy - sended_quantitiy;
          if (remaining_quantity_old != remaining_quantity_new) {
            let updateItemChild = { id: suppliershippingscheduleb.id, remaining_quantity: remaining_quantity_new + "", _status: "Update" };
            updateArr.push(updateItemChild);
          }
        }
      }
      if (updateArr && updateArr.length > 0) {
        let updateItem = { id: id, suppliershippingschedulebList: updateArr };
        res = ObjectStore.updateById("GT39325AT4.GT39325AT4.suppliershippingschedule", updateItem, "suppliershippingschedule");
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });