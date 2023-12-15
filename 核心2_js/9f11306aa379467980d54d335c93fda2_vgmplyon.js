console.log(123);
const { pageData, rowData } = viewModel.getParams();
viewModel.on("afterLoadData", () => {
  loadStyle();
  viewModel.get("yuanfw_enddate").setValue(rowData.htdate);
});
viewModel.get("btnSave").on("click", () => {
  cb.rest.invokeFunction(
    "AT15E22AA808080003.backend.sysData",
    {
      url: "AT15E22AA808080003.AT15E22AA808080003.jingyingfyddmg",
      object: {
        dianzhang_name: pageData.dianzhu,
        creator_userName: pageData.dianzhu_name,
        dianzhang: "41190711609438976",
        feiytype: "2",
        dongzuo: "4",
        chufatype: "12",
        guanlianfwriqi_end: viewModel.get("yanchang_date").getValue(),
        phone: pageData.phone,
        createTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
        charuziduan12: 50000,
        mark: "延期服务",
        guanlianfwriqi_start: new Date().format("yyyy-MM-dd")
      },
      billNo: "6ec0db57List"
    },
    function (err, res) {
      if (res) {
        genLog();
      }
    }
  );
});
// 操作流水
function genLog() {
  cb.rest.invokeFunction(
    "AT15E22AA808080003.backend.sysData",
    {
      url: "AT15E22AA808080003.AT15E22AA808080003.caozuoliusui",
      object: {
        chufatype: "12",
        ssjingyfeiyongmg_id: pageData.id,
        dongzuo: "4",
        caozuoren: "2294214498013440",
        sheji_jine: 0,
        ssjingyfeiyongmg_id_id: pageData.id,
        caozuo_content: "1",
        czdate: "2022-10-29",
        billcode: "000001",
        _status: "Insert",
        feiytype: "2",
        caozuoliusui_sheji_shopList: [
          {
            sheji_shop: "1578432968554708995",
            caozuoliusui_sheji_shopList: "新鲜水果店-1",
            id: "youridHere",
            fkid: "youridHere"
          }
        ],
        caozuoren_name: "王金鹏",
        mark: "延期服务"
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