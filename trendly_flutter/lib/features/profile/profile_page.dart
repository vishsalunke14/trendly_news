import 'package:flutter/material.dart';

import '../../models/user.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  AppUser? _profile;
  bool _loadingProfile = false;
  String? _profileError;

  final _nameController = TextEditingController();

  final _currentPwController = TextEditingController();
  final _newPwController = TextEditingController();
  bool _changingPassword = false;
  String? _pwError;
  String? _pwSuccess;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _currentPwController.dispose();
    _newPwController.dispose();
    super.dispose();
  }

  Future<void> _loadProfile() async {
    final user = AuthService.instance.currentUser;
    if (user == null) return;

    setState(() {
      _loadingProfile = true;
      _profileError = null;
    });

    try {
      final fresh = await ApiClient.instance.fetchUserById(user.id);
      setState(() {
        _profile = fresh;
        _nameController.text = fresh.name;
      });

      // update global AuthService user too
      AuthService.instance.setUser(fresh);
    } catch (e) {
      setState(() {
        _profileError = e.toString().replaceFirst('Exception: ', '');
        _profile = user; // fallback to local
        _nameController.text = user.name;
      });
    } finally {
      setState(() {
        _loadingProfile = false;
      });
    }
  }

  Future<void> _handleSaveProfile() async {
    final user = AuthService.instance.currentUser;
    if (user == null) return;

    final newName = _nameController.text.trim();
    if (newName.isEmpty) return;

    setState(() {
      _profileError = null;
    });

    try {
      final updated = await ApiClient.instance.updateProfile(
        userId: user.id,
        name: newName,
      );

      setState(() {
        _profile = updated;
      });

      // update AuthService
      AuthService.instance.setUser(updated);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile updated.')),
      );
    } catch (e) {
      setState(() {
        _profileError = e.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  Future<void> _handleChangePassword() async {
    final user = AuthService.instance.currentUser;
    if (user == null) return;

    final currentPw = _currentPwController.text.trim();
    final newPw = _newPwController.text.trim();

    setState(() {
      _pwError = null;
      _pwSuccess = null;
    });

    if (currentPw.isEmpty || newPw.isEmpty) {
      setState(() {
        _pwError = 'Please enter both current and new password.';
      });
      return;
    }

    setState(() {
      _changingPassword = true;
    });

    try {
      await ApiClient.instance.changePassword(
        userId: user.id,
        currentPassword: currentPw,
        newPassword: newPw,
      );

      setState(() {
        _pwSuccess = 'Password updated successfully.';
        _currentPwController.clear();
        _newPwController.clear();
      });
    } catch (e) {
      setState(() {
        _pwError = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _changingPassword = false;
      });
    }
  }

  void _handleLogout() {
    AuthService.instance.clear();
    Navigator.pushNamedAndRemoveUntil(
      context,
      '/login',
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.instance.currentUser;

    if (user == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Profile')),
        body: const Center(
          child: Text('Please login to view your profile.'),
        ),
      );
    }

    final profile = _profile ?? user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            onPressed: _handleLogout,
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadProfile,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
         child: Column(
  crossAxisAlignment: CrossAxisAlignment.stretch,
  children: [
    if (_profileError != null)
      Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Text(
          _profileError!,
          style: const TextStyle(color: Colors.red, fontSize: 12),
        ),
      ),
    _buildAccountSection(profile),
    const SizedBox(height: 16),
    _buildPasswordSection(),
    const SizedBox(height: 16),

    // 👇 Only for admins
    if (profile.role.toUpperCase() == 'ADMIN')
      ElevatedButton.icon(
        onPressed: () {
          Navigator.pushNamed(context, '/admin');
        },
        icon: const Icon(Icons.admin_panel_settings),
        label: const Text('Open Admin Panel'),
      ),
  ],
),

        ),
      ),
    );
  }

  Widget _buildAccountSection(AppUser profile) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Account Details',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 8),
            if (_loadingProfile)
              const Padding(
                padding: EdgeInsets.only(bottom: 8),
                child: Text(
                  'Loading latest profile...',
                  style: TextStyle(fontSize: 11, color: Colors.grey),
                ),
              ),

            // editable name
            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
            const SizedBox(height: 12),

            // read-only email
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Email',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 4),
                Container(
                  width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: Colors.grey),
                    color: Colors.grey.shade100,
                  ),
                  child: Text(
                    profile.email,
                    style: const TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // read-only role
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Role',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 4),
                Container(
                  width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: Colors.grey),
                    color: Colors.grey.shade100,
                  ),
                  child: Text(
                    profile.role,
                    style: const TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                onPressed: _handleSaveProfile,
                child: const Text('Save Changes'),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildPasswordSection() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Change Password',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 8),
            if (_pwError != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  _pwError!,
                  style: const TextStyle(color: Colors.red, fontSize: 12),
                ),
              ),
            if (_pwSuccess != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  _pwSuccess!,
                  style: const TextStyle(color: Colors.green, fontSize: 12),
                ),
              ),
            TextField(
              controller: _currentPwController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Current Password',
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _newPwController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'New Password',
                border: OutlineInputBorder(),
                isDense: true,
              ),
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                onPressed: _changingPassword ? null : _handleChangePassword,
                child: _changingPassword
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Update Password'),
              ),
            )
          ],
        ),
      ),
    );
  }
}
