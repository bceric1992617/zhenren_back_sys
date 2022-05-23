import { http } from "@/utils/request";


export function getAllPlatformRate(datas) {
  return http.request({
    method: "post",
    url: "/settingCenter/getAllPlatformRate",
    data: datas
  });
}


export function exportChangeRecord(datas) {
  return http.request({
    method: "post",
    url: "/export/exportChangeRecord",
    responseType : 'blob',

    data: datas,
  });
}