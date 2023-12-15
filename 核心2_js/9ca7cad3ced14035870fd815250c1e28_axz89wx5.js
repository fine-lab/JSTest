let chukubustype = "1826219767984291845"; //其他出库交易类型
viewModel.on("beforeSave", function (args) {
  let uidata = JSON.parse(args.data.data);
  let bustype = uidata.bustype;
  if (chukubustype == bustype) {
    let isnull = checkprojectisEmpty(uidata);
    if (isnull) {
      cb.utils.alert("【项目编码】不能为空!");
      return false;
    }
    let checkflag = isCheck(uidata);
    if (checkflag) {
      cb.utils.alert("【项目编码】+【物料编码】不唯一!");
      return false;
    }
  }
});
function isCheck(data) {
  let flag = false;
  let projectproductmap = new Map();
  let sum = 1;
  if (data.hasOwnProperty("othOutRecords")) {
    let viewrecords = data.othOutRecords;
    for (let i = 0; i < viewrecords.length; i++) {
      let viewrecord = viewrecords[i];
      let project = viewrecord.project;
      let product = viewrecord.product;
      let key = project + "@@" + product;
      if (null != projectproductmap.get(key)) {
        flag = true;
        break;
      } else {
        projectproductmap.set(key, sum);
      }
    }
  }
  return flag;
}
function checkprojectisEmpty(data) {
  let flag = false;
  if (data.hasOwnProperty("othOutRecords")) {
    let viewrecords = data.othOutRecords;
    for (let i = 0; i < viewrecords.length; i++) {
      let viewrecord = viewrecords[i];
      let project = viewrecord.project;
      if (isEmpty(project)) {
        flag = true;
        break;
      }
    }
  }
  return flag;
}
function isEmpty(jsonvalue) {
  let flag = false;
  if (undefined == jsonvalue || null == jsonvalue || "" == jsonvalue || "undefined" == jsonvalue) {
    flag = true;
  }
  return flag;
}