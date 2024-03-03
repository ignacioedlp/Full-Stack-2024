export const redirectToLogin = () => {
  let redirected = false;
  if (!exceptPaths.includes(window.location.pathname)) {
    window.localStorage.clear();
    window.location = window.location.origin + "/login";
    redirected = true;
  }

  return redirected;
};