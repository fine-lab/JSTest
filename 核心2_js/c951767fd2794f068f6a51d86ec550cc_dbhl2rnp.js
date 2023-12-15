//查询内容
var object = {
  id: Product,
  compositions: [
    {
      name: Product,
      compositions: [Product]
    }
  ]
};
//实体查询
var res = ObjectStore.selectById("实体url", object);