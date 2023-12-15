viewModel.on("afterMount", () => {
  //加载js-xlsx
  loadJsXlsx(viewModel);
  loadJsXlsxs(viewModel);
  loadJsXlsxss(viewModel);
  fileSaver(viewModel);
});
function loadJsXlsx(viewModel) {
  console.log("loadJsXlsx执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsx.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function loadJsXlsxs(viewModel) {
  console.log("loadJsXlsxs执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsxStyle.utils.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function loadJsXlsxss(viewModel) {
  console.log("loadJsXlsxss执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/xlsxStyle.core.min.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
function fileSaver(viewModel) {
  console.log("fileSaver执行完成");
  //动态引入js-xlsx库
  var secScript = document.createElement("script");
  //保存传入的viewModel对象
  window.viewModelInfo = viewModel;
  secScript.setAttribute("type", "text/javascript");
  //传入文件地址 subId:应用ID
  secScript.setAttribute("src", `/iuap-yonbuilder-runtime/opencomponentsystem/public/GT102917AT3/FileSaver.js?domainKey=developplatform`);
  document.body.insertBefore(secScript, document.body.lastChild);
}
viewModel.get("button24gd") &&
  viewModel.get("button24gd").on("click", function (data) {
    //按钮--单击
    //创建一个工作簿
    var workbook = XLSX.utils.book_new();
    //添加主表表头
    var data = [];
    data.push([
      "生产工号",
      "状态",
      "型号",
      "电梯类型",
      "层",
      "站",
      "门",
      "安装组长",
      "吊装组长",
      "搭棚组长",
      "日立监理",
      "营业员",
      "接收合同30天状态",
      "监理微信群",
      "一次地盘检查报告",
      "现场检查照片和视频",
      "温馨提示",
      "报装资料提示",
      "地盘报告2状态",
      "营业计划上二排日期",
      "日立上二排日期",
      "二次地盘检查报告",
      "发货5天内状态",
      "日立发货日期",
      "任务下达单提交日期",
      "任务下达单审批日期",
      "任务下达单计划验收完成日期",
      "客户施工计划",
      "开工报告",
      "放样地盘检查报告",
      "出厂合格证",
      "监理提交告知资料日期",
      "告知资料提交完成周期",
      "告知日期",
      "告知单位",
      "计划进场日期",
      "进场日期",
      "监理提交监检资料日期",
      "监检资料提交完成周期",
      "监检提交日期",
      "监检提交完成周期",
      "监检审批完成日期",
      "监检审批完成周期",
      "报调日期N",
      "报验日期",
      "厂检报告",
      "日立三令情况",
      "KY上报情况",
      "调试完成日期",
      "曲线达标情况",
      "打曲线次数",
      "退调日期",
      "退检日期N",
      "退检完成日期",
      "计划技检日期N",
      "实际技检日期",
      "技检完成周期",
      "计划验收日期N",
      "实际验收日期",
      "验收完成周期",
      "技检完工周期",
      "验收完工周期",
      "是否合格",
      "技检报告",
      "技检报告周期",
      "质保合同双方盖章",
      "质保合同完成周期",
      "使用登记证提交日期",
      "使用登记证审批完成日期",
      "使用登记证完成周期",
      "电梯移交确认书",
      "电梯移交完成周期",
      "资料移交表",
      "资料移交完成周期",
      "完工袋完成日期",
      "完工袋完成周期",
      "日立确认完工",
      "日立确认完工周期",
      "AN2工法检查日期",
      "AN2工法检查分数",
      "AN2工法出现菜单N",
      "吊篮工法检查日期N",
      "吊篮工法检查分数",
      "吊篮工法出现菜单N",
      "脚手架检查日期",
      "脚手架检查分数",
      "脚手架出现菜单N",
      "扶梯检查日期",
      "扶梯检查分数",
      "扶梯检查出现菜单N",
      "安全整改完成日期N",
      "导轨检验日期",
      "质量自检日期",
      "质量自检出现菜单N",
      "备注1",
      "备注2",
      "备注3",
      "备注4",
      "备注5",
      "备注6",
      "备注7",
      "备注8",
      "备注9",
      "备注10",
      "备注11",
      "备注12",
      "备注13",
      "备注14",
      "备注15"
    ]);
    data.push([
      "字符,长度200",
      "枚举,{'1':'待安装','2':'安装中','3':'已完成'},长度36",
      "字符,长度200",
      "枚举,{'1':'高速电梯','2':'普通电梯','3':'扶梯','4':'私人电梯','5':'其他','6':'货梯'},长度36",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "枚举,{'1':'未完成','2':'正常完成','3':'超期未完成','4':'超期完成'},长度36",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "枚举,{'1':'未完成','2':'正常完成','3':'超期未完成','4':'超期完成'},长度200",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "枚举,{'1':'未完成','2':'正常完成','3':'超期未完成','4':'超期完成'},长度36",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "枚举,{'1':'不考核','2':'超标','3':'达G标','4':'达Q标','5':'达H标','6':'合格','7':'未提供'},长度36",
      "字符,长度200",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "日期,长度23",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "枚举,{'1':'正常完成','2':'超期完成'},长度36",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "字符,长度200",
      "日期,长度23",
      "字符,长度200",
      "枚举,{'22':'按AN2工法安全关键节点检查表进行安全确认','23':'工具房是否张贴《安装现场安全注意事项》及安全海报、事故案例、紧急联络表等','24':'移动作业平台脚手架搭设严禁超高,轿厢地板到轿厢移动作业平台脚手架顶部的距离严禁超过6米','25':'对重块加入后必须使用钢丝绳将对重块捆扎固定,防止倾落','10':'轿厢移动作业平台搭设必须符合工艺要求','11':'轿架及移动作业平台必须按工艺要求安装栏杆和踢脚板','12':'电梯检修AN运行,移动作业平台拆除前,不能组装轿厢','13':'需使用厚度为15MM以上的木板铺设平台面板及头顶防护板','14':'轿厢缓冲器及对重缓冲器的安装:底坑第一根导轨安装完毕,在轿架安装前,必须安装好轿厢缓冲器及对重缓冲器','15':'限速器及限速器钢丝绳的安装:安装好轿架和对重架后,在轿厢移动作业平台安装前,必须按工艺要求安装好限速器及限速器钢丝绳,并固定在安全钳提拉杆上','16':'正确安装临时上、下限位开关','17':'随行电缆的安装:电梯检修AN运行前必须按工艺安装随行电缆,轿顶电气箱安装在轿顶','18':'AN2工法施工时应使用专用的移动开关(设急停按钮,上下行标识明确,运行按钮)','19':'安装对重架时首次加入对重块数量参照《AN2工法首次加载对重块重量一览表》','1':'安全帽是否有穿戴及正确使用','2':'安全鞋是否有穿戴及正确使用','3':'工作服是否有穿戴及正确使用','4':'安全带是否有穿戴','5':'在2米以上高处作业或临边作业时有效使用安全带','6':'机房预留孔、吊装孔、临时门等开口部是否进行有效防护','7':'井道出入口、开口部是否进行有效的全防护','8':'是否按要求张贴安全警示标志?(如厅门开锁警示、厅门口警示标志)','9':'在井道口作业时在作业区域范围内设置安全警示,避免无关人员进入','20':'安装人员持证上岗','21':'安全日记是否配备按时填写(人员信息、安全教育、KY等)'},长度36",
      "日期,长度23",
      "字符,长度200",
      "枚举,{'1':'安全帽是否有穿戴及正确使用','2':'安全带是否有穿戴','3':'在2米以上高处作业或临边作业时有效使用安全带','4':'机房预留孔、吊装孔、临时门等开口部是否进行有效防护','5':'井道出入口、开口部是否进行有效防护','6':'是否按要求张贴安全警示标志?(如厅门开锁警示、厅门口警示标志)','7':'在井道口作业时在作业区域范围内设置安全警示,避免无关人员进入','8':'施工前防护顶棚必须要安装到位,不得弃用或漏装','9':'平台内的载荷必须均匀分布,严禁超过额定载荷、是否有配置灭火器','10':'拼装轿厢是否使用专用夹具','11':'安装人员持证上岗','12':'安全日记是否配备按时填写(人员信息、安全教育、KY等)','13':'是否按时填写电梯安装重要安全节点表','14':'有人在吊篮上作业时,平台下方严禁站人,严禁交叉作业','15':'作业平台悬挂高处时,严禁随意拆卸提升机、安全锁、钢丝绳等','16':'工具房是否张贴《安装现场安全注意事项》及安全海报、事故案例等','17':'工具房是否张贴“人员紧急联络电话”','18':'安全鞋是否有穿戴及正确使用','19':'工作服是否有穿戴及正确使用'},长度36",
      "日期,长度23",
      "字符,长度200",
      "枚举,{'1':'安全帽是否有穿戴及正确使用','2':'安全带是否有穿戴','3':'在2米以上高处作业或临边作业时有效使用安全带','4':'机房预留孔、吊装孔等开口部是否进行有效防护','5':'井道出入口、开口部是否进行有效防护','6':'是否按要求张贴安全警示标志?(如厅门开锁警示、厅门口警示标志)','7':'在井道口作业时在作业区域范围内设置安全警示,避免无关人员进入','8':'脚手架是否按工艺要求每层设置作业平台、拆卸横杆后是否及时复位','9':'灭火器是否放在指定的场所','10':'拼装轿厢是否使用专用夹具','11':'安装人员持证上岗','12':'安全日记是否配备按时填写(人员信息、安全教育、KY等)','13':'是否按时填写电梯安装重要安全节点表','14':'工具房是否张贴《安装现场安全注意事项》及安全海报、事故案例等','15':'工具房是否张贴“人员紧急联络电话”','16':'安全鞋是否有穿戴及正确使用','17':'工作服是否有穿戴及正确使用'},长度36",
      "日期,长度23",
      "字符,长度200",
      "枚举,{'1':'安全帽是否有穿戴及正确使用','2':'安全鞋是否有穿戴及正确使用','3':'工作服是否有穿戴及正确使用','4':'安全带是否有穿戴','5':'在2米以上高处作业或临边作业时有效使用安全带','6':'焊接作业时,灭火器是否放在指定的场所','7':'电动工具、照明器具的外壳、开关、软线等是否完好','8':'是否配备合格的配电箱?专用配电箱(配有漏电保护器)是否装好','9':'扶梯井道开口部及上、下部出入口的安全防护是否已设置','10':'在扶梯桁架内作业时电源是否切断?锁匙在非运行时不能插在匙孔上','11':'共同作业时的联络与信号是否确实可靠','12':'扶梯井道每层安全围栏是否每边张贴“电梯作业,危险勿近”的标识,数量2张以上','13':'在桁架内是否设置安全主绳并使用安全带','14':'接通电源前,是否先确认桁架内及周围有人正在作业','15':'切断电源后,是否挂上“严禁合闸”的标志牌','16':'扶梯放样后,是否马上挂上“小心样线”警示标志','17':'是否违反禁止上下交叉立体作业的规定','18':'安装人员持证上岗','19':'安全日记是否配备按时填写(人员信息、安全教育、KY等)','20':'工具房是否张贴安全挂画、事故案例、紧急联系表等'},长度200",
      "日期,长度23",
      "日期,长度23",
      "日期,长度23",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200",
      "字符,长度200"
    ]);
    //数组转换为工作表
    var dateSheet = XLSX.utils.aoa_to_sheet(data);
    //工作表插入工作簿
    XLSX.utils.book_append_sheet(workbook, dateSheet, "安装合同明细");
    var width = [
      { wch: 8 },
      { wch: 10 },
      { wch: 8 },
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 10 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 80 },
      { wch: 8 },
      { wch: 8 },
      { wch: 70 },
      { wch: 8 },
      { wch: 8 },
      { wch: 70 },
      { wch: 8 },
      { wch: 8 },
      { wch: 70 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 }
    ];
    XSU.setColWidth(workbook, "安装合同明细", width);
    XSU.setAlignmentHorizontalAll(workbook, "安装合同明细", "center"); //垂直居中
    XSU.setAlignmentVerticalAll(workbook, "安装合同明细", "center"); //水平居中
    XSU.setAlignmentWrapTextAll(workbook, "安装合同明细", true); //自动换行
    XSU.setBorderDefaultAll(workbook, "安装合同明细"); //设置所有单元格默认边框
    var BorderList = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "AA",
      "AB",
      "AC",
      "AD",
      "AE",
      "AF",
      "AG",
      "AH",
      "AI",
      "AJ",
      "AK",
      "AL",
      "AM",
      "AN",
      "AO",
      "AP",
      "AQ",
      "AR",
      "AS",
      "AT",
      "AU",
      "AV",
      "AW",
      "AX",
      "AY",
      "AZ",
      "BA",
      "BB",
      "BC",
      "BD",
      "BE",
      "BF",
      "BG",
      "BH",
      "BI",
      "BJ",
      "BK",
      "BL",
      "BM",
      "BN",
      "BO",
      "BP",
      "BQ",
      "BR",
      "BS",
      "BT",
      "BU",
      "BV",
      "BW",
      "BX",
      "BY",
      "BZ",
      "CA",
      "CB",
      "CC",
      "CD",
      "CE",
      "CF",
      "CG",
      "CH",
      "CI",
      "CJ",
      "CK",
      "CL",
      "CM",
      "CN",
      "CO",
      "CP",
      "CQ",
      "CR",
      "CS",
      "CT",
      "CU",
      "CV",
      "CW",
      "CX",
      "CY",
      "CZ",
      "DA",
      "DB",
      "DC",
      "DD",
      "DE"
    ];
    var BorderStr = "";
    //设置字体大小
    XSU.setFontSizeAll(workbook, "安装合同明细", 10);
    for (var n = 0; n < BorderList.length; n++) {
      BorderStr = BorderList[n] + 2;
      XSU.setFontSize(workbook, "安装合同明细", BorderStr, 7);
    }
    for (var n = 0; n < BorderList.length; n++) {
      BorderStr = BorderList[n] + 1;
      XSU.setFillFgColorRGB(workbook, "安装合同明细", BorderStr, "ADADAD");
    }
    var wopts = {
      bookType: "xlsx", // 要生成的文件类型
      bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
      type: "binary"
    };
    var myDate = new Date();
    let workBookName = "安装合同更新导入模板" + ".xlsx";
    var wbout = xlsxStyle.write(workbook, wopts);
    //保存，使用FileSaver.js
    saveAs(new Blob([XSU.s2ab(wbout)], { type: "" }), workBookName);
  });
viewModel.get("button29bf") &&
  viewModel.get("button29bf").on("click", function (data) {
    //导入更新--单击
    //加载js-xlsx
    loadJsXlsx(viewModel);
    loadJsXlsxs(viewModel);
    loadJsXlsxss(viewModel);
    fileSaver(viewModel);
    //触发文件点击事件
    selectFile();
  });
function selectFile() {
  var fileInput = document.createElement("input");
  fileInput.id = "youridHere";
  fileInput.type = "file";
  fileInput.style = "display:none";
  document.body.insertBefore(fileInput, document.body.lastChild);
  //点击id 是 filee_input_info 的文件上传按钮
  document.getElementById("filee_input_info").click();
  console.log("文件按钮单击次数");
  var dou = document.getElementById("filee_input_info");
  dou.onchange = function (e) {
    console.log("获取文件触发");
    //获取上传excel文件
    var files = e.target.files;
    if (files.length == 0) {
      return;
    }
    var filesData = files[0];
    //对文件进行处理
    readWorkbookFromLocalFile(filesData, function (workbook) {
      readWorkbook(workbook);
    });
  };
  document.getElementById("filee_input_info").value = "";
}
function readWorkbookFromLocalFile(file, callback) {
  console.log("readWorkbookFromLocalFile执行完成");
  var reader = new FileReader();
  reader.onload = function (e) {
    var localData = e.target.result;
    var workbook = XLSX.read(localData, { type: "binary" });
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
}
function readWorkbook(workbook) {
  var sheetNames = workbook.SheetNames; // 工作表名称集合
  const workbookDatas = [];
  //获取每个sheet页的数据
  for (let i = 0; i < sheetNames.length; i++) {
    console.log("循环sheet页");
    let sheetNamesItem = sheetNames[i];
    var sheetNameList = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNamesItem]);
    if (sheetNameList.length > 0) {
      workbookDatas[i] = sheetNameList;
    }
  }
  //对获取的数据进行缓存
  window.viewModelInfo.setCache("workbookInfoDatas", workbookDatas);
  execlponse();
  console.log("readWorkbook执行完成");
}
function execlponse() {
  //获取excel数据
  debugger;
  var execl = viewModel.getCache("workbookInfoDatas");
  var sheetone = execl[0];
  viewModel.clearCache("workbookInfoDatas");
  var productArray = new Array();
  var err = "未导入原因:第";
  for (var i = 1; i < sheetone.length; i++) {
    if (sheetone[i]["生产工号"] != undefined) {
      productArray.push(sheetone[i]);
    } else {
      err = err + i + "、";
    }
  }
  if (sheetone.length - productArray.length - 1 == 0) {
    err = "";
  } else {
    err = err + "行生产工号为空";
  }
  var BOMresponse = cb.rest.invokeFunction("GT102917AT3.import.AZImport", { productArray: productArray }, function (err, res) {}, viewModel, { async: false });
  var BOMresponse = cb.rest.invokeFunction("GT102917AT3.import.ANZSave", { productArray: productArray }, function (err, res) {}, viewModel, { async: false });
  cb.utils.confirm("总条数：" + (sheetone.length - 1) + ",导入条数：" + productArray.length + "未导入条数：" + (sheetone.length - productArray.length - 1) + "," + err + ";");
  //自动刷新页面
  viewModel.clearCache("workbookInfoDatas");
  viewModel.execute("refresh");
}