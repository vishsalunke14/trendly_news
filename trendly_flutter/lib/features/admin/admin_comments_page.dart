import 'package:flutter/material.dart';

import '../../models/admin_comment.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../core/url_utils.dart';

class AdminCommentsPage extends StatefulWidget {
  const AdminCommentsPage({super.key});

  @override
  State<AdminCommentsPage> createState() => _AdminCommentsPageState();
}

class _AdminCommentsPageState extends State<AdminCommentsPage> {
  bool _loading = false;
  String? _error;
  List<AdminComment> _comments = [];

  @override
  void initState() {
    super.initState();
    _loadComments();
  }

  Future<void> _loadComments() async {
    final user = AuthService.instance.currentUser;
    if (user == null || !user.role.toUpperCase().contains('ADMIN')) {
      setState(() {
        _error = 'Access denied. Admin only.';
        _comments = [];
      });
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final list = await ApiClient.instance.fetchAdminComments();
      setState(() {
        _comments = list;
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

  Future<void> _handleDelete(AdminComment c) async {
    final user = AuthService.instance.currentUser;
    if (user == null || !user.role.toUpperCase().contains('ADMIN')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Only admin can delete comments.')),
      );
      return;
    }

    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete comment'),
        content: const Text('Are you sure you want to delete this comment?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text(
              'Delete',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      await ApiClient.instance.deleteAdminComment(
        commentId: c.id,
        adminId: user.id,
      );
      setState(() {
        _comments.removeWhere((x) => x.id == c.id);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Comment deleted.')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Failed to delete comment: ${e.toString().replaceFirst('Exception: ', '')}',
          ),
        ),
      );
    }
  }

  String _formatDateTime(DateTime? dt) {
    if (dt == null) return '';
    return '${dt.year.toString().padLeft(4, '0')}-'
        '${dt.month.toString().padLeft(2, '0')}-'
        '${dt.day.toString().padLeft(2, '0')} '
        '${dt.hour.toString().padLeft(2, '0')}:'
        '${dt.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin – Comments'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadComments,
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_loading && _comments.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null && _comments.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          const SizedBox(height: 80),
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

    if (_comments.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 80),
          Center(
            child: Text(
              'No comments found.',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      );
    }

    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(12),
      itemCount: _comments.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final c = _comments[index];

        return Card(
          elevation: 1,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top row: ID + user + date
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'ID: ${c.id}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      _formatDateTime(c.createdAt),
                      style: const TextStyle(
                        fontSize: 10,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '${c.userName} (User ID: ${c.userId})',
                  style: const TextStyle(
                    fontSize: 11,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 6),
                GestureDetector(
                  onTap: () {
                    if (c.articleUrl.isNotEmpty) {
                      openUrlInBrowser(context, c.articleUrl);
                    }
                  },
                  child: Text(
                    c.articleUrl,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Colors.blue,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  c.content,
                  style: const TextStyle(fontSize: 13),
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton.icon(
                    onPressed: () => _handleDelete(c),
                    icon: const Icon(Icons.delete, size: 16, color: Colors.red),
                    label: const Text(
                      'Delete',
                      style: TextStyle(color: Colors.red),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
