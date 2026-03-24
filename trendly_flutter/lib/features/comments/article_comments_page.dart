import 'package:flutter/material.dart';

import '../../models/article.dart';
import '../../models/comment.dart';
import '../../services/api_client.dart';
import '../../services/auth_service.dart';

class ArticleCommentsPage extends StatefulWidget {
  final Article article;

  const ArticleCommentsPage({super.key, required this.article});

  @override
  State<ArticleCommentsPage> createState() => _ArticleCommentsPageState();
}

class _ArticleCommentsPageState extends State<ArticleCommentsPage> {
  bool _loading = false;
  String? _error;
  List<Comment> _comments = [];

  final _commentController = TextEditingController();
  bool _posting = false;

  @override
  void initState() {
    super.initState();
    _loadComments();
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _loadComments() async {
    if (widget.article.url.isEmpty) {
      setState(() {
        _error = 'This article has no URL for comments.';
        _comments = [];
      });
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final list = await ApiClient.instance
          .fetchCommentsForArticle(widget.article.url);

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

  Future<void> _handleAddComment() async {
    final user = AuthService.instance.currentUser;
    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login to add comments.')),
      );
      return;
    }

    final text = _commentController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _posting = true;
      _error = null;
    });

    try {
      final created = await ApiClient.instance.addComment(
        userId: user.id,
        userName: user.name,
        articleUrl: widget.article.url,
        content: text,
      );

      setState(() {
        _comments.insert(0, created); // add at top
        _commentController.clear();
      });
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _posting = false;
      });
    }
  }

  Future<void> _handleDeleteComment(Comment c) async {
    final user = AuthService.instance.currentUser;
    if (user == null) return;

    if (c.userId != user.id) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You can delete only your own comments.'),
        ),
      );
      return;
    }

    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete comment'),
        content: const Text('Do you want to delete this comment?'),
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
      await ApiClient.instance.deleteComment(c.id, user.id);
      setState(() {
        _comments.removeWhere((x) => x.id == c.id);
      });
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
    return '${dt.day.toString().padLeft(2, '0')}-'
        '${dt.month.toString().padLeft(2, '0')}-'
        '${dt.year} '
        '${dt.hour.toString().padLeft(2, '0')}:'
        '${dt.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Comments',
          overflow: TextOverflow.ellipsis,
        ),
        // subtitle: Text(
        //   widget.article.title,
        //   overflow: TextOverflow.ellipsis,
        //   style: const TextStyle(fontSize: 11),
        // ),
      ),
      body: Column(
        children: [
          if (_error != null)
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(
                _error!,
                style: const TextStyle(color: Colors.red, fontSize: 12),
              ),
            ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: _loadComments,
              child: _buildCommentsList(),
            ),
          ),
          const Divider(height: 1),
          _buildInputArea(user != null),
        ],
      ),
    );
  }

  Widget _buildCommentsList() {
    if (_loading && _comments.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_comments.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 80),
          Center(
            child: Text(
              'No comments yet. Be the first!',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      );
    }

    final user = AuthService.instance.currentUser;
    final currentUserId = user?.id;

    return ListView.separated(
      padding: const EdgeInsets.all(12),
      itemCount: _comments.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final c = _comments[index];
        final isMine = currentUserId != null && c.userId == currentUserId;

        return Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    c.userName,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                  Row(
                    children: [
                      if (c.createdAt != null)
                        Text(
                          _formatDateTime(c.createdAt),
                          style: const TextStyle(
                            fontSize: 10,
                            color: Colors.grey,
                          ),
                        ),
                      if (isMine) ...[
                        const SizedBox(width: 8),
                        GestureDetector(
                          onTap: () => _handleDeleteComment(c),
                          child: const Icon(
                            Icons.delete,
                            size: 16,
                            color: Colors.red,
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                c.content,
                style: const TextStyle(fontSize: 13),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildInputArea(bool isLoggedIn) {
    if (!isLoggedIn) {
      return Container(
        padding: const EdgeInsets.all(12),
        color: Colors.grey[100],
        child: const Text(
          'Login to add comments.',
          style: TextStyle(fontSize: 12, color: Colors.grey),
        ),
      );
    }

    return SafeArea(
      top: false,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        color: Colors.grey[100],
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _commentController,
                minLines: 1,
                maxLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Write a comment...',
                  border: OutlineInputBorder(),
                  isDense: true,
                  contentPadding:
                      EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton(
              onPressed: _posting ? null : _handleAddComment,
              icon: _posting
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.send),
            ),
          ],
        ),
      ),
    );
  }
}
