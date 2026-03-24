import 'package:flutter/material.dart';

import 'features/auth/login_page.dart';
import 'features/home/home_page.dart';
import 'features/profile/profile_page.dart';
import 'features/bookmarks/bookmarks_page.dart';
import 'features/root/main_screen.dart';
import 'features/admin/admin_dashboard_page.dart';
import 'features/admin/admin_comments_page.dart';




void main() {
  runApp(const TrendlyApp());
}

class TrendlyApp extends StatelessWidget {
  const TrendlyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Trendly',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      initialRoute: '/login',
      routes: {
        '/login': (_) => const LoginPage(),
        '/home': (_) => const HomePage(),
        '/profile': (_) => const ProfilePage(),
        '/bookmarks': (_) => const BookmarksPage(),
        '/main': (_) => const MainScreen(), 
        '/admin': (_) => const AdminDashboardPage(),
        '/admin/comments': (_) => const AdminCommentsPage(),



      },
    );
  }
}
