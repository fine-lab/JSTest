let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let defUrl = "https://www.example.com/";
    let defbody = {
      pageIndex: 1,
      pageSize: 40,
      custdocdefcode: "wbzykb_field"
    }; //AT17E908FC08280001.task.updateProCode
    let defRes = openLinker("POST", defUrl, "AT17E908FC08280001", JSON.stringify(defbody));
    let recordList = JSON.parse(defRes).data.recordList;
    let fieldMap = new Map();
    for (let i = 0; i < recordList.length; i++) {
      let record = recordList[i];
      fieldMap.set(record.name.zh_CN, record.id);
    }
    for (let j = 0; j < upList.length; j++) {
      // 更新条件
      let updateWrapper = new Wrapper();
      updateWrapper.eq("part_contract_code", upList[j].code);
      // 待更新字段内容
      let toUpdate = { part_outsouce_field: fieldMap.get(upList[j].field) };
      // 执行更新
      let res = ObjectStore.update("AT17E908FC08280001.AT17E908FC08280001.part_out_resouce", toUpdate, updateWrapper, "ybd993b5aa");
    }
    return { 1: "2" };
  }
}
exports({ entryPoint: MyAPIHandler });