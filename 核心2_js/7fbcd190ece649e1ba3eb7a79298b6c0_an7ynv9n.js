let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var items = request.items;
    for (var i = 0; items[i] != null; i++) {
      var object = {
        id: id,
        cnt: "100",
        presale_bList: [
          {
            id: items[i].id,
            usednum: items[i].usednum, //占用数
            canusenum: items[i].canusenum, //可用数
            isexist: "1",
            hasDefaultInit: true,
            _status: "Update"
          }
        ]
      };
      var res = ObjectStore.updateById("GT80750AT4.GT80750AT4.presale_h", object);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });