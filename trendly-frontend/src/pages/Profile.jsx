import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiGet, apiPut } from "../apiClient";

export default function Profile() {
  const { user, login } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [nameInput, setNameInput] = useState("");

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Fetch profile
  const loadProfile = async () => {
    if (!user) return;

    try {
      setProfileLoading(true);
      setProfileError("");
      const data = await apiGet(`/api/users/${user.id}`);
      setProfile(data);
      setNameInput(data.name || "");
    } catch (err) {
      setProfileError("Failed to load profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line
  }, [user]);

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center shadow-xl">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-lg">🔐</div>
          <h1 className="text-lg font-semibold text-slate-50">Login Required</h1>
          <p className="mt-1 text-xs text-slate-400">Please login to manage your profile.</p>
        </div>
      </div>
    );
  }

  // Save name
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    try {
      setProfileError("");
      const updated = await apiPut(`/api/users/${user.id}`, { name: nameInput.trim() });

      setProfile(updated);

      // Update global context
      const updatedUser = { ...user, name: updated.name };
      login(updatedUser);
    } catch (err) {
      setProfileError("Failed to update profile.");
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!pwForm.currentPassword || !pwForm.newPassword) {
      setPwError("Please fill both fields.");
      return;
    }

    try {
      setPwLoading(true);
      await apiPut(`/api/users/${user.id}/password`, pwForm);

      setPwSuccess("Password updated successfully.");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwError("Failed to change password. Check current password.");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold animate-pulse shadow-lg">
            {user.name.charAt(0)}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your Profile</h1>
            <p className="text-[13px] text-slate-400">Manage your account details and password</p>
          </div>
        </div>

        {/* Error */}
        {profileError && (
          <div className="text-sm text-red-300 bg-red-900/40 border border-red-800/50 px-3 py-2 rounded-lg">
            {profileError}
          </div>
        )}

        {/* Account Details */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-4 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-slate-300">Account Details</h2>

          {profileLoading && <p className="text-xs text-slate-400">Loading…</p>}

          {profile && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/40 outline-none"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Role</label>
                <input
                  disabled
                  value={profile.role}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-lg shadow-indigo-600/30"
              >
                Save Changes
              </button>
            </form>
          )}
        </section>

        {/* Password Change */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl p-6 backdrop-blur-xl">
          <h2 className="text-sm font-semibold text-slate-300">Change Password</h2>
          <p className="text-[12px] text-slate-400 mb-2">
            Enter your current and new password.
          </p>

          {pwError && <p className="text-xs text-red-400 mb-1">{pwError}</p>}
          {pwSuccess && <p className="text-xs text-green-400 mb-1">{pwSuccess}</p>}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/40 outline-none"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600/40 outline-none"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm((prev) => ({ ...prev, newPassword: e.target.value }))
                }
              />
            </div>

            <button
              type="submit"
              disabled={pwLoading}
              className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs transition disabled:opacity-50"
            >
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
