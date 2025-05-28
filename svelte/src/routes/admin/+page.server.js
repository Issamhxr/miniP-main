import { redirect, fail } from "@sveltejs/kit";
import { pb } from "$lib/pb";

/**
 * Handles admin login POST request. If successful, redirects to /admin/tickets.
 * If not, returns an error message.
 */
export const actions = {
  default: async ({ request, cookies, url }) => {
    const form = await request.formData();
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    console.log("HEADERS", Object.fromEntries(request.headers.entries()));
    try {
      const authData = await pb.collection("users").authWithPassword(email, password);
      if (authData?.record?.userType?.toLowerCase() !== "admin") {
        pb.authStore.clear();
        return fail(401, { error: "You are not an admin." });
      }
      cookies.set('pb_auth', pb.authStore.exportToCookie(), { path: '/', httpOnly: true });

      // Always return a result for enhanced forms
      if (request.headers.get('x-sveltekit-action')) {
        return {
          type: 'redirect',
          status: 303,
          location: '/admin/tickets'
        };
      }
      // Only throw for non-enhanced forms
      throw redirect(307, "/admin/tickets");
    } catch (e) {
      // Always return for enhanced forms
      if (request.headers.get('x-sveltekit-action')) {
        return fail(401, { error: e && typeof e === 'object' && 'message' in e ? e.message : JSON.stringify(e) });
      }
      // Only throw for non-enhanced forms
      throw redirect(307, "/admin");
    }
  }
};
