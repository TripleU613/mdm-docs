function unauthorized() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MDM Docs"',
    },
  });
}

export async function onRequest({ request, env, next }) {
  const user = env.BASIC_AUTH_USER;
  const pass = env.BASIC_AUTH_PASS;

  if (!user || !pass) {
    return new Response("Auth not configured", { status: 500 });
  }

  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = atob(auth.slice(6));
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) {
    return unauthorized();
  }

  const authUser = decoded.slice(0, separatorIndex);
  const authPass = decoded.slice(separatorIndex + 1);

  if (authUser !== user || authPass !== pass) {
    return unauthorized();
  }

  return next();
}
