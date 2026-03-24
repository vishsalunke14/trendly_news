import 'package:flutter/material.dart';

import '../../models/article.dart';
import '../../services/auth_service.dart';
import '../../services/news_api_service.dart';
import '../../services/api_client.dart';
import '../../core/url_utils.dart';
import '../comments/article_comments_page.dart';




class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _loading = false;
  String? _error;
  List<Article> _articles = [];

  @override
  void initState() {
    super.initState();
    _loadNews();
  }

  Future<void> _loadNews() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final list = await NewsApiService.instance.fetchTopHeadlines(
        country: 'us',
        // category: 'general',
      );
      setState(() {
        _articles = list;
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

  String _formatDate(DateTime? dt) {
    if (dt == null) return '';
    return '${dt.day.toString().padLeft(2, '0')}-'
        '${dt.month.toString().padLeft(2, '0')}-'
        '${dt.year}';
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.instance.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          user != null ? 'Trendly - Hi, ${user.name}' : 'Trendly - News',
        ),
       actions: [
  IconButton(
    icon: const Icon(Icons.refresh),
    onPressed: _loading ? null : _loadNews,
  ),
],


      ),
      body: RefreshIndicator(
        onRefresh: _loadNews,
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_loading && _articles.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_error != null && _articles.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: 100),
          Center(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                _error!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          ),
        ],
      );
    }

    if (_articles.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 100),
          Center(
            child: Text(
              'No news found.',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      );
    }

    return ListView.separated(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(12),
      itemCount: _articles.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final article = _articles[index];
        return _NewsCard(article: article);
      },
    );
  }
}

class _NewsCard extends StatefulWidget {
  final Article article;

  const _NewsCard({required this.article});

  @override
  State<_NewsCard> createState() => _NewsCardState();
}

class _NewsCardState extends State<_NewsCard> {
  bool _savingBookmark = false;
  bool _bookmarked = false;
  String? _error;

  bool _liking = false;
  bool _liked = false;
  int? _likeCount;

  Future<void> _handleBookmark() async {
    final user = AuthService.instance.currentUser;

    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login to bookmark articles.')),
      );
      return;
    }

    if (widget.article.url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('This article has no URL to bookmark.')),
      );
      return;
    }

    setState(() {
      _savingBookmark = true;
      _error = null;
    });

    try {
      await ApiClient.instance.addBookmark(
        userId: user.id,
        article: widget.article,
      );

      setState(() {
        _bookmarked = true;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Bookmarked!')),
      );
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to bookmark: $_error'),
        ),
      );
    } finally {
      setState(() {
        _savingBookmark = false;
      });
    }
  }

  Future<void> _handleLike() async {
    final user = AuthService.instance.currentUser;

    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login to like articles.')),
      );
      return;
    }

    if (widget.article.url.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('This article has no URL to like.')),
      );
      return;
    }

    setState(() {
      _liking = true;
      _error = null;
    });

    try {
      final result = await ApiClient.instance.toggleLike(
        userId: user.id,
        articleUrl: widget.article.url,
      );

      setState(() {
        _liked = result.liked;
        _likeCount = result.likeCount;
      });
    } catch (e) {
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to like/unlike: $_error'),
        ),
      );
    } finally {
      setState(() {
        _liking = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final article = widget.article;
    final hasImage = article.imageUrl.isNotEmpty;

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          openUrlInBrowser(context, article.url);
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (hasImage)
              SizedBox(
                height: 180,
                width: double.infinity,
                child: Image.network(
                  article.imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: Colors.grey[300],
                    child: const Center(
                      child: Icon(Icons.broken_image, size: 40),
                    ),
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (article.sourceName.isNotEmpty)
                    Text(
                      article.sourceName,
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[700],
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  const SizedBox(height: 4),
                  Text(
                    article.title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (article.description.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Text(
                      article.description,
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 13, color: Colors.grey[800]),
                    ),
                  ],
                  const SizedBox(height: 8),
                 Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [
    // LIKE BUTTON + COUNT
    Row(
      children: [
        TextButton.icon(
          onPressed: _liking ? null : _handleLike,
          icon: Icon(
            _liked ? Icons.favorite : Icons.favorite_border,
            color: Colors.pink,
          ),
          label: Text(_liked ? 'Liked' : 'Like'),
        ),
        if (_likeCount != null)
          Text(
            '($_likeCount)',
            style: const TextStyle(fontSize: 11, color: Colors.grey),
          ),
      ],
    ),

    // COMMENTS BUTTON
    TextButton.icon(
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ArticleCommentsPage(article: widget.article),
          ),
        );
      },
      icon: const Icon(Icons.comment_outlined),
      label: const Text('Comments'),
    ),

    // BOOKMARK BUTTON
    TextButton.icon(
      onPressed:
          _savingBookmark || _bookmarked ? null : _handleBookmark,
      icon: Icon(
        _bookmarked ? Icons.bookmark : Icons.bookmark_border,
      ),
      label: Text(
        _bookmarked ? 'Bookmarked' : 'Bookmark',
      ),
    ),
  ],
),

                  if (_error != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        _error!,
                        style: const TextStyle(color: Colors.red, fontSize: 11),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

