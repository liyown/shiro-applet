import {
  createClient,
  allControllers,
  IRequestAdapter,
} from "@mx-space/api-client";
import Cookies from "js-cookie";
import { API_URL } from "~/constants/env";
import { axios, AxiosInstance, AxiosResponse } from "taro-axios";

const $http = /*#__PURE__*/ axios.create({});

// 请求拦截器
$http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    config.headers["Authorization"] = `Bearer ${getToken()}`;
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

export const taroAxiosAdaptor: IRequestAdapter<
  AxiosInstance,
  AxiosResponse<unknown>
> = Object.preventExtensions({
  get default() {
    return $http;
  },
  responseWrapper: {} as any as AxiosResponse<unknown>,
  // @ts-ignore
  get(url, options) {
    return $http.get(url, options);
  },
  post(url, options) {
    const { data, ...config } = options || {};
    // @ts-ignore
    return $http.post(url, data, config);
  },

  put(url, options) {
    const { data, ...config } = options || {};
    // @ts-ignore
    return $http.put(url, data, config);
  },

  delete(url, options) {
    const { ...config } = options || {};
    // @ts-ignore
    return $http.delete(url, config);
  },
  patch(url, options) {
    const { data, ...config } = options || {};
    // @ts-ignore
    return $http.patch(url, data, config);
  },
});
export default taroAxiosAdaptor;

export const createApiClient = (fetchAdapter: typeof taroAxiosAdaptor) =>
  createClient(fetchAdapter)(API_URL, {
    controllers: allControllers,
    getDataFromResponse(response: any) {
      return response;
    },
  });

export const TokenKey = "mx-token";

export const ClerkCookieKey = "__session";
export const AuthKeyNames = [TokenKey, ClerkCookieKey];

export function getToken(): string | null {
  // FUCK clerk constants not export, and mark it internal and can not custom
  // packages/backend/src/constants.ts
  const clerkJwt = Cookies.get(ClerkCookieKey);

  const token = Cookies.get(TokenKey) || clerkJwt;

  return token || null;
}

export function getApiToken(): string | undefined{

  return process.env.API_TOKEN;
}
