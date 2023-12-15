let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    //遍历子体  获取更新全路径名称的实体语句
    function updateChildSql(id, qljmc) {
      let childData = [];
      let cparam = { parent: id };
      let cres = ObjectStore.selectByMap("GT70743AT32.GT70743AT32.RZKM", cparam);
      if (cres && cres.length > 0) {
        for (var inum = 0; inum < cres.length; inum++) {
          let cqljmc = qljmc + "-" + cres[inum].name;
          childData.push({ id: cres[inum].id, quanlujingmingchen: cqljmc });
          let cd = updateChildSql(cres[inum].id, cqljmc);
          childData = childData.concat(cd);
        }
      }
      return childData;
    }
    let id = data.id;
    let name = data.name;
    let parent = data.parent;
    let quanlujingmingchen = name; //全路径名称默认为当前名称
    //如果存在父分类，则取：父分类全路径名称_名称
    if (parent) {
      //查询内容
      var object = { id: parent };
      //实体查询
      var parentRes = ObjectStore.selectById("GT70743AT32.GT70743AT32.RZKM", object);
      quanlujingmingchen = parentRes.quanlujingmingchen + "-" + name;
    }
    param.data[0].set("quanlujingmingchen", quanlujingmingchen);
    //批量更新子分类的全路径名称
    if (id) {
      let childParam = updateChildSql(id, quanlujingmingchen);
      if (childParam.length > 0) {
        ObjectStore.updateBatch("GT70743AT32.GT70743AT32.RZKM", childParam);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });