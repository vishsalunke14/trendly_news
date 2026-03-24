import 'package:flutter/material.dart';

import '../../models/admin_analytics.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import 'admin_comments_page.dart';


class AdminDashboardPage extends StatefulWidget {
  const AdminDashboardPage({super.key});

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  bool _loading = false;
  String? _error;
  AdminAnalytics? _data;

  @override
  void initState() {
    super.initState();
    _loadAnalytics();
  }

  Future<void> _loadAnalytics() async {
    final user = AuthService.instance.currentUser;
    if (user == null || user.role.toUpperCase() != 'ADMIN') {
      setState(() {
        _error = 'Access denied. Admin only.';
      });
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final analytics = await ApiClient.instance.fetchAdminAnalytics();
      setState(() {
        _data = analytics;
      });
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.instance.currentUser;

   return Scaffold(
  appBar: AppBar(
    title: const Text('Admin Dashboard'),
  ),
  body: RefreshIndicator(
    onRefresh: _loadAnalytics,
    child: _buildBody(),
  ),
  floatingActionButton: FloatingActionButton.extended(
    onPressed: () {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const AdminCommentsPage()),
      );
    },
    icon: const Icon(Icons.comment),
    label: const Text('Manage Comments'),
  ),
);

  }

  Widget _buildBody() {
    if (_loading && _data == null && _error == null) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null && _data == null) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          const SizedBox(height: 100),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              'Error: $_error',
              style: const TextStyle(color: Colors.red, fontSize: 13),
            ),
          ),
        ],
      );
    }

    if (_data == null) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 100),
          Center(
            child: Text(
              'No analytics data.',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      );
    }

    final d = _data!;

    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _statCard('Users', d.totalUsers, Icons.people),
            _statCard('Likes', d.totalLikes, Icons.favorite),
            _statCard('Comments', d.totalComments, Icons.comment),
            _statCard('Bookmarks', d.totalBookmarks, Icons.bookmark),
          ],
        ),
        const SizedBox(height: 16),
        _sectionTitle('Top Liked Articles'),
        const SizedBox(height: 8),
        if (d.topLikedArticles.isEmpty)
          const Text(
            'No data.',
            style: TextStyle(fontSize: 12, color: Colors.grey),
          )
        else
          Column(
  children: d.topLikedArticles
      .map((a) => _articleStatTile(a, label: 'Likes'))
      .toList(),
),

        const SizedBox(height: 16),
        _sectionTitle('Top Commented Articles'),
        const SizedBox(height: 8),
        if (d.topCommentedArticles.isEmpty)
          const Text(
            'No data.',
            style: TextStyle(fontSize: 12, color: Colors.grey),
          )
        else
          Column(
  children: d.topCommentedArticles
      .map((a) => _articleStatTile(a, label: 'Comments'))
      .toList(),
),

        const SizedBox(height: 32),
      ],
    );
  }

  Widget _statCard(String label, int value, IconData icon) {
    return SizedBox(
      width: 160,
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 2,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Icon(icon, size: 24),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Colors.grey,
                    ),
                  ),
                  Text(
                    value.toString(),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionTitle(String text) {
    return Text(
      text,
      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
    );
  }

   Widget _articleStatTile(AdminArticleCount a, {required String label}) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        title: Text(
          a.articleUrl,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(
          '$label: ${a.count}',
          style: const TextStyle(fontSize: 11),
        ),
        onTap: () {
          // later: open URL if you want using url_launcher
        },
      ),
    );
  }

}
