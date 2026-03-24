import '../models/user.dart';

class AuthService {
  AuthService._();

  static final AuthService instance = AuthService._();

  AppUser? currentUser;

  bool get isLoggedIn => currentUser != null;

  void setUser(AppUser user) {
    currentUser = user;
  }

  void clear() {
    currentUser = null;
  }
}
