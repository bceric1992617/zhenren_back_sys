import { http } from "@/utils/request";


export function login(datas) {
  return http.request({
    method: "post",
    url: "/login",
    data: datas
  });
}

export function loginout() {
  return http.request({
    method: "post",
    url: "/quit",
    data: {}
  });
}




