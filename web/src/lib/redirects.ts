const exceptPaths = ['/path1', '/path2']; // Define your exception paths here
export const redirectToLogin = () => {
  let redirected = false;
  if (!exceptPaths.includes(window.location.pathname)) {
    window.localStorage.clear();
    window.location.href = window.location.origin + "/login";
    redirected = true;
  }

  return redirected;
};