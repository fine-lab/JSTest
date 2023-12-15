let licenceList = viewModel.get("SY01_supply_change_licenceList"); //表格-供应商资质变更单-供应商/生产厂商证照
let licencesunList = viewModel.get("SY01_supply_change_licencesunList"); //表格-供应商资质变更-供应商/生产厂商证照范围
let sqwtsList = viewModel.get("SY01_supply_change_sqwtsList"); //表格-供应商资质变更单-授权委托书
let sqwtssunList = viewModel.get("SY01_supply_change_sqwtssunList"); //表格-供应商资质变更单-授权委托书范围
//修改显示高度
licenceList.setState("fixedHeight", 250);
licencesunList.setState("fixedHeight", 300);
sqwtsList.setState("fixedHeight", 250);
sqwtssunList.setState("fixedHeight", 300);