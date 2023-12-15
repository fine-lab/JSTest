console.log(123);
viewModel.on("afterLoadData", () => {
  loadStyle();
});
const dianpuVM = viewModel.get("dianpu_name");
dianpuVM.on("beforeBrowse", (data) => {
  const { pageData } = viewModel.getParams();
  //获取供应商使用范围
  var condition = {
    isExtend: true,
    simpleVOs: []
  };
  condition.simpleVOs.push({
    field: "owner_tel", // 取自参照字段元数据的cFieldName的值（从参照UI设计器中取）
    op: "eq",
    value1: pageData.phone
  });
  dianpuVM.setFilter(condition);
});
viewModel.get("btnSave").on("click", () => {
  const all = viewModel.getAllData();
  cb.rest.invokeFunction(
    "AT15E22AA808080003.backend.sysData",
    {
      url: "AT15E22AA808080003.AT15E22AA808080003.jingyingfyddmg",
      object: {
        feiytype: "1",
        dongzuo: all.fuwufei_dz,
        chufatype: all.chufatype,
        dianzhang: "41190711609438976",
        dianzhang_name: "周志康",
        phone: "+86-18531638227",
        charuziduan12: all.fuwufei_danqi,
        guanlianfwriqi_start: all.hezuo_shengxdate,
        guanlianfwriqi_end: all.fuwu_enddate,
        mark: all.fuwufei_mark,
        shenqingwenjian: "7b7528b0-56d2-11ed-a2e9-5b59ae64e13d",
        ssdgongfukuaninfoList: [],
        ssfukuaninfoList: [],
        qtbillguanlian2List: [],
        jingyingfyddmg_sheji_shopList: [
          {
            sheji_shop: all.dianpu,
            jingyingfyddmg_sheji_shopList: all.dianpu_name
          }
        ]
      },
      billNo: "6ec0db57List"
    },
    function (err, res) {
      if (res) {
        genLog(all);
      }
    }
  );
});
// 操作流水
function genLog(all) {
  const { pageData } = viewModel.getParams();
  cb.rest.invokeFunction(
    "AT15E22AA808080003.backend.sysData",
    {
      url: "AT15E22AA808080003.AT15E22AA808080003.caozuoliusui",
      object: {
        chufatype: "1",
        ssjingyfeiyongmg_id: pageData.id || "1578193446818545666",
        dongzuo: all.fuwufei_dz,
        caozuoren: "2294214498013440",
        sheji_jine: all.fuwufei_danqi,
        ssjingyfeiyongmg_id_id: pageData.id || "1578193446818545666",
        caozuo_content: "1",
        czdate: "2022-10-29",
        billcode: "000001",
        _status: "Insert",
        feiytype: "1",
        caozuoliusui_sheji_shopList: [
          {
            sheji_shop: "1578432968554708995",
            caozuoliusui_sheji_shopList: "新鲜水果店-1",
            id: "youridHere",
            fkid: "youridHere"
          }
        ],
        caozuoren_name: "王金鹏",
        mark: all.fuwufei_mark
      },
      billNo: "67faa355List"
    },
    function (err, res) {
      const p = viewModel.getCache("parentViewModel");
      p.execute("refresh");
      viewModel.communication({
        type: "return"
      });
    }
  );
}
//加载自定义样式 (无异步、css不生效问题，效果好)
function loadStyle(params) {
  var headobj = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  style.innerText = `.wui-modal-footer .viewContainer.width-percent-25 {width: 100%!important;}`;
  headobj.appendChild(style);
}