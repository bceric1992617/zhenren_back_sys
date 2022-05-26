import { http } from "@/utils/request";





export function exportChangeRecord(datas) {
  return http.request({
    method: "post",
    url: "/export/exportChangeRecord",
    responseType : 'blob',

    data: datas,
  });
}

export function getCurrency() {
  return http.request({
    method: "post",
    url: "/common/currencyList",

  });
}

export function getRuleName() {
  return http.request({
    method: "post",
    url: "/bet/order/game/ruleNameList",

  });
}