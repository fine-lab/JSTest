let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgtree = {};
    let getchild = (list) => {
      for (let i in list) {
        let ele = list[i];
        let id = ele.id;
        let poj = {};
        for (let key in json2) {
          poj[key] = ele[key];
          if (ele["children"] !== undefined && ele["children"] !== null) {
            let children = ele["children"];
            getchild(children);
          }
        }
        orgtree[id] = poj;
      }
    };
    let json2 = {
      parent: "2082908660388864",
      code: "G511000000001_P01",
      innercode: "BUGQW67O4PDGT01084NBUKCM",
      parentid: "youridHere",
      path: "2057502204924160|2057502995534080|2058888943718656|2082908225426944|2082908660388864|2082910059663616|",
      enable: 1,
      id: "youridHere",
      level: 6,
      orgid: "youridHere",
      parentorgid: "youridHere",
      name: "内江市供销合作社联合社理事会内设部门"
    };
    // 获取所有业务单元树
    let func2 = extrequire("GT34544AT7.org.selectAllOrgTree");
    let arrtree = func2.execute(request).res;
    getchild(arrtree[1].children);
    let json1 = {
      name: "name",
      OrgCode: "code",
      shortname: "name",
      sysOrg: "orgid",
      sysOrgCode: "code",
      sysparent: "parentid",
      enable: "enable"
    };
    // 获取所有业务单元
    let func1 = extrequire("GT34544AT7.org.seleceAllOrg");
    let arr = func1.execute(request).res;
    let size1 = arr.length;
    let end = false;
    // 最新对象
    let arr1 = [];
    for (let i = 0; i < size1; i++) {
      let poj = arr[i];
      let poj1 = {};
      for (let key in json1) {
        let v = json1[key];
        if (v !== undefined && v !== null && v !== "") {
          poj1[key] = poj[v];
        }
      }
      let id = poj1.sys_orgId;
      if (orgtree[id] !== undefined && orgtree[id] !== null) {
        poj1.innercode = orgtree[id].innercode;
        let level = orgtree[id].level;
        if (arr1[level] === undefined || arr1[level] === null) {
          let arrc = [];
          arrc.push(poj1);
          arr1[level] = arrc;
        } else {
          let arrc = arr1[level];
          arrc.push(poj1);
          arr1[level] = arrc;
        }
      }
    }
    let res = arr1;
    return { res: res, size: arrtree.length };
  }
}
exports({ entryPoint: MyAPIHandler });