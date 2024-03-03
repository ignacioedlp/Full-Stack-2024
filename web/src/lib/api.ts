/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { redirectToLogin } from "./redirects";

interface RequestBuilderOptions {
  method: string;
  url: string;
  userAuthToken?: string;
  data?: any;
  params?: any;
  customHeader?: any;
  responseType: any;
  headers?: any;
}

interface RequestBuilderResult {
  cancel: () => void;
  request: Promise<AxiosResponse<any>>;
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  maxRedirects: 0,
  headers: {
    Accept: "application/json",
  },
});

instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  (error) => {
    // Check for a cancelled request
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Handle unauthenticated errors
    if (error.response?.status === 401) {
      // Redirect to the login unless we are already there
      const redirected = redirectToLogin();
      if (redirected) return;
    }
    return Promise.reject(error);
  }
);

const requestBuilder = ({
  method,
  url,
  userAuthToken,
  data,
  params,
  customHeader = {},
  responseType = "json",
}: RequestBuilderOptions): RequestBuilderResult => {
  // Generate the cancel token
  const cancelTokenSource = axios.CancelToken.source();

  // Generate the instance
  const instanceOptions: AxiosRequestConfig = {
    cancelToken: cancelTokenSource.token,
    method,
    url,
    responseType,
  };
  const headers: any = {
    Authorization: `Bearer ${userAuthToken}`,
  };

  if (userAuthToken) {
    instanceOptions.headers = {
      ...headers,
      ...customHeader,
    };
  }
  if (data) {
    instanceOptions.data = data;
  }
  if (params) {
    instanceOptions.params = params;
  }
  const axiosInstance: Promise<AxiosResponse<any>> = instance(instanceOptions);

  // Return the promise and the cancel function
  return {
    cancel: cancelTokenSource.cancel,
    request: axiosInstance,
  };
};

export default {
  auth: {
    login: ({ data }: { data: any }) =>
      requestBuilder({
        method: "POST",
        url: "/auth/login",
        data,
        responseType: "json",
      }),
    register: ({ data }: { data: any }) =>
      requestBuilder({
        method: "POST",
        url: "/auth/signup",
        data,
        responseType: "json",
      }),
    logout: ({ userAuthToken }: { userAuthToken: string }) =>
      requestBuilder({
        method: "POST",
        url: "/auth/logout",
        userAuthToken,
        responseType: "json",
      }),
    forgotPassword: ({ data }: { data: any }) =>
      requestBuilder({
        method: "POST",
        url: "/auth/forgot-password",
        data,
        responseType: "json",
      }),
    resetPassword: ({
      data,
      userAuthToken,
    }: {
      data: any;
      userAuthToken: string;
    }) =>
      requestBuilder({
        method: "POST",
        url: "/auth/reset-password",
        data,
        userAuthToken,
        responseType: "json",
      }),
    activateAccount: ({
      data,
      userAuthToken,
    }: {
      data: any;
      userAuthToken: string;
    }) =>
      requestBuilder({
        method: "POST",
        url: "/auth/activate",
        data,
        userAuthToken,
        responseType: "json",
      }),
    refresh: ({ userAuthToken }: { userAuthToken: string }) =>
      requestBuilder({
        method: "GET",
        url: "/auth/refresh",
        userAuthToken,
        responseType: "json",
      }),
  },
  users: {
    getUser: ({ userAuthToken, id }: { userAuthToken: string; id: string }) =>
      requestBuilder({
        method: "GET",
        url: `/users/${id}`,
        userAuthToken,
        responseType: "json",
      }),
    updateUser: ({
      userAuthToken,
      data,
      id,
    }: {
      userAuthToken: string;
      data: any;
      id: string;
    }) =>
      requestBuilder({
        method: "PATCH",
        url: `/users/${id}`,
        userAuthToken,
        data,
        responseType: "json",
      }),
    getAllUsers: ({ userAuthToken }: { userAuthToken: string }) =>
      requestBuilder({
        method: "GET",
        url: "/users",
        userAuthToken,
        responseType: "json",
      }),
    blockUsers: ({
      userAuthToken,
      id,
      data,
    }: {
      userAuthToken: string;
      id: string;
      data: any;
    }) =>
      requestBuilder({
        method: "POST",
        url: `/users/${id}`,
        userAuthToken,
        data,
        responseType: "json",
      }),
  },
  profile: {
    getProfile: ({ userAuthToken }: { userAuthToken: string }) =>
      requestBuilder({
        method: "GET",
        url: "/profile",
        userAuthToken,
        responseType: "json",
      }),
    updateProfile: ({
      userAuthToken,
      data,
    }: {
      userAuthToken: string;
      data: any;
    }) =>
      requestBuilder({
        method: "PATCH",
        url: "/profile",
        userAuthToken,
        data,
        responseType: "json",
      }),
    updateAvatar: ({
      userAuthToken,
      data,
    }: {
      userAuthToken: string;
      data: any;
    }) =>
      requestBuilder({
        method: "PATCH",
        url: `/profile/update-avatar`,
        userAuthToken,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "json",
      }),
    deleteProfile: ({ userAuthToken }: { userAuthToken: string }) =>
      requestBuilder({
        method: "DELETE",
        url: "/profile",
        userAuthToken,
        responseType: "json",
      }),
  },
  roles: {
    getRoles: ({ userAuthToken }: { userAuthToken: string }) =>
      requestBuilder({
        method: "GET",
        url: "/roles",
        userAuthToken,
        responseType: "json",
      }),
    getRole: ({ userAuthToken, id }: { userAuthToken: string; id: string }) =>
      requestBuilder({
        method: "GET",
        url: `/roles/${id}`,
        userAuthToken,
        responseType: "json",
      }),
    createRole: ({
      userAuthToken,
      data,
    }: {
      userAuthToken: string;
      data: any;
    }) =>
      requestBuilder({
        method: "POST",
        url: "/roles",
        userAuthToken,
        responseType: "json",
        data,
      }),
    updateRole: ({
      userAuthToken,
      data,
      id,
    }: {
      userAuthToken: string;
      data: any;
      id: string;
    }) =>
      requestBuilder({
        method: "PATCH",
        url: `/roles/${id}`,
        userAuthToken,
        data,
        responseType: "json",
      }),
    deleteRole: ({
      userAuthToken,
      id,
    }: {
      userAuthToken: string;
      id: string;
    }) =>
      requestBuilder({
        method: "DELETE",
        url: `/roles/${id}`,
        userAuthToken,
        responseType: "json",
      }),
  },
  auditTrails: {
    getAuditTrails: ({ userAuthToken }: { userAuthToken: string }) =>
      requestBuilder({
        method: "GET",
        url: "/audit_trails",
        userAuthToken,
        responseType: "json",
      }),
  },
  blockedIps: {
    getBlockedIps: ({ userAuthToken }: { userAuthToken: string }) =>
      requestBuilder({
        method: "GET",
        url: "/blocked_ip",
        userAuthToken,
        responseType: "json",
      }),

    blockIp: ({ userAuthToken, data }: { userAuthToken: string; data: any }) =>
      requestBuilder({
        method: "POST",
        url: "/blocked_ip",
        userAuthToken,
        responseType: "json",
        data,
      }),

    unblockIp: ({ userAuthToken, id }: { userAuthToken: string; id: string }) =>
      requestBuilder({
        method: "DELETE",
        url: `/blocked_ip/${id}`,
        userAuthToken,
        responseType: "json",
      }),

    getBlockedIP: ({
      userAuthToken,
      id,
    }: {
      userAuthToken: string;
      id: string;
    }) =>
      requestBuilder({
        method: "GET",
        url: `/blocked_ip/${id}`,
        userAuthToken,
        responseType: "json",
      }),
  },
  notifications: {
    sendNotifications: ({
      userAuthToken,
      data,
    }: {
      userAuthToken: string;
      data: any;
    }) =>
      requestBuilder({
        method: "POST",
        url: "/notifications",
        userAuthToken,
        responseType: "json",
        data,
      }),
  },
};
