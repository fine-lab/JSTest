let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var djalldata = param.data[0];
    var id = djalldata.id;
    //不支持对原厂单据进行更新实体操作
    djalldata.defines.set("_entityName", "st.purinrecord.PurInRecordCustomItem");
    djalldata.defines.set("_keyName", id + "");
    djalldata.defines.set("_realtype", true);
    djalldata.defines.set("id", id + "");
    djalldata.defines.set("_status", "Insert");
    djalldata.defines.set("define12", 666 + "");
    return {};
  }
}
exports({ entryPoint: MyTrigger });