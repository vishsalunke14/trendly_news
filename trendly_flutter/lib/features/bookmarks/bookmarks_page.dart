import 'package:flutter/material.dart';

import '../../models/bookmark.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';
import '../../core/url_utils.dart';

class BookmarksPage extends StatefulWidget {
  const BookmarksPage({super.key});

  @override
  State<BookmarksPage> createState() => _BookmarksPageState();
}

class _BookmarksPageState extends State<BookmarksPage> {
  bool _loading = false;
  String? _error;
  List<Bookmark> _bookmarks = [];

  @override
  void initState() {
    super.initState();
    _loadBookmarks();
  }

  Future<void> _loadBookmarks() async {
    final user = AuthService.instance.currentUser;
    if (user == null) {
      setState(() {
        _error = 'Please login to view bookmarks.';
        _bookmarks = [];
      });
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final list = await ApiClient.instance.fetchBookmarksForUser(user.id);
      setState(() {
        _bookmarks = list;
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

  Future<void> _handleDelete(Bookmark b) async {
    final user = AuthService.instance.currentUser;
    if (user == null) return;

    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remove bookmark'),
        content: Text('Remove "${b.title}" from bookmarks?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text(
              'Remove',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      await ApiClient.instance.deleteBookmark(b.id, user.id);
      setState(() {
        _bookmarks.removeWhere((x) => x.id == b.id);
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Failed to remove bookmark: ${e.toString().replaceFirst('Exception: ', '')}',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Bookmarks'),
      ),
      body: RefreshIndicator(
        onRefresh: _loadBookmarks,
        child: _buildBody(user != null),
      ),
    );
  }

  Widget _buildBody(bool isLoggedIn) {
    if (!isLoggedIn) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 100),
          Center(
            child: Text(
              'Please login to view your bookmarks.',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      );
    }

    if (_loading && _bookmarks.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_error != null && _bookmarks.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          const SizedBox(height: 100),
          Center(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'Error: ',
                style: TextStyle(fontSize: 12),
              ),
            ),
          ),
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                _error!,
                style: const TextStyle(color: Colors.red, fontSize: 12),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ],
      );
    }

    if (_bookmarks.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 100),
          Center(
            child: Text(
              'You have no bookmarks yet.',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      );
    }

    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(12),
      itemCount: _bookmarks.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final b = _bookmarks[index];
        return Card(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: ListTile(
            contentPadding: const EdgeInsets.all(12),
            leading: b.imageUrl.isNotEmpty
                ? SizedBox(
                    width: 60,
                    height: 60,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        b.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            const Icon(Icons.broken_image),
                      ),
                    ),
                  )
                : const Icon(Icons.article),
            title: Text(
              b.title,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            subtitle: Text(
              b.sourceName,
              style: const TextStyle(fontSize: 11, color: Colors.grey),
            ),
            trailing: IconButton(
              icon: const Icon(Icons.bookmark_remove, color: Colors.red),
              onPressed: () => _handleDelete(b),
            ),
           onTap: () {
  openUrlInBrowser(context, b.articleUrl);
},

          ),
        );
      },
    );
  }
}
