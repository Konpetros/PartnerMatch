import React, { useState, useEffect } from 'react';
import { Lock, Trash2, Bell, Eye, EyeOff, AlertTriangle, Check, Shield } from 'lucide-react';
import { updateUserPassword, deleteUserAccount, isEmailPasswordUser, reauthenticateUser } from '../services/firebase/auth';
import { deleteUserData, saveUserSettings, getUserSettings, saveProfilePrivacySettings } from '../services/firebase/firestore';

interface SettingsPanelProps {
  currentUserUid: string;
  onAccountDeleted: () => void;
}

export default function SettingsPanel({ currentUserUid, onAccountDeleted }: SettingsPanelProps) {
  const [isEmailUser] = useState(() => isEmailPasswordUser());

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // Privacy preferences state
  const [showEmailOnProfile, setShowEmailOnProfile] = useState(true);
  const [showLocationOnProfile, setShowLocationOnProfile] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [privacySaved, setPrivacySaved] = useState(false);

  useEffect(() => {
    getUserSettings(currentUserUid).then(settings => {
      setEmailNotifications(settings.emailNotifications);
      setShowEmailOnProfile(settings.showEmailOnProfile);
      setShowLocationOnProfile(settings.showLocationOnProfile);
      setProfilePublic(settings.profilePublic);
    });
  }, [currentUserUid]);

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPasswordError('Current password is incorrect.');
      } else {
        setPasswordError('Failed to update password. Please try again.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }
    if (isEmailUser && !deletePassword) {
      setDeleteError('Please enter your password to confirm deletion.');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');
    try {
      // Step 1: Validate credentials FIRST — throws immediately if the password is wrong,
      // before any Firestore or Storage data is touched.
      if (isEmailUser) {
        await reauthenticateUser(deletePassword);
      }
      // Step 2: Now that identity is confirmed, clean up Firestore/Storage data
      // while the user is still authenticated.
      await deleteUserData(currentUserUid);
      // Step 3: Finally delete the Firebase Auth account itself. No password needed
      // here since reauthentication already happened in Step 1.
      await deleteUserAccount();
      onAccountDeleted();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setDeleteError('Incorrect password.');
      } else {
        setDeleteError('Failed to delete account. Please try again.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setEmailNotifications(value);
    setNotifLoading(true);
    try {
      await saveUserSettings(currentUserUid, { emailNotifications: value });
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2000);
    } catch {
      // silent fail
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-black text-slate-800 font-sans tracking-tight">Account Settings</h2>
        <p className="text-xs text-slate-500 mt-1">Manage your account preferences and security.</p>
      </div>

      {/* Privacy & Visibility */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-brand-primary" />
          <h3 className="text-sm font-bold text-slate-800">Privacy & Visibility</h3>
          {privacySaved && <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1"><Check className="w-3 h-3" /><span>Saved</span></span>}
        </div>
        <p className="text-xs text-slate-500">Control what information is visible to other organisations on PartnerMatch.</p>
        <div className="space-y-3 divide-y divide-slate-50">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-semibold text-slate-700">Show email on listings & profile</p>
              <p className="text-[11px] text-slate-400">Your contact email will be visible to other users</p>
            </div>
            <button
              onClick={async () => {
                const val = !showEmailOnProfile;
                setShowEmailOnProfile(val);
                await saveUserSettings(currentUserUid, { showEmailOnProfile: val });
                await saveProfilePrivacySettings(currentUserUid, { showEmailOnProfile: val });
                setPrivacySaved(true);
                setTimeout(() => setPrivacySaved(false), 2000);
              }}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${showEmailOnProfile ? 'bg-brand-primary' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${showEmailOnProfile ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">Show city/location on profile</p>
              <p className="text-[11px] text-slate-400">Your city will be shown alongside your country</p>
            </div>
            <button
              onClick={async () => {
                const val = !showLocationOnProfile;
                setShowLocationOnProfile(val);
                await saveUserSettings(currentUserUid, { showLocationOnProfile: val });
                await saveProfilePrivacySettings(currentUserUid, { showLocationOnProfile: val });
                setPrivacySaved(true);
                setTimeout(() => setPrivacySaved(false), 2000);
              }}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${showLocationOnProfile ? 'bg-brand-primary' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${showLocationOnProfile ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">Make organisation profile public</p>
              <p className="text-[11px] text-slate-400">Your organisation page will be discoverable by others</p>
            </div>
            <button
              onClick={async () => {
                const val = !profilePublic;
                setProfilePublic(val);
                await saveUserSettings(currentUserUid, { profilePublic: val });
                await saveProfilePrivacySettings(currentUserUid, { profilePublic: val });
                setPrivacySaved(true);
                setTimeout(() => setPrivacySaved(false), 2000);
              }}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${profilePublic ? 'bg-brand-primary' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${profilePublic ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
          <div>
            <p className="text-sm font-bold text-slate-700">Email Notifications <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full ml-1">Coming Soon</span></p>
            <p className="text-xs text-slate-500 font-medium">Receive email updates when someone contacts you</p>
          </div>
          <button
            disabled
            className="relative w-11 h-6 rounded-full bg-slate-200 cursor-not-allowed focus:outline-none"
          >
            <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow" />
          </button>
        </div>
      </div>

      {/* Change Password — email users only */}
      {isEmailUser && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-brand-primary" />
            <h3 className="text-sm font-bold text-slate-800">Change Password</h3>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all"
              />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New password (min 6 characters)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all"
              />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-primary transition-all"
            />
          </div>

          {passwordError && (
            <p className="text-xs text-red-600 font-semibold">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1"><Check className="w-3 h-3" /><span>Password updated successfully.</span></p>
          )}

          <button
            onClick={handleChangePassword}
            disabled={passwordLoading}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover disabled:bg-slate-300 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      )}

      {/* Delete Account */}
      <div className="bg-white rounded-2xl border border-red-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <Trash2 className="w-4 h-4 text-red-500" />
          <h3 className="text-sm font-bold text-red-700">Delete Account</h3>
        </div>
        <p className="text-xs text-slate-500">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-xl border border-red-100">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-semibold">This will permanently delete your profile, all your listings, and your account. Type <strong>DELETE</strong> below to confirm.</p>
            </div>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder='Type DELETE to confirm'
              className="w-full bg-slate-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-red-400 transition-all"
            />

            {isEmailUser && (
              <div className="relative">
                <input
                  type={showDeletePw ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  placeholder="Enter your password to confirm"
                  className="w-full bg-slate-50 border border-red-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-slate-700 outline-none focus:border-red-400 transition-all"
                />
                <button type="button" onClick={() => setShowDeletePw(!showDeletePw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                  {showDeletePw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {deleteError && (
              <p className="text-xs text-red-600 font-semibold">{deleteError}</p>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); setDeletePassword(''); setDeleteError(''); }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirmText !== 'DELETE'}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
