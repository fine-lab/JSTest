viewModel.get("button15lc") &&
  viewModel.get("button15lc").on("click", function (data) {
    // 确认--单击
    const row = viewModel.getGridModel().getAllData()[data.index];
    if (row.status == "转移中") {
      const obj = {
        //单据类型：VoucherList为列表类型   voucher为卡片类型
        billtype: "VoucherList",
        //单据号
        billno: "yb5741ca10",
        params: {
          // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
          mode: "add",
          reqData: {
            mode: "1",
            type: "receive",
            data: {
              mode: "1",
              id: row.id,
              status: "已转移"
            }
          }
        }
      };
      // 打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", obj, viewModel);
    } else if (row.status == "已转移") {
      cb.utils.alert("当前项目已转移！");
    }
  });
viewModel.get("button13mc") &&
  viewModel.get("button13mc").on("click", function (data) {
    // 驳回--单击
    const row = viewModel.getGridModel().getAllData()[data.index];
    if (row.status == "转移中") {
      const obj = {
        //单据类型：VoucherList为列表类型   voucher为卡片类型
        billtype: "VoucherList",
        //单据号
        billno: "yb5741ca10",
        params: {
          // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
          mode: "add",
          reqData: {
            type: "receive",
            mode: "2",
            data: {
              mode: "2",
              id: row.id,
              status: "转移已驳回"
            }
          }
        }
      };
      // 打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", obj, viewModel);
    } else if (row.status == "已转移") {
      cb.utils.alert("当前项目已转移！");
    }
  });
viewModel.on("modeChange", function (e) {
  if (e == "edit") {
    // 设置cell状态
  }
});
const instrayArr = [
  {
    instray: "离散制造",
    code: "1010",
    userId: ["846de48a-cd61-401c-a721-7531b1d573c7", "106", "075338e9-77c8-4974-9a95-777b59f5940e"]
  },
  {
    instray: "离散-工业电子",
    userId: []
  },
  {
    instray: "消费品",
    code: "1030",
    userId: ["125869", "77d6a511-663f-48cb-bb5c-1b40ce86b531", "2b607c6e-5b83-4256-83ee-eaa7906b2a1a", "77d6a511-663f-48cb-bb5c-1b40ce86b531"]
  },
  {
    instray: "流程制造",
    code: "1040",
    userId: ["120560", "87e93223-c0fe-46e2-8dc5-beb0362d620a", "6a8d57ba-f45c-483a-93cd-7aad92e68f70"]
  },
  {
    instray: "钢铁冶金",
    code: "1050",
    userId: ["a713f474-ca3a-4387-b7dc-dee323c61437", "e846d541-9144-4b61-9941-7eed8153f6a5", "e846d541-9144-4b61-9941-7eed8153f6a5", "uspace_386725"]
  },
  {
    instray: "工业化工与造纸",
    code: "1060",
    userId: ["51444997-0ca9-43b2-876a-5d3e1f77d5bc", "176d3a20-4758-4081-b0b9-a9fb4f82cd0d"]
  },
  {
    instray: "制药与医药流通",
    code: "1070",
    userId: ["01a5c259-a5f5-4971-9ffc-40bc8e253d7b", "271b98fe-d0d9-4189-9243-0e76c56fce73"]
  },
  {
    instray: "食品饮料",
    code: "1080",
    userId: ["120730"]
  },
  {
    instray: "酒业",
    code: "1090",
    userId: ["413ab5e8-437a-4e8e-983a-712b25c01ba4", "552055"]
  },
  {
    instray: "装备制造",
    code: "1100",
    userId: ["ea12314d-690e-4165-bc57-0704a2ab78f0", "bad6a3aa-bd49-4e86-8bbc-56894d9b6615", "03704e27-f113-4127-8978-f01b52622755", "6d46f4c9-c838-4c99-81e9-2de722f0e3e8", "1288679"]
  },
  {
    instray: "能源",
    code: "1110",
    userId: ["e0b448d8-823d-4435-824d-85c430434349", "860168cd-7ec9-45f2-b0e8-642374e54016"]
  },
  {
    instray: "交通运输与物流",
    code: "1120",
    userId: ["1330644", "553196"]
  },
  {
    instray: "航空与机场",
    code: "1130",
    userId: ["72f82768-f867-4ae8-97ab-b47bf9aed586", "b6168cc0-7a87-4963-a10e-113bb2630c49"]
  },
  {
    instray: "公用事业",
    code: "1140",
    userId: ["1299853", "383714", "9ce6465d-8248-4b15-bb53-6d7aeada0e3c"]
  },
  {
    instray: "建筑",
    code: "1150",
    userId: ["d1483cb8-dc9a-4246-8ced-5f57006a46f4", "6696abdf-5c85-4edf-bdeb-7565520f1189", "a00a4ccf-a5f1-47c0-99b3-38c248b17eea", "09ead2f5-335c-4118-bc21-726428e5afd7"]
  },
  {
    instray: "地产",
    code: "1160",
    userId: ["caa3c9e3-5cb0-4ec6-8fcf-d7cad447eb03", "c4a22c8a-1b56-4358-b425-64a73ae3ef75"]
  },
  {
    instray: "现代服务",
    code: "1170",
    userId: ["8318f5fd-1467-4611-a1e0-3deedf19681c", "105187", "1446469"]
  },
  {
    instray: "医疗",
    code: "1180",
    userId: ["50355c1e-db20-42b6-85a3-37e7bcb22169"]
  },
  {
    instray: "贸易",
    code: "1190",
    userId: ["8063b2b2-4c90-405d-a60f-f7a29866c881", "f0d24217-9d1c-49c7-98a9-74c8ae322a53", "121109", "185036eb-ad1f-490b-9895-17cfe643ca97", "fadd4e77-5b4f-4f42-a4c9-587f5a185f76"]
  },
  {
    instray: "互联网",
    code: "1200",
    userId: ["4fbe9a25-1aa6-47bb-ade8-db8cbcf0b661", "7aa74933-92d0-4526-ac23-bf9ec8f7b8c3"]
  },
  {
    instray: "农牧",
    code: "1210",
    userId: ["8d0411fc-1290-4048-8c55-cbc59929dc24", "9161eabc-f4ab-4176-87ab-612cff8a15ff"]
  },
  {
    instray: "国资监管与投资控股",
    code: "1220",
    userId: [
      "1e625024-2002-4607-8586-e759a30012d5",
      "5037b303-7159-4706-b787-6e443bc96921",
      "1495849",
      "6ebaab7a-1a35-4488-abdc-e0c94ae529a0",
      "bffe07b5-f955-4197-9f22-e270b90dcda5",
      "6ec0dcc0-d442-4b58-b0b8-4db3daa365b3",
      "af3793f4-5e3b-48ac-bee0-a0cd697516b3",
      "bfb4d9ae-df75-46ac-b624-5ef8579dd432",
      "1275883",
      "a5a7bf25-8d54-4ba8-ad34-10b1f4644b6e",
      "18850",
      "2bfa3daa-98e1-4086-a867-cf3691fcbf71",
      "00a6be30-8b73-4d21-b9d1-f21740723e3a"
    ]
  },
  {
    instray: "酒店餐饮",
    code: "1230",
    userId: ["1275899", "60b40b48-ecdf-4608-8f1f-f257987c0f47"]
  },
  {
    instray: "战略客户事业本部",
    userId: ["9df51da6-596e-4bd3-a58e-fee192c75da9"]
  },
  {
    instray: "央客",
    userId: []
  },
  {
    instray: "战略能源客户事业部",
    userId: ["9df51da6-596e-4bd3-a58e-fee192c75da9"]
  },
  {
    instray: "战略客户事业部",
    userId: ["a8edc3b8-49a2-4f74-8f2b-6c304e32ee93"]
  },
  {
    instray: "电信与广电",
    code: "1280",
    userId: ["0a084b9b-f5c5-4247-9b5b-7f9a6bb42ea0"]
  },
  {
    instray: "海外区",
    userId: ["uspace_2928109"]
  },
  {
    instray: "零售分销",
    code: "1300",
    userId: ["8725d5ed-20a6-4084-80fd-6cbe509531d5", "6837caea-d1e3-4885-872b-6f09881c4aaa", "3a149bd8-2413-472d-9fab-d8abe371ee1c", "80d3dee6-5541-4cf3-b56d-72c388dbf385"]
  }
];
viewModel.on("beforeSearch", function (args) {
  var commonVOs = args.params.condition.commonVOs;
  const userId = viewModel.getAppContext().user.userId;
  debugger;
  let instrayName = "";
  instrayArr.forEach((item) => {
    if (item.userId.includes(userId)) {
      instrayName = item.code;
    }
  });
  commonVOs.push({
    itemName: "industry2",
    value1: instrayName
  });
});
viewModel.get("project_transfer_base_1634241808194600961") &&
  viewModel.get("project_transfer_base_1634241808194600961").on("afterSetDataSource", function (data) {
    // 表格--设置数据源后
    let model = viewModel.getGridModel();
    let mode = viewModel.getParams().mode;
    debugger;
    if (mode !== "edit") {
      data.forEach((item, index) => {
        if (item.status != "已转移") {
          model.setCellState(index, "q1PlanReturnTime2", "disabled", true);
          model.setCellState(index, "q1RealReturnTime2", "disabled", true);
          model.setCellState(index, "q1RealReturnMoney", "disabled", true);
          model.setCellState(index, "q1ReturnMoneyPrediction", "disabled", true);
        }
      });
    }
  });
viewModel.get("btnRefresh") &&
  viewModel.get("btnRefresh").on("click", function (data) {
    // 批量审批--单击
    const selectRows = viewModel.getGridModel().getSelectedRows();
    const resRows = [];
    selectRows.forEach((item) => {
      resRows.push({
        id: item.id,
        status: "已转移"
      });
    });
    if (selectRows.length > 0) {
      const obj = {
        //单据类型：VoucherList为列表类型   voucher为卡片类型
        billtype: "VoucherList",
        //单据号
        billno: "yb5741ca10",
        params: {
          // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
          mode: "add",
          reqData: {
            mode: "1",
            type: "batch",
            data: resRows
          }
        }
      };
      // 打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", obj, viewModel);
    } else {
      cb.utils.alert("请先选择数据！");
    }
  });
viewModel.on("customInit", function (data) {
  viewModel.getGridModel().setPageSize(200);
});
viewModel.get("btnBatchPrintnow") &&
  viewModel.get("btnBatchPrintnow").on("click", function (data) {
    // 批量驳回--单击
    const selectRows = viewModel.getGridModel().getSelectedRows();
    const resRows = [];
    selectRows.forEach((item) => {
      resRows.push({
        id: item.id,
        status: "转移已驳回"
      });
    });
    if (selectRows.length > 0) {
      const obj = {
        //单据类型：VoucherList为列表类型   voucher为卡片类型
        billtype: "VoucherList",
        //单据号
        billno: "yb5741ca10",
        params: {
          // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
          mode: "add",
          reqData: {
            mode: "2",
            type: "batch",
            data: resRows
          }
        }
      };
      // 打开一个单据，并在当前页面显示
      cb.loader.runCommandLine("bill", obj, viewModel);
    } else {
      cb.utils.alert("请先选择数据！");
    }
  });
viewModel.getGridModel().on("cellJointQuery", function (args) {
  const obj = {
    //单据类型：VoucherList为列表类型   voucher为卡片类型
    billtype: "Voucher",
    //单据号
    billno: "yb5bfc037a",
    params: {
      // 单据页面展示状态(编辑态edit、新增态add、浏览态browse)
      mode: "browse",
      id: args.row.id, //TODO:填写详情id
      domainKey: "yourKeyHere",
      readOnly: true,
      reqData: {
        type: "batch",
        data: args
      }
    }
  };
  // 打开一个单据，并在当前页面显示
  cb.loader.runCommandLine("bill", obj, viewModel);
});