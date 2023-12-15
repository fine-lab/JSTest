let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = {
      tenant_id: "youridHere",
      verifystate: 0,
      creator: "333a7c01-422f-4db5-bef2-bef4bfc34fa1",
      isWfControlled: 0,
      ytenant: "n95mi1ee",
      modifier: "333a7c01-422f-4db5-bef2-bef4bfc34fa1",
      typeName: "仰望星空",
      dr: 0,
      typeCode: "8888",
      modifyTime: "2023-07-21 17:20:24",
      createTime: "2023-07-21 14:12:15",
      id: "youridHere",
      bookList: [
        {
          tenant_id: "youridHere",
          auth: "奥特曼",
          ytenant: "n95mi1ee",
          type_id: "youridHere",
          name: "66666",
          id: "youridHere",
          dr: 0,
          _status: "Update"
        }
      ]
    };
    var res = ObjectStore.updateById("AT18A48B9208700008.AT18A48B9208700008.type", object, "yb7f008d66List");
    throw new Error(JSON.stringify(res));
    return {};
  }
}
exports({ entryPoint: MyTrigger });