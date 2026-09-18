// Supabase JWT authentication and role-based authorization.
//
// Rules (from the approved architecture):
// - Backend must never trust a role supplied by the client.
// - Role comes from the `users` table, keyed by the Supabase Auth uid.
// - If auth is not configured, endpoints that require auth return 503
//   rather than silently allowing unauthenticated access.

const { getPublicClient, getAdminClient, isAuthConfigured } = require('../services/supabase');
const { unauthorized, forbidden, serviceUnavailable } = require('../utils/errors');

function extractBearer(req) {
  const h = req.headers.authorization || req.headers.Authorization;
  if (!h || typeof h !== 'string') return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

async function loadUserProfile(uid) {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('users')
    .select('id, name, email, role')
    .eq('id', uid)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Verify the JWT and attach req.user = { id, email, role }.
// Does NOT enforce a role; use requireRole() afterward.
async function authenticate(req, res, next) {
  try {
    if (!isAuthConfigured()) {
      throw serviceUnavailable('Authentication is not configured');
    }

    const token = extractBearer(req);
    if (!token) throw unauthorized('Missing bearer token');

    const supabase = getPublicClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) throw unauthorized('Invalid or expired token');

    const uid = data.user.id;
    const profile = await loadUserProfile(uid);

    if (!profile) {
      // Authenticated with Supabase but no application profile row yet.
      // Do not fabricate one here. Surface a clear error instead.
      throw forbidden('User profile not found. Contact an administrator.');
    }

    req.user = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role
    };
    req.accessToken = token;
    next();
  } catch (err) {
    next(err);
  }
}

// Require one of the given roles. Must run after authenticate().
function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return next(unauthorized('Authentication required'));
    if (!allowed.includes(req.user.role)) {
      return next(forbidden(`Requires role: ${allowed.join(', ')}`));
    }
    next();
  };
}

const isAdmin = (req, res, next) =>
  req.user?.role === 'ADMIN'
    ? next()
    : next(forbidden('Admin only'));

const isStaffOrAdmin = (req, res, next) =>
  req.user?.role === 'STAFF' || req.user?.role === 'ADMIN'
    ? next()
    : next(forbidden('Staff or admin only'));

module.exports = { authenticate, requireRole, isAdmin, isStaffOrAdmin };
